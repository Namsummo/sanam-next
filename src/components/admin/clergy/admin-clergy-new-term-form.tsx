"use client";

import { useMemo, useState } from "react";
import { CalendarRange, X } from "lucide-react";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  buildCouncilTermId,
  validateCouncilTermYears,
} from "@/lib/clergy/admin-council-terms";
import { formatCouncilTermLabel } from "@/lib/clergy/council-terms";
import { parseTermId } from "@/lib/organization/terms";
import type { OrganizationTerm } from "@/lib/organization/types";
import { createAdminTerm } from "@/lib/organization/api";

type AdminClergyNewTermFormProps = {
  existingTermIds: string[];
  onClose: () => void;
  onCreated: (term: OrganizationTerm) => void;
};

export function AdminClergyNewTermForm({
  existingTermIds,
  onClose,
  onCreated,
}: AdminClergyNewTermFormProps) {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previewTerm = useMemo(() => {
    const start = Number(startYear);
    const end = Number(endYear);
    if (!startYear || !endYear || !Number.isFinite(start) || !Number.isFinite(end)) {
      return null;
    }

    return parseTermId(buildCouncilTermId(start, end));
  }, [endYear, startYear]);

  function handleClose() {
    setStartYear("");
    setEndYear("");
    setError("");
    onClose();
  }

  async function handleCreate() {
    const start = Number(startYear);
    const end = Number(endYear);
    const validationError = validateCouncilTermYears(start, end);

    if (validationError) {
      setError(validationError);
      return;
    }

    const termId = buildCouncilTermId(start, end);
    const term = parseTermId(termId);

    if (!term) {
      setError("Không thể tạo nhiệm kỳ. Vui lòng kiểm tra lại các năm.");
      return;
    }

    if (existingTermIds.includes(termId)) {
      setError("Nhiệm kỳ này đã tồn tại trong danh sách.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createAdminTerm(start, end);
      alert(`Đã tạo nhiệm kỳ mới ${start} – ${end} thành công và lưu vào cơ sở dữ liệu!`);
      setStartYear("");
      setEndYear("");
      onCreated(term);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo nhiệm kỳ.";
      if (errMsg.includes("đã tồn tại")) {
        alert(`Nhiệm kỳ ${start} – ${end} đã tồn tại trong hệ thống. Đang thêm vào danh sách.`);
        setStartYear("");
        setEndYear("");
        onCreated(term);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <CalendarRange className="size-4 text-accent" />
          Nhiệm kỳ mới
        </span>
        <Button
          type="button"
          variant="transparent"
          showIcon={false}
          onClick={handleClose}
          className="text-muted-foreground transition-colors hover:text-card-foreground"
          disabled={loading}
        >
          <X className="size-4" />
        </Button>
      </div>

      {error ? (
        <div className="mx-4 mt-3 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Năm bắt đầu
            </label>
            <Input
              type="number"
              inputMode="numeric"
              min={1900}
              max={2100}
              value={startYear}
              onChange={(event) => setStartYear(event.target.value)}
              placeholder="VD: 2023"
              className="bg-background"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Năm kết thúc
            </label>
            <Input
              type="number"
              inputMode="numeric"
              min={1900}
              max={2100}
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
              placeholder="VD: 2026"
              className="bg-background"
              disabled={loading}
            />
          </div>
        </div>

        {previewTerm ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Hiển thị:{" "}
            <span className="font-medium text-accent">
              {formatCouncilTermLabel(previewTerm)}
            </span>
            <span className="ml-2 font-mono text-card-foreground">({previewTerm.id})</span>
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleCreate}
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Thêm nhiệm kỳ"}
          </button>
          <AdminOutlineButton type="button" onClick={handleClose} disabled={loading}>
            Hủy
          </AdminOutlineButton>
        </div>
      </div>
    </div>
  );
}
