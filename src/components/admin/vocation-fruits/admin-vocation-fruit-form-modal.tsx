"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  VOCATION_TYPE_OPTIONS,
  type VocationFruitFormValues,
} from "@/components/admin/vocation-fruits/admin-vocation-fruit-form";
import { AdminPersonFormModal } from "@/components/admin/family-registry/admin-person-form-modal";
import {
  createEmptyPersonFormValues,
  formValuesToPerson,
  type PersonFormValues,
} from "@/components/admin/family-registry/admin-person-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ControlledField, FieldGroup } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { getAccessToken } from "@/lib/admin/auth-session";
import { formatPersonDisplayName } from "@/lib/family-registry/helpers";
import type { Person } from "@/lib/family-registry/types";
import type { VocationType } from "@/lib/vocation/types";
import { createPerson } from "@/shared/services/family-registry-api";

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

function getPersonRecordId(person: Person): string {
  return person.id || (person as Person & { _id?: string })._id || "";
}

function formatPersonParish(person: Person): string | undefined {
  const parts = [person.giaoHo, person.giaoXu].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  return parts.length > 0 ? parts.join(" - ") : undefined;
}

type AdminVocationFruitFormModalProps = {
  open: boolean;
  defaultValues: VocationFruitFormValues;
  editingId: string | null;
  persons: Person[];
  onClose: () => void;
  onSubmit: (values: VocationFruitFormValues) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onPersonCreated?: (person: Person) => void;
};

export function AdminVocationFruitFormModal({
  open,
  defaultValues,
  editingId,
  persons,
  onClose,
  onSubmit,
  onUploadImage,
  onPersonCreated,
}: AdminVocationFruitFormModalProps) {
  const form = useForm<VocationFruitFormValues>({ defaultValues });
  const [showNewPerson, setShowNewPerson] = useState(false);
  const [creatingPerson, setCreatingPerson] = useState(false);
  const [personCreateError, setPersonCreateError] = useState<string | null>(null);

  const personOptions = useMemo(
    () =>
      persons
        .map((person) => ({
          value: getPersonRecordId(person),
          label: formatPersonDisplayName(person),
          description: formatPersonParish(person),
          image:
            typeof person.profileImage === "string" && person.profileImage.trim()
              ? person.profileImage
              : null,
        }))
        .filter((option) => option.value),
    [persons],
  );

  async function handleCreatePerson(values: PersonFormValues) {
    const token = getAccessToken();
    if (!token) {
      setPersonCreateError("Bạn chưa đăng nhập.");
      return;
    }

    try {
      setCreatingPerson(true);
      setPersonCreateError(null);
      const created = await createPerson(token, formValuesToPerson(values));
      onPersonCreated?.(created);
      form.setValue("personId", getPersonRecordId(created), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setShowNewPerson(false);
    } catch (err) {
      setPersonCreateError(
        err instanceof Error ? err.message : "Không tạo được hồ sơ giáo dân.",
      );
    } finally {
      setCreatingPerson(false);
    }
  }

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      // eslint-disable-next-line
      setShowNewPerson(false);
      setPersonCreateError(null);
    }
  }, [defaultValues, form, open]);

  return (
    <>
      <AdminFormDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && showNewPerson) return;
          if (!nextOpen) onClose();
        }}
        title={editingId ? "Chỉnh sửa hoa trái" : "Thêm hoa trái mới"}
        className="sm:max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <AdminOutlineButton type="button" onClick={onClose}>
              Hủy
            </AdminOutlineButton>
            <AdminOutlineButton
              type="submit"
              form="admin-vocation-fruit-form"
              className="border-primary bg-accent text-primary-foreground hover:bg-primary/90"
            >
              {editingId ? "Lưu thay đổi" : "Thêm mới"}
            </AdminOutlineButton>
          </div>
        }
      >
        <form
          id="admin-vocation-fruit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FieldGroup>
            <ControlledField
              control={form.control}
              name="personId"
              label={
                <>
                  <span>Chọn thành viên</span> <RequiredMark />
                </>
              }
              rules={{ required: "Vui lòng chọn thành viên trong giáo xứ." }}
            >
              {({ field }) => (
                <AdminSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={personOptions}
                  placeholder="Chọn thành viên trong giáo xứ"
                  contentClassName="max-h-60"
                  searchable
                  onAdd={() => {
                    setPersonCreateError(null);
                    setShowNewPerson(true);
                  }}
                  addLabel="Tạo giáo dân mới"
                />
              )}
            </ControlledField>

            {personCreateError ? (
              <p className="text-sm text-destructive">{personCreateError}</p>
            ) : null}

            <ControlledField
              control={form.control}
              name="vocationType"
              label="Nhóm ơn gọi"
              rules={{ required: "Vui lòng chọn nhóm" }}
            >
              {({ field }) => (
                <AdminSelect
                  value={field.value}
                  onChange={(value) => field.onChange(value as VocationType)}
                  options={VOCATION_TYPE_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder="Chọn nhóm"
                />
              )}
            </ControlledField>

            <ControlledField control={form.control} name="religiousOrder" label="Dòng tu / tổ chức">
              {({ field, id }) => (
                <Input
                  {...field}
                  id={id}
                  placeholder="Ví dụ: Hàng linh mục Giáo phận Vinh, Dòng Tên, Dòng Mến Thánh Giá..."
                />
              )}
            </ControlledField>

            <ControlledField control={form.control} name="currentAssignment" label="Nơi phục vụ hiện tại">
              {({ field, id }) => (
                <Input
                  {...field}
                  id={id}
                  placeholder="Ví dụ: Cha Chánh Xứ Sa Nam, Giáo xứ Chính Tòa..."
                />
              )}
            </ControlledField>

            <ControlledField control={form.control} name="vocationYear" label="Năm thụ phong / tuyên khấn">
              {({ field, id }) => (
                <Input {...field} id={id} type="number" min={1900} max={2100} placeholder="2000" />
              )}
            </ControlledField>
          </FieldGroup>
        </form>
      </AdminFormDialog>

      <AdminPersonFormModal
        open={showNewPerson}
        defaultValues={createEmptyPersonFormValues()}
        editingId={null}
        onClose={() => {
          if (!creatingPerson) setShowNewPerson(false);
        }}
        onSubmit={handleCreatePerson}
        onUploadImage={onUploadImage}
      />
    </>
  );
}
