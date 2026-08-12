/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import {
  getAdminContactSettings,
  updateContactSettings,
  type ContactSettingsData,
  type ContactInfoItemData,
  type DonationOptionData,
} from "@/shared/services/contact-api";
import { getAccessToken } from "@/lib/admin/auth-session";
import { cn } from "@/lib/utils";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";

type Tab = "contact-info" | "donation";

const tabs: { id: Tab; label: string }[] = [
  { id: "contact-info", label: "Thông tin liên hệ" },
  { id: "donation", label: "Quyên góp" },
];

type ContactItemFormData = {
  id: string;
  title: string;
  value: string;
  href: string;
  iconSrc: string;
  fullWidth: boolean;
};

type DonationOptionFormData = {
  id: string;
  tabLabel: string;
  headline: string;
  subtitle: string;
  description: string;
  status: "available" | "updating";
  bankBrand: string;
  bankDisplayName: string;
  accountNumber: string;
  accountNumberDisplay: string;
  accountHolder: string;
  transferContent: string;
  cardImageSrc: string;
  cardImageAlt: string;
  qrImageSrc: string;
  qrImageAlt: string;
  contactPhone: string;
  contactPhoneHref: string;
  contactEmail: string;
  contactWebsite: string;
  contactWebsiteHref: string;
};

const emptyContactItemForm = (): ContactItemFormData => ({
  id: "",
  title: "",
  value: "",
  href: "",
  iconSrc: "/images/icon-mail-white.svg",
  fullWidth: false,
});

const emptyDonationOptionForm = (): DonationOptionFormData => ({
  id: "",
  tabLabel: "",
  headline: "",
  subtitle: "",
  description: "",
  status: "updating",
  bankBrand: "generic",
  bankDisplayName: "",
  accountNumber: "",
  accountNumberDisplay: "",
  accountHolder: "",
  transferContent: "",
  cardImageSrc: "",
  cardImageAlt: "",
  qrImageSrc: "",
  qrImageAlt: "",
  contactPhone: "",
  contactPhoneHref: "",
  contactEmail: "",
  contactWebsite: "",
  contactWebsiteHref: "",
});

export function AdminContactManager() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("contact-info");
  const [settings, setSettings] = useState<ContactSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [contactItemModal, setContactItemModal] = useState(false);
  const [editingContactItemIdx, setEditingContactItemIdx] = useState<number | null>(null);
  const [contactItemForm, setContactItemForm] = useState<ContactItemFormData>(emptyContactItemForm());

  const [donationOptionModal, setDonationOptionModal] = useState(false);
  const [editingDonationOptionIdx, setEditingDonationOptionIdx] = useState<number | null>(null);
  const [donationOptionForm, setDonationOptionForm] = useState<DonationOptionFormData>(emptyDonationOptionForm());

  const [deleteTarget, setDeleteTarget] = useState<{ type: "contact-item" | "donation-option"; idx: number } | null>(null);

  const loadSettings = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminContactSettings(token);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact settings");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function updateField(field: string, value: unknown) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  async function handleSave() {
    if (!settings) return;
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updateContactSettings(token, settings);
      setSuccess("Đã lưu thay đổi thành công!");
      window.setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function openContactItemModal(idx: number | null) {
    if (idx !== null && settings) {
      const item = settings.contactItems[idx];
      setContactItemForm({
        id: item.id,
        title: item.title,
        value: item.value,
        href: item.href || "",
        iconSrc: item.iconSrc,
        fullWidth: item.fullWidth || false,
      });
      setEditingContactItemIdx(idx);
    } else {
      setContactItemForm(emptyContactItemForm());
      setEditingContactItemIdx(null);
    }
    setContactItemModal(true);
  }

  function saveContactItem() {
    if (!settings) return;
    const form = contactItemForm;
    const data: ContactInfoItemData = {
      id: form.id,
      title: form.title,
      value: form.value,
      href: form.href || undefined,
      iconSrc: form.iconSrc,
      fullWidth: form.fullWidth,
    };

    const items = [...settings.contactItems];
    if (editingContactItemIdx !== null) {
      items[editingContactItemIdx] = data;
    } else {
      items.push(data);
    }
    setSettings({ ...settings, contactItems: items });
    setContactItemModal(false);
  }

  function deleteContactItem(idx: number) {
    if (!settings) return;
    const items = settings.contactItems.filter((_, i) => i !== idx);
    setSettings({ ...settings, contactItems: items });
  }

  function openDonationOptionModal(idx: number | null) {
    if (idx !== null && settings) {
      const opt = settings.donationOptions[idx];
      setDonationOptionForm({
        id: opt.id,
        tabLabel: opt.tabLabel,
        headline: opt.headline,
        subtitle: opt.subtitle || "",
        description: opt.description,
        status: opt.status,
        bankBrand: opt.account?.bankBrand || "generic",
        bankDisplayName: opt.account?.bankDisplayName || "",
        accountNumber: opt.account?.accountNumber || "",
        accountNumberDisplay: opt.account?.accountNumberDisplay || "",
        accountHolder: opt.account?.accountHolder || "",
        transferContent: opt.account?.transferContent || "",
        cardImageSrc: opt.account?.cardImageSrc || "",
        cardImageAlt: opt.account?.cardImageAlt || "",
        qrImageSrc: opt.account?.qrImageSrc || "",
        qrImageAlt: opt.account?.qrImageAlt || "",
        contactPhone: opt.contact?.phone || "",
        contactPhoneHref: opt.contact?.phoneHref || "",
        contactEmail: opt.contact?.email || "",
        contactWebsite: opt.contact?.website || "",
        contactWebsiteHref: opt.contact?.websiteHref || "",
      });
      setEditingDonationOptionIdx(idx);
    } else {
      setDonationOptionForm(emptyDonationOptionForm());
      setEditingDonationOptionIdx(null);
    }
    setDonationOptionModal(true);
  }

  function saveDonationOption() {
    if (!settings) return;
    const f = donationOptionForm;
    const data: DonationOptionData = {
      id: f.id,
      tabLabel: f.tabLabel,
      headline: f.headline,
      subtitle: f.subtitle || undefined,
      description: f.description,
      status: f.status,
      account: {
        bankBrand: f.bankBrand,
        bankDisplayName: f.bankDisplayName,
        accountNumber: f.accountNumber,
        accountNumberDisplay: f.accountNumberDisplay || undefined,
        accountHolder: f.accountHolder,
        transferContent: f.transferContent,
        cardImageSrc: f.cardImageSrc || undefined,
        cardImageAlt: f.cardImageAlt || undefined,
        qrImageSrc: f.qrImageSrc || undefined,
        qrImageAlt: f.qrImageAlt || undefined,
      },
      contact: {
        phone: f.contactPhone || undefined,
        phoneHref: f.contactPhoneHref || undefined,
        email: f.contactEmail || undefined,
        website: f.contactWebsite || undefined,
        websiteHref: f.contactWebsiteHref || undefined,
      },
    };

    const options = [...settings.donationOptions];
    if (editingDonationOptionIdx !== null) {
      options[editingDonationOptionIdx] = data;
    } else {
      options.push(data);
    }
    setSettings({ ...settings, donationOptions: options });
    setDonationOptionModal(false);
  }

  function deleteDonationOption(idx: number) {
    if (!settings) return;
    const options = settings.donationOptions.filter((_, i) => i !== idx);
    setSettings({ ...settings, donationOptions: options });
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center text-muted-foreground">
        Không thể tải dữ liệu.
      </div>
    );
  }

  const actionBtnClass =
    "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

  const iconOptions = [
    { value: "/images/icon-mail-white.svg", label: "Mail" },
    { value: "/images/icon-phone-white.svg", label: "Phone" },
    { value: "/images/icon-location-white.svg", label: "Location" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về Tổng quan
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-card-foreground">
              Liên hệ & Quyên góp
            </h1>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
            {success ? (
              <p className="mt-1 text-sm text-emerald-600">{success}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-card-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "contact-info" && (
        <div className="space-y-6">
          <SectionCard title="Tiêu đề & Mô tả">
            <Field label="Subtitle">
              <Input value={settings.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
            </Field>
            <Field label="Title">
              <Input value={settings.title} onChange={(e) => updateField("title", e.target.value)} />
            </Field>
            <Field label="Description">
              <Textarea
                value={settings.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
              />
            </Field>
            <Field label="Form Title">
              <Input value={settings.formTitle} onChange={(e) => updateField("formTitle", e.target.value)} />
            </Field>
          </SectionCard>

          <SectionCard title="Bản đồ">
            <Field label="Map Subtitle">
              <Input value={settings.mapSubtitle} onChange={(e) => updateField("mapSubtitle", e.target.value)} />
            </Field>
            <Field label="Map Title">
              <Input value={settings.mapTitle} onChange={(e) => updateField("mapTitle", e.target.value)} />
            </Field>
            <Field label="Map Description">
              <Textarea
                value={settings.mapDescription}
                onChange={(e) => updateField("mapDescription", e.target.value)}
                rows={3}
              />
            </Field>
            <Field label="Map URL">
              <Input value={settings.mapUrl} onChange={(e) => updateField("mapUrl", e.target.value)} />
            </Field>
            <Field label="Map Embed URL">
              <Input value={settings.mapEmbedUrl} onChange={(e) => updateField("mapEmbedUrl", e.target.value)} />
            </Field>
          </SectionCard>

          <SectionCard
            title="Thông tin liên hệ"
            action={
              <button type="button" className={actionBtnClass} onClick={() => openContactItemModal(null)}>
                <Plus className="size-4" aria-hidden />
                Thêm
              </button>
            }
          >
            {settings.contactItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có thông tin liên hệ.</p>
            ) : (
              <div className="space-y-2">
                {settings.contactItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[12px] border border-border bg-card px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.value}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 ml-4">
                      <button type="button" className={actionBtnClass} onClick={() => openContactItemModal(idx)}>
                        <Pencil className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className={cn(actionBtnClass, "text-destructive hover:bg-destructive/10")}
                        onClick={() => setDeleteTarget({ type: "contact-item", idx })}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === "donation" && (
        <div className="space-y-6">
          <SectionCard title="Tiêu đề & Mô tả">
            <Field label="Donation Subtitle">
              <Input
                value={settings.donationSubtitle}
                onChange={(e) => updateField("donationSubtitle", e.target.value)}
              />
            </Field>
            <Field label="Donation Title">
              <Input
                value={settings.donationTitle}
                onChange={(e) => updateField("donationTitle", e.target.value)}
              />
            </Field>
            <Field label="Donation Description">
              <Textarea
                value={settings.donationDescription}
                onChange={(e) => updateField("donationDescription", e.target.value)}
                rows={3}
              />
            </Field>
          </SectionCard>

          <SectionCard
            title="Tùy chọn quyên góp"
            action={
              <button type="button" className={actionBtnClass} onClick={() => openDonationOptionModal(null)}>
                <Plus className="size-4" aria-hidden />
                Thêm
              </button>
            }
          >
            {settings.donationOptions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có tùy chọn quyên góp.</p>
            ) : (
              <div className="space-y-2">
                {settings.donationOptions.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between rounded-[12px] border border-border bg-card px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground">{opt.headline}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {opt.tabLabel} &middot; {opt.status === "available" ? "Đang hoạt động" : "Đang cập nhật"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 ml-4">
                      <button type="button" className={actionBtnClass} onClick={() => openDonationOptionModal(idx)}>
                        <Pencil className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className={cn(actionBtnClass, "text-destructive hover:bg-destructive/10")}
                        onClick={() => setDeleteTarget({ type: "donation-option", idx })}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Contact Item Modal */}
      <AdminFormDialog
        open={contactItemModal}
        onOpenChange={(o) => { if (!o) setContactItemModal(false); }}
        title={editingContactItemIdx !== null ? "Chỉnh sửa thông tin liên hệ" : "Thêm thông tin liên hệ"}
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminOutlineButton onClick={() => setContactItemModal(false)}>Hủy</AdminOutlineButton>
            <button
              type="button"
              onClick={saveContactItem}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {editingContactItemIdx !== null ? "Lưu" : "Thêm"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="ID">
            <Input
              value={contactItemForm.id}
              onChange={(e) => setContactItemForm({ ...contactItemForm, id: e.target.value })}
              placeholder="VD: email, phone, location"
            />
          </Field>
          <Field label="Tiêu đề">
            <Input
              value={contactItemForm.title}
              onChange={(e) => setContactItemForm({ ...contactItemForm, title: e.target.value })}
              placeholder="VD: Email"
            />
          </Field>
          <Field label="Giá trị">
            <Input
              value={contactItemForm.value}
              onChange={(e) => setContactItemForm({ ...contactItemForm, value: e.target.value })}
              placeholder="VD: lienhe@sanam.org"
            />
          </Field>
          <Field label="Link (href)">
            <Input
              value={contactItemForm.href}
              onChange={(e) => setContactItemForm({ ...contactItemForm, href: e.target.value })}
              placeholder="VD: mailto:lienhe@sanam.org"
            />
          </Field>
          <Field label="Icon">
            <Select
              value={contactItemForm.iconSrc}
              onValueChange={(v) => setContactItemForm({ ...contactItemForm, iconSrc: v || "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-border px-3">
            <input
              type="checkbox"
              checked={contactItemForm.fullWidth}
              onChange={(e) => setContactItemForm({ ...contactItemForm, fullWidth: e.target.checked })}
              className="size-4 rounded border-border text-accent"
            />
            <span className="text-sm text-card-foreground">Full width</span>
          </label>
        </div>
      </AdminFormDialog>

      {/* Donation Option Modal */}
      <AdminFormDialog
        open={donationOptionModal}
        onOpenChange={(o) => { if (!o) setDonationOptionModal(false); }}
        title={editingDonationOptionIdx !== null ? "Chỉnh sửa tùy chọn quyên góp" : "Thêm tùy chọn quyên góp"}
        className="sm:max-w-3xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminOutlineButton onClick={() => setDonationOptionModal(false)}>Hủy</AdminOutlineButton>
            <button
              type="button"
              onClick={saveDonationOption}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {editingDonationOptionIdx !== null ? "Lưu" : "Thêm"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <h3 className="font-display text-base font-semibold text-card-foreground">Thông tin cơ bản</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="ID">
              <Input
                value={donationOptionForm.id}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, id: e.target.value })}
                placeholder="VD: parish, developer"
              />
            </Field>
            <Field label="Tab Label">
              <Input
                value={donationOptionForm.tabLabel}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, tabLabel: e.target.value })}
                placeholder="VD: Giáo xứ"
              />
            </Field>
            <Field label="Headline">
              <Input
                value={donationOptionForm.headline}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, headline: e.target.value })}
                placeholder="VD: Ủng hộ Giáo xứ Sa Nam"
              />
            </Field>
            <Field label="Subtitle">
              <Input
                value={donationOptionForm.subtitle}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, subtitle: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <Select
                value={donationOptionForm.status}
                onValueChange={(v) =>
                  setDonationOptionForm({ ...donationOptionForm, status: v as "available" | "updating" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Đang hoạt động</SelectItem>
                  <SelectItem value="updating">Đang cập nhật</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={donationOptionForm.description}
              onChange={(e) => setDonationOptionForm({ ...donationOptionForm, description: e.target.value })}
              rows={3}
            />
          </Field>

          <h3 className="font-display text-base font-semibold text-card-foreground pt-2">Thông tin tài khoản</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ngân hàng (Brand)">
              <Select
                value={donationOptionForm.bankBrand}
                onValueChange={(v) => setDonationOptionForm({ ...donationOptionForm, bankBrand: v || "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techcombank">Techcombank</SelectItem>
                  <SelectItem value="mb">MB Bank</SelectItem>
                  <SelectItem value="vietcombank">Vietcombank</SelectItem>
                  <SelectItem value="generic">Khác</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tên hiển thị">
              <Input
                value={donationOptionForm.bankDisplayName}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, bankDisplayName: e.target.value })}
                placeholder="VD: Techcombank"
              />
            </Field>
            <Field label="Số tài khoản">
              <Input
                value={donationOptionForm.accountNumber}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, accountNumber: e.target.value })}
              />
            </Field>
            <Field label="Số TK hiển thị">
              <Input
                value={donationOptionForm.accountNumberDisplay}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, accountNumberDisplay: e.target.value })}
              />
            </Field>
            <Field label="Chủ tài khoản">
              <Input
                value={donationOptionForm.accountHolder}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, accountHolder: e.target.value })}
              />
            </Field>
            <Field label="Nội dung chuyển khoản">
              <Input
                value={donationOptionForm.transferContent}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, transferContent: e.target.value })}
              />
            </Field>
          </div>

          <h3 className="font-display text-base font-semibold text-card-foreground pt-2">Liên hệ</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Số điện thoại">
              <Input
                value={donationOptionForm.contactPhone}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, contactPhone: e.target.value })}
              />
            </Field>
            <Field label="Phone Href">
              <Input
                value={donationOptionForm.contactPhoneHref}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, contactPhoneHref: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input
                value={donationOptionForm.contactEmail}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, contactEmail: e.target.value })}
              />
            </Field>
            <Field label="Website">
              <Input
                value={donationOptionForm.contactWebsite}
                onChange={(e) => setDonationOptionForm({ ...donationOptionForm, contactWebsite: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </AdminFormDialog>

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        title="Xóa"
        description={
          deleteTarget?.type === "contact-item"
            ? "Bạn có chắc chắn muốn xóa thông tin liên hệ này?"
            : "Bạn có chắc chắn muốn xóa tùy chọn quyên góp này?"
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === "contact-item") deleteContactItem(deleteTarget.idx);
          else deleteDonationOption(deleteTarget.idx);
          setDeleteTarget(null);
        }}
        variant="danger"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-card-foreground">{title}</h2>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
