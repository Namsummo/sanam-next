"use client";

import { useMemo, useState } from "react";
import { Download, FileDown, FileUp, Plus, Search, Trash2 } from "lucide-react";
import { MemberImageUploader } from "./member-image-uploader";
import { EXECUTIVE_MEMBER_ROLES, normalizeExecutiveMemberRole } from "@/lib/organization/executive-member-roles";
import {
  EXECUTIVE_MEMBERS_PAGE_SIZE,
  filterIndexedExecutiveMembers,
  getMemberSortOrder,
  getTotalPages,
  paginateItems,
} from "@/lib/organization/executive-members";
import type { ExecutiveMember } from "@/lib/organization/types";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { AdminPersonSelector } from "../shared/admin-person-selector";
import { AdminOutlineButton } from "../shared/admin-outline-button";
import { AdminSelect } from "../shared/admin-select";
import { AdminPagination } from "../shared/admin-pagination";

type AdminOrganizationTermMembersTableProps = {
  termIndex: number;
  members: ExecutiveMember[];
  onAddMember: () => void;
  onRemoveMember: (memberIndex: number) => void;
  onUpdateMember: (memberIndex: number, updates: Partial<ExecutiveMember>) => void;
  onDownloadTemplate?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onUploadImage?: (file: File) => Promise<string>;
};

export function AdminOrganizationTermMembersTable({
  termIndex,
  members,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  onDownloadTemplate,
  onImport,
  onExport,
}: AdminOrganizationTermMembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredMembers = useMemo(
    () => filterIndexedExecutiveMembers(members, searchQuery),
    [members, searchQuery],
  );

  const totalPages = getTotalPages(filteredMembers.length, EXECUTIVE_MEMBERS_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const paginatedMembers = useMemo(
    () => paginateItems(filteredMembers, currentPage, EXECUTIVE_MEMBERS_PAGE_SIZE),
    [filteredMembers, currentPage],
  );

  const showPagination = filteredMembers.length > EXECUTIVE_MEMBERS_PAGE_SIZE;

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleAddMemberClick() {
    onAddMember();
    setPage(getTotalPages(members.length + 1, EXECUTIVE_MEMBERS_PAGE_SIZE));
  }

  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-card-foreground">Ban điều hành nhiệm kỳ</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {members.length} thành viên
            </span>
          </div>
          <label className="relative block max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Tìm tên, chức vụ..."
              className="bg-background pl-10"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onDownloadTemplate && (
            <AdminOutlineButton
              type="button"
              onClick={onDownloadTemplate}
              className="h-9 gap-1.5 px-3 text-xs hover:bg-white"
            >
              <Download className="size-3.5" />
              Tải mẫu Excel
            </AdminOutlineButton>
          )}
          {onImport && (
            <AdminOutlineButton
              type="button"
              onClick={onImport}
              className="h-9 gap-1.5 bg-blue-200 px-3 text-xs text-blue-800 hover:bg-blue-200"
            >
              <FileUp className="size-3.5" />
              Nhập Excel
            </AdminOutlineButton>
          )}
          {onExport && (
            <AdminOutlineButton
              type="button"
              onClick={onExport}
              disabled={members.length === 0}
              className="h-9 gap-1.5 bg-green-200 px-3 text-xs text-green-800 hover:bg-green-200"
            >
              <FileDown className="size-3.5" />
              Xuất Excel
            </AdminOutlineButton>
          )}
          <button
            type="button"
            onClick={handleAddMemberClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
          >
            <Plus className="size-3.5" />
            Thêm thành viên
          </button>
        </div>
      </div>

      {searchQuery.trim() ? (
        <p className="mb-3 text-xs text-muted-foreground">
          Hiển thị {filteredMembers.length}/{members.length} kết quả phù hợp
        </p>
      ) : null}

      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 shrink-0 px-2 text-center">STT</TableHead>
            <TableHead className="min-w-[320px] px-2">Hồ sơ giáo dân</TableHead>
            <TableHead className="min-w-[180px] px-2">Chức vụ trong hội đoàn</TableHead>
            <TableHead className="w-12 shrink-0 px-2" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                Chưa có thành viên nào trong ban điều hành khóa này. Hãy bấm "Thêm thành viên".
              </TableCell>
            </TableRow>
          ) : filteredMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                Không có thành viên phù hợp với từ khóa tìm kiếm.
              </TableCell>
            </TableRow>
          ) : (
            paginatedMembers.map(({ member, memberIndex }) => (
              <TableRow key={`${termIndex}-${memberIndex}`}>
                <TableCell className="w-12 shrink-0 px-2 text-center text-sm text-muted-foreground">
                  {getMemberSortOrder(member, memberIndex)}
                </TableCell>
                <TableCell className="min-w-[320px] px-2 whitespace-normal">
                  <AdminPersonSelector
                    value={member.personId || (member as any).id}
                    onChange={(pId, p) => {
                      onUpdateMember(memberIndex, {
                        personId: pId,
                        fullName: p?.fullName || member.fullName,
                        saintName: p?.saintName || member.saintName,
                        patronSaint: p?.saintName || member.patronSaint,
                        image: p?.profileImage || member.image,
                        birthday: p?.dateOfBirth || member.birthday,
                        parish: p?.giaoHo || member.parish,
                      });
                    }}
                    label=""
                  />
                </TableCell>
                <TableCell className="min-w-[180px] px-2 whitespace-normal">
                  <AdminSelect
                    value={normalizeExecutiveMemberRole(member.position) || member.position || ""}
                    onChange={(value) => onUpdateMember(memberIndex, { position: value })}
                    options={[...EXECUTIVE_MEMBER_ROLES]}
                    placeholder="Chọn chức vụ"
                    className="w-full"
                  />
                </TableCell>
                <TableCell className="w-12 shrink-0 px-2 text-right">
                  <AdminOutlineButton
                    type="button"
                    onClick={() => onRemoveMember(memberIndex)}
                    className="text-muted-foreground transition-colors hover:text-red-500"
                    title="Xóa khỏi ban điều hành"
                  >
                    <Trash2 className="size-4" />
                  </AdminOutlineButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showPagination ? (
        <div className="mt-4 border-t border-border pt-4">
          <AdminPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </div>
  );
}

