"use client";

import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { AdminOrganizationTermMembersTable } from "./admin-organization-term-members-table";
import { AdminClergyNewTermForm } from "@/components/admin/clergy/admin-clergy-new-term-form";
import {
  createEmptyExecutiveMember,
  normalizeExecutiveMembers,
} from "@/lib/organization/executive-members";
import {
  downloadMembersExcelTemplate,
  exportMembersToExcel,
  parseMembersFromExcel,
} from "@/lib/organization/members-excel";
import {
  createExecutiveTerm,
  formatExecutiveTermDisplay,
  getExecutiveTermIds,
  getExecutiveTermKey,
  sortExecutiveTermsNewestFirst,
} from "@/lib/organization/executive-terms";
import type {
  ExecutiveMember,
  ExecutiveTerm,
  OrganizationTerm,
} from "@/lib/organization/types";
import { cn } from "@/lib/utils";
import { slugify } from "@/shared/lib/slugify";

type AdminOrganizationMembersTabProps = {
  terms: ExecutiveTerm[];
  onTermsChange: Dispatch<SetStateAction<ExecutiveTerm[]>>;
  onError: (message: string) => void;
  onImportMessage: (message: string) => void;
  onUploadImage: (file: File) => Promise<string>;
};

export function AdminOrganizationMembersTab({
  terms,
  onTermsChange,
  onError,
  onImportMessage,
  onUploadImage,
}: AdminOrganizationMembersTabProps) {
  const [showNewTermForm, setShowNewTermForm] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const importTermIndexRef = useRef<number | null>(null);

  const sortedTerms = useMemo(() => sortExecutiveTermsNewestFirst(terms), [terms]);

  function findTermIndex(termKey: string): number {
    return terms.findIndex((term) => getExecutiveTermKey(term) === termKey);
  }

  function handleCreateTerm(term: OrganizationTerm) {
    if (terms.some((existing) => existing._id === term.id)) {
      onError("Khóa này đã tồn tại trong danh sách.");
      return;
    }

    onError("");
    onTermsChange((current) => [
      ...current,
      createExecutiveTerm(term, { isCurrent: current.length === 0 }),
    ]);
    setShowNewTermForm(false);
  }

  function handleRemoveTerm(termKey: string) {
    onTermsChange(terms.filter((term) => getExecutiveTermKey(term) !== termKey));
  }

  function handleUpdateTerm(index: number, updates: Partial<ExecutiveTerm>) {
    onTermsChange((current) =>
      current.map((term, termIndex) => {
        if (termIndex !== index) {
          return updates.isCurrent ? { ...term, isCurrent: false } : term;
        }

        return { ...term, ...updates };
      }),
    );
  }

  function handleAddMember(termIndex: number) {
    onTermsChange((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: [
                ...term.members,
                createEmptyExecutiveMember(term.members.length + 1),
              ],
            },
      ),
    );
  }

  function handleRemoveMember(termIndex: number, memberIndex: number) {
    onTermsChange((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: normalizeExecutiveMembers(
                term.members.filter((_, itemIndex) => itemIndex !== memberIndex),
              ),
            },
      ),
    );
  }

  function handleUpdateMember(
    termIndex: number,
    memberIndex: number,
    updates: Partial<ExecutiveMember>,
  ) {
    onTermsChange((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: term.members.map((member, itemIndex) =>
                itemIndex !== memberIndex ? member : { ...member, ...updates },
              ),
            },
      ),
    );
  }

  function handleReplaceMembers(termIndex: number, members: ExecutiveMember[]) {
    onTermsChange((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: normalizeExecutiveMembers(members),
            },
      ),
    );
  }

  function handleExportMembers(termIndex: number) {
    const term = terms[termIndex];
    const termSlug = term._id || slugify(term.name) || `khoa-${termIndex + 1}`;
    exportMembersToExcel(term.members, `thanh-vien-${termSlug}.xlsx`);
  }

  function handleImportMembersClick(termIndex: number) {
    importTermIndexRef.current = termIndex;
    importFileInputRef.current?.click();
  }

  async function handleImportMembersFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const termIndex = importTermIndexRef.current;

    event.target.value = "";

    if (!file || termIndex == null) {
      return;
    }

    onError("");
    onImportMessage("");

    const term = terms[termIndex];
    if (term.members.length > 0) {
      const confirmed = window.confirm(
        "Nhập Excel sẽ thay thế toàn bộ thành viên hiện tại của khóa này. Bạn có muốn tiếp tục?",
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      const { members, errors } = await parseMembersFromExcel(file);

      if (errors.length > 0) {
        onError(errors.join(" "));
        return;
      }

      handleReplaceMembers(termIndex, members);
      onImportMessage(`Đã nhập ${members.length} thành viên từ file Excel.`);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Không thể đọc file Excel.");
    } finally {
      importTermIndexRef.current = null;
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <input
        ref={importFileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        aria-label="Chọn file Excel thành viên"
        onChange={handleImportMembersFile}
      />

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Ban điều hành theo khóa</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Nhập hàng loạt bằng Excel. Bảng hỗ trợ tìm kiếm và phân trang khi có nhiều thành viên.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewTermForm((open) => !open)}
          className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Plus className="size-4" />
          Thêm khóa mới
        </button>
      </div>

      {showNewTermForm ? (
        <AdminClergyNewTermForm
          existingTermIds={getExecutiveTermIds(terms)}
          onClose={() => setShowNewTermForm(false)}
          onCreated={handleCreateTerm}
        />
      ) : null}

      {terms.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Chưa có khóa nào. Chọn năm bắt đầu và kết thúc để tạo khóa mới.
        </p>
      ) : (
        <div className="space-y-8">
          {sortedTerms.map((term) => {
            const termKey = getExecutiveTermKey(term);
            const tIdx = findTermIndex(termKey);

            return (
              <div
                key={termKey}
                className="rounded-xl border border-border bg-background p-5 shadow-sm"
              >
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                      Khóa nhiệm kỳ
                    </label>
                    <div className="rounded-[8px] border border-border bg-card px-3 py-2.5">
                      <p className="text-sm font-medium text-card-foreground">
                        {formatExecutiveTermDisplay(term)}
                      </p>
                      {term._id ? (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {term._id}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdateTerm(tIdx, { isCurrent: !term.isCurrent })}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition-colors",
                        term.isCurrent
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-border bg-card text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {term.isCurrent ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                      {term.isCurrent ? "Khóa hiện tại" : "Đặt làm khóa hiện tại"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(termKey)}
                      className="rounded-[8px] p-2 text-red-500 transition-colors hover:bg-red-50"
                      title="Xóa khóa"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <AdminOrganizationTermMembersTable
                  termIndex={tIdx}
                  members={term.members}
                  onAddMember={() => handleAddMember(tIdx)}
                  onRemoveMember={(memberIndex) => handleRemoveMember(tIdx, memberIndex)}
                  onUpdateMember={(memberIndex, updates) =>
                    handleUpdateMember(tIdx, memberIndex, updates)
                  }
                  onDownloadTemplate={downloadMembersExcelTemplate}
                  onImport={() => handleImportMembersClick(tIdx)}
                  onExport={() => handleExportMembers(tIdx)}
                  onUploadImage={onUploadImage}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
