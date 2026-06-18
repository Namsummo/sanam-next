"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { BlogEditor } from "@/components/admin/news/blog-editor";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { MemberImageUploader } from "./member-image-uploader";
import { getToken } from "@/lib/admin/mock-auth";
import { uploadImage } from "@/shared/services/news-api";
import { createOrganization, updateOrganization } from "@/lib/organization/api";
import { slugify } from "@/shared/lib/slugify";
import type { Organization, ExecutiveTerm, ExecutiveMember } from "@/lib/organization/types";

type AdminOrganizationFormProps = {
  organization?: Organization;
};

export function AdminOrganizationForm({ organization }: AdminOrganizationFormProps) {
  const router = useRouter();
  const isEdit = !!organization;

  const [name, setName] = useState(organization?.name ?? "");
  const [slug, setSlug] = useState(organization?.slug ?? "");
  const [image, setImage] = useState<string | null>(organization?.image ?? null);
  const [memberCount, setMemberCount] = useState<number>(organization?.memberCount ?? 0);
  const [history, setHistory] = useState(organization?.history ?? "");
  const [isVisible, setIsVisible] = useState(organization?.isVisible ?? true);
  const [terms, setTerms] = useState<ExecutiveTerm[]>(organization?.terms ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const displayedSlug = useMemo(() => {
    if (slugManuallyEdited) return slug;
    if (isEdit) return organization?.slug ?? slug;
    return slugify(name);
  }, [name, slugManuallyEdited, isEdit, slug, organization?.slug]);

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  async function handleImageUpload(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadImage(token, file);
  }

  // Terms management
  function handleAddTerm() {
    setTerms([...terms, { name: "", isCurrent: terms.length === 0, members: [] }]);
  }

  function handleRemoveTerm(index: number) {
    setTerms(terms.filter((_, i) => i !== index));
  }

  function handleUpdateTerm(index: number, updates: Partial<ExecutiveTerm>) {
    const newTerms = [...terms];
    if (updates.isCurrent) {
      newTerms.forEach(t => t.isCurrent = false);
    }
    newTerms[index] = { ...newTerms[index], ...updates };
    setTerms(newTerms);
  }

  // Members management within a term
  function handleAddMember(termIndex: number) {
    const newTerms = [...terms];
    newTerms[termIndex].members.push({
      fullName: "",
      birthday: "",
      patronSaint: "",
      position: "",
      parish: "",
      image: "",
    });
    setTerms(newTerms);
  }

  function handleRemoveMember(termIndex: number, memberIndex: number) {
    const newTerms = [...terms];
    newTerms[termIndex].members = newTerms[termIndex].members.filter((_, i) => i !== memberIndex);
    setTerms(newTerms);
  }

  function handleUpdateMember(termIndex: number, memberIndex: number, updates: Partial<ExecutiveMember>) {
    const newTerms = [...terms];
    newTerms[termIndex].members[memberIndex] = { ...newTerms[termIndex].members[memberIndex], ...updates };
    setTerms(newTerms);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Tên đoàn thể không được để trống");
      return;
    }

    setSaving(true);

    try {
      const data = {
        name: name.trim(),
        slug: displayedSlug.trim() || undefined,
        image: image || undefined,
        memberCount: Number(memberCount),
        history,
        terms,
        isVisible,
      };

      if (isEdit && organization) {
        await updateOrganization(organization._id, data);
      } else {
        await createOrganization(data);
      }

      router.push("/admin/organizations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/organizations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về danh sách đoàn thể
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-card-foreground">
        {isEdit ? "Chỉnh sửa đoàn thể" : "Thêm đoàn thể mới"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 pb-20">
        {error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* Basic Info */}
        <div className="grid gap-6 md:grid-cols-2 rounded-[16px] border border-border bg-card p-6">
          <h2 className="md:col-span-2 text-lg font-semibold text-card-foreground">Thông tin chung</h2>
          
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Tên đoàn thể *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Ca đoàn Têrêxa"
              className="w-full rounded-[12px] border border-border bg-background px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Đường dẫn
            </label>
            <input
              type="text"
              value={displayedSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="tu-dong-tao-tu-ten"
              className="w-full rounded-[12px] border border-border bg-background px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Tổng số thành viên
            </label>
            <input
              type="number"
              value={memberCount}
              onChange={(e) => setMemberCount(parseInt(e.target.value) || 0)}
              className="w-full rounded-[12px] border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-[12px] border border-border bg-background px-4 py-3 text-sm text-card-foreground transition-colors hover:border-accent">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="size-4 accent-accent"
              />
              {isVisible ? (
                <Eye className="size-4 text-green-600" />
              ) : (
                <EyeOff className="size-4 text-muted-foreground" />
              )}
              <span>Hiển thị trên website</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Ảnh đoàn thể
            </label>
            <ImageUploader
              value={image}
              onChange={setImage}
              onUpload={handleImageUpload}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Lịch sử hình thành
            </label>
            <BlogEditor
              content={history}
              onChange={setHistory}
            />
          </div>
        </div>

        {/* Terms & Members */}
        <div className="rounded-[16px] border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Danh sách các Ban điều hành</h2>
            <button
              type="button"
              onClick={handleAddTerm}
              className="inline-flex items-center gap-2 rounded-[8px] bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="size-4" />
              Thêm khóa mới
            </button>
          </div>

          {terms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có khóa nào được tạo.</p>
          ) : (
            <div className="space-y-8">
              {terms.map((term, tIdx) => (
                <div key={tIdx} className="rounded-[12px] border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Tên Khóa</label>
                      <input
                        type="text"
                        value={term.name}
                        onChange={(e) => handleUpdateTerm(tIdx, { name: e.target.value })}
                        placeholder="VD: Khóa 2020-2025"
                        className="w-full rounded-[8px] border border-border bg-card px-3 py-2 text-sm text-card-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateTerm(tIdx, { isCurrent: !term.isCurrent })}
                        className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition-colors ${
                          term.isCurrent ? "border-green-200 bg-green-50 text-green-700" : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {term.isCurrent ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                        {term.isCurrent ? "Khóa hiện tại" : "Đặt làm khóa hiện tại"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(tIdx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                        title="Xóa khóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-card-foreground">Thành viên ban điều hành</h3>
                      <button
                        type="button"
                        onClick={() => handleAddMember(tIdx)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80"
                      >
                        <Plus className="size-3" />
                        Thêm thành viên
                      </button>
                    </div>

                    {term.members.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-[8px]">Chưa có thành viên nào.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                              <th className="p-2 font-medium w-16 text-center">Ảnh</th>
                              <th className="p-2 font-medium">Tên thánh</th>
                              <th className="p-2 font-medium min-w-[150px]">Họ và tên</th>
                              <th className="p-2 font-medium">Ngày sinh</th>
                              <th className="p-2 font-medium">Chức vụ</th>
                              <th className="p-2 font-medium">Giáo họ</th>
                              <th className="p-2 w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {term.members.map((member, mIdx) => (
                              <tr key={mIdx} className="border-b border-border last:border-0">
                                <td className="p-2 text-center align-middle">
                                  <div className="flex justify-center">
                                    <MemberImageUploader
                                      value={member.image}
                                      onChange={(url) => handleUpdateMember(tIdx, mIdx, { image: url || undefined })}
                                      onUpload={handleImageUpload}
                                    />
                                  </div>
                                </td>
                                <td className="p-2 align-middle">
                                  <input
                                    type="text"
                                    value={member.patronSaint || ""}
                                    onChange={(e) => handleUpdateMember(tIdx, mIdx, { patronSaint: e.target.value })}
                                    placeholder="Tên thánh"
                                    className="w-full bg-transparent p-1 border border-transparent hover:border-border focus:border-accent focus:bg-card focus:outline-none rounded"
                                  />
                                </td>
                                <td className="p-2 align-middle">
                                  <input
                                    type="text"
                                    value={member.fullName}
                                    onChange={(e) => handleUpdateMember(tIdx, mIdx, { fullName: e.target.value })}
                                    placeholder="Họ và tên *"
                                    className="w-full bg-transparent p-1 border border-transparent hover:border-border focus:border-accent focus:bg-card focus:outline-none rounded"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={member.birthday || ""}
                                    onChange={(e) => handleUpdateMember(tIdx, mIdx, { birthday: e.target.value })}
                                    placeholder="Năm/Ngày sinh"
                                    className="w-full bg-transparent p-1 border border-transparent hover:border-border focus:border-accent focus:bg-card focus:outline-none rounded"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={member.position || ""}
                                    onChange={(e) => handleUpdateMember(tIdx, mIdx, { position: e.target.value })}
                                    placeholder="Chức vụ"
                                    className="w-full bg-transparent p-1 border border-transparent hover:border-border focus:border-accent focus:bg-card focus:outline-none rounded"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={member.parish || ""}
                                    onChange={(e) => handleUpdateMember(tIdx, mIdx, { parish: e.target.value })}
                                    placeholder="Giáo họ"
                                    className="w-full bg-transparent p-1 border border-transparent hover:border-border focus:border-accent focus:bg-card focus:outline-none rounded"
                                  />
                                </td>
                                <td className="p-2 text-right align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(tIdx, mIdx)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
          <Link
            href="/admin/organizations"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-card-foreground"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-6 py-3 font-display text-sm font-semibold uppercase text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm đoàn thể"}
          </button>
        </div>
      </form>
    </div>
  );
}
