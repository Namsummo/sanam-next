"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAccessToken } from "@/lib/admin/auth-session";
import { uploadImage } from "@/shared/services/news-api";
import { createOrganization, updateOrganization } from "@/lib/organization/api";
import { normalizeExecutiveTerms } from "@/lib/organization/executive-members";
import type { Organization, ExecutiveTerm } from "@/lib/organization/types";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { cn } from "@/lib/utils";
import { slugify } from "@/shared/lib/slugify";
import {
  createEmptyOrganizationFormValues,
  mapOrganizationToFormValues,
  resolveOrganizationSlug,
  type OrganizationFormValues,
} from "@/components/admin/organizations/admin-organization-form-values";
import { AdminOrganizationInfoTab } from "@/components/admin/organizations/admin-organization-info-tab";
import { AdminOrganizationMembersTab } from "@/components/admin/organizations/admin-organization-members-tab";

type AdminOrganizationFormProps = {
  organization?: Organization;
};

type FormTab = "info" | "members";

const formTabs: { id: FormTab; label: string }[] = [
  { id: "info", label: "Thông tin đoàn thể" },
  { id: "members", label: "Ban điều hành" },
];

export function AdminOrganizationForm({ organization }: AdminOrganizationFormProps) {
  const router = useRouter();
  const isEdit = !!organization;

  const form = useForm<OrganizationFormValues>({
    defaultValues: organization
      ? mapOrganizationToFormValues(organization)
      : createEmptyOrganizationFormValues(),
  });

  const nameValue = useWatch({ control: form.control, name: "name" });

  const [activeTab, setActiveTab] = useState<FormTab>("info");
  const [terms, setTerms] = useState<ExecutiveTerm[]>(() =>
    normalizeExecutiveTerms(organization?.terms ?? []),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const totalMembers = useMemo(
    () => terms.reduce((sum, term) => sum + term.members.length, 0),
    [terms],
  );

  const displayedSlug = useMemo(() => {
    return resolveOrganizationSlug(
      {
        name: nameValue ?? "",
        slug: form.getValues("slug"),
        image: "",
        history: "",
        isVisible: true,
      },
      {
        isEdit,
        slugManuallyEdited,
        existingSlug: organization?.slug,
      },
    );
  }, [form, isEdit, nameValue, organization?.slug, slugManuallyEdited]);

  useEffect(() => {
    if (!slugManuallyEdited && !isEdit) {
      form.setValue("slug", slugify(nameValue ?? ""), { shouldDirty: false });
    }
  }, [form, isEdit, nameValue, slugManuallyEdited]);

  async function handleImageUpload(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return uploadImage(token, file);
  }

  async function onValidSubmit(values: OrganizationFormValues) {
    setError("");

    const invalidTerm = terms.find((term) => !term._id);
    if (invalidTerm) {
      setError("Có khóa không hợp lệ. Vui lòng xóa và tạo lại bằng năm bắt đầu/kết thúc.");
      setActiveTab("members");
      return;
    }

    setSaving(true);

    try {
      const slug = resolveOrganizationSlug(values, {
        isEdit,
        slugManuallyEdited,
        existingSlug: organization?.slug,
      });

      const data = {
        name: values.name.trim(),
        slug: slug || undefined,
        image: values.image || undefined,
        history: values.history,
        terms: normalizeExecutiveTerms(terms),
        isVisible: values.isVisible,
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

  function onInvalidSubmit() {
    setActiveTab("info");
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

      <form
        onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
        className="mt-8 space-y-6 pb-20"
        noValidate
      >
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {importMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {importMessage}
          </div>
        ) : null}

        <div className="flex gap-1 border-b border-border">
          {formTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-card-foreground",
              )}
            >
              {tab.label}
              {tab.id === "members" && totalMembers > 0 ? (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {totalMembers}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {activeTab === "info" ? (
          <AdminOrganizationInfoTab
            control={form.control}
            setValue={form.setValue}
            displayedSlug={displayedSlug}
            slugManuallyEdited={slugManuallyEdited}
            onSlugManuallyEdited={() => setSlugManuallyEdited(true)}
            onUploadImage={handleImageUpload}
          />
        ) : null}

        {activeTab === "members" ? (
          <AdminOrganizationMembersTab
            terms={terms}
            onTermsChange={setTerms}
            onError={setError}
            onImportMessage={setImportMessage}
            onUploadImage={handleImageUpload}
          />
        ) : null}

        <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
          <AdminOutlineButton
            type="button"
            onClick={() => router.push("/admin/organizations")}
            className="h-12"
          >
            Hủy
          </AdminOutlineButton>
          <Button
            type="submit"
            variant="primary"
            showIcon={false}
            disabled={saving}
            className="h-12"
          >
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm đoàn thể"}
          </Button>
        </div>
      </form>
    </div>
  );
}
