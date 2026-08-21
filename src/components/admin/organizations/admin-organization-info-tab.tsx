"use client";

import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { BlogEditor } from "@/components/admin/shared/blog-editor";
import { ImageUploader } from "@/components/admin/shared/image-uploader";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  ControlledField,
  FieldGroup,
} from "@/components/site/shared/ui/field/field";
import type { OrganizationFormValues } from "@/components/admin/organizations/admin-organization-form-values";

type AdminOrganizationInfoTabProps = {
  control: Control<OrganizationFormValues>;
  setValue: UseFormSetValue<OrganizationFormValues>;
  displayedSlug: string;
  slugManuallyEdited: boolean;
  onSlugManuallyEdited: () => void;
  onUploadImage: (file: File) => Promise<string>;
};

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

export function AdminOrganizationInfoTab({
  control,
  setValue,
  displayedSlug,
  slugManuallyEdited,
  onSlugManuallyEdited,
  onUploadImage,
}: AdminOrganizationInfoTabProps) {
  const imageValue = useWatch({ control, name: "image" });
  const historyValue = useWatch({ control, name: "history" });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-base font-semibold text-card-foreground">Thông tin chung</h2>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ControlledField
              control={control}
              name="name"
              label={
                <>
                  Tên đoàn thể <RequiredMark />
                </>
              }
              rules={{ required: "Vui lòng nhập tên đoàn thể" }}
            >
              {({ field, fieldState, id }) => (
                <Input
                  {...field}
                  id={id}
                  aria-invalid={fieldState.invalid}
                  placeholder="VD: Ca đoàn Têrêxa"
                />
              )}
            </ControlledField>
          </div>

          <ControlledField control={control} name="slug" label="Đường dẫn">
            {({ field, id }) => (
              <Input
                {...field}
                id={id}
                value={slugManuallyEdited ? field.value : displayedSlug}
                onChange={(event) => {
                  onSlugManuallyEdited();
                  field.onChange(event.target.value);
                }}
                placeholder="tu-dong-tao-tu-ten"
                className="bg-background"
              />
            )}
          </ControlledField>

          <ControlledField control={control} name="isVisible" label="Hiển thị">
            {({ field, id }) => (
              <label
                htmlFor={id}
                className="inline-flex h-11 w-full cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-sm text-card-foreground transition-colors hover:border-accent"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  className="size-4 shrink-0 accent-accent"
                />
                <span>Hiển thị trên website</span>
              </label>
            )}
          </ControlledField>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-card-foreground">
            Ảnh đoàn thể
          </span>
          <ImageUploader
            value={imageValue || null}
            onChange={(url) => setValue("image", url ?? "", { shouldDirty: true })}
            onUpload={onUploadImage}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-card-foreground">
            Lịch sử hình thành
          </span>
          <BlogEditor
            content={historyValue ?? ""}
            onChange={(html) => setValue("history", html, { shouldDirty: true })}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
