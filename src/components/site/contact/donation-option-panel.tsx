"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Check,
  Clock3,
  Copy,
  CreditCard,
  Globe,
  Mail,
  Phone,
  QrCode,
} from "lucide-react";
import {
  bankBrandThemes,
  formatAccountNumber,
  type DonationBankAccount,
  type DonationContactInfo,
  type DonationOption,
} from "@/lib/contact/site-donations";
import { cn } from "@/lib/utils";

type DonationOptionPanelProps = {
  option: DonationOption;
  fullWidth?: boolean;
  className?: string;
};

type CopyButtonProps = {
  value: string;
  label: string;
};

function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Sao chép ${label}`}
      className="ml-2 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted hover:text-accent"
    >
      {copied ? (
        <Check className="size-4 text-accent" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}

function BankLogoBadge({
  bankBrand,
  bankDisplayName,
}: {
  bankBrand: DonationBankAccount["bankBrand"];
  bankDisplayName: string;
}) {
  const theme = bankBrandThemes[bankBrand];

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-[10px] bg-white">
        <span
          className={cn(
            "font-display text-base font-bold leading-none",
            theme.logoClassName,
          )}
        >
          {theme.logoText}
        </span>
      </div>
      <span className="font-sans text-xl font-semibold tracking-wide text-white">
        {bankDisplayName}
      </span>
    </div>
  );
}

function BuiltInBankCard({ account }: { account: DonationBankAccount }) {
  const [qrError, setQrError] = useState(false);
  const theme = bankBrandThemes[account.bankBrand];
  const displayNumber = formatAccountNumber(account);

  return (
    <div
      className="relative aspect-[1.85/1] w-full overflow-hidden rounded-[20px] p-6 shadow-lg md:p-8"
      style={{ background: theme.background }}
    >
      <BankLogoBadge
        bankBrand={account.bankBrand}
        bankDisplayName={account.bankDisplayName}
      />

      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-8">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-white/70">
            Số tài khoản
          </p>
          <p className="mt-1 break-all font-sans text-2xl font-bold tracking-wide text-white md:text-3xl">
            {displayNumber || "—"}
          </p>
        </div>

        <div className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white p-1.5 md:size-[104px]">
          {account.qrImageSrc && !qrError ? (
            <Image
              src={account.qrImageSrc}
              alt={account.qrImageAlt ?? "Mã QR chuyển khoản"}
              width={104}
              height={104}
              className="size-full object-contain"
              onError={() => setQrError(true)}
            />
          ) : (
            <QrCode className="size-10 text-primary/40" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}

function BankCardPanel({
  account,
  isUpdating,
}: {
  account: DonationBankAccount;
  isUpdating: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const showScreenshot = account.cardImageSrc && !imageError && !isUpdating;

  return (
    <div className="relative">
      {showScreenshot ? (
        <div className="overflow-hidden rounded-[20px] shadow-lg">
          <Image
            src={account.cardImageSrc!}
            alt={account.cardImageAlt ?? "Thông tin tài khoản ngân hàng"}
            width={640}
            height={360}
            className="h-auto w-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : account.accountNumber ? (
        <BuiltInBankCard account={account} />
      ) : (
        <div className="flex aspect-[1.85/1] w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-border bg-muted px-6 text-center">
          <QrCode className="size-10 text-accent/60" aria-hidden />
          <p className="font-sans text-sm leading-relaxed text-foreground">
            Ảnh thông tin tài khoản sẽ được cập nhật tại đây.
          </p>
        </div>
      )}

      {isUpdating ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-primary/55 px-6 backdrop-blur-[2px]">
          <div className="flex max-w-[280px] flex-col items-center gap-3 rounded-[16px] bg-secondary/95 px-5 py-4 text-center shadow-lg">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent/10">
              <Clock3 className="size-5 text-accent" aria-hidden />
            </div>
            <p className="font-display text-lg font-semibold uppercase text-primary">
              Đang cập nhật
            </p>
            <p className="font-sans text-sm leading-relaxed text-foreground">
              Thông tin tài khoản giáo xứ sẽ được công bố sớm nhất.
            </p>
          </div>
        </div>
      ) : null}

      <p className="mt-3 text-center font-sans text-sm italic text-foreground">
        Quét mã QR trên thẻ hoặc nhấn vào mã QR để phóng to
      </p>
    </div>
  );
}

function TransferDetailsPanel({
  account,
  isUpdating,
}: {
  account: DonationBankAccount;
  isUpdating: boolean;
}) {
  const displayNumber = formatAccountNumber(account);

  const rows = [
    {
      label: "Số tài khoản",
      value: isUpdating ? "Đang cập nhật" : displayNumber,
      copyValue: isUpdating ? undefined : account.accountNumber,
    },
    {
      label: "Chủ tài khoản",
      value: account.accountHolder,
    },
    {
      label: "Ngân hàng",
      value: account.bankDisplayName,
    },
    {
      label: "Nội dung",
      value: account.transferContent,
      copyValue: isUpdating ? undefined : account.transferContent,
    },
  ] as const;

  return (
    <div className="rounded-[20px] border border-border/60 bg-muted p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <CreditCard className="size-5 text-accent" aria-hidden />
        <h4 className="font-display text-lg font-semibold uppercase text-primary">
          Thông tin chuyển khoản
        </h4>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 border-b border-border/50 pb-4 last:border-b-0 last:pb-0"
          >
            <span className="shrink-0 font-sans text-sm text-foreground">
              {row.label}
            </span>
            <div className="flex min-w-0 items-start justify-end text-right">
              <span className="break-all font-sans text-sm font-medium text-primary">
                {row.value}
              </span>
              {"copyValue" in row && row.copyValue ? (
                <CopyButton value={row.copyValue} label={row.label} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonationContactBar({ contact }: { contact: DonationContactInfo }) {
  const items = [
    contact.phone
      ? {
        icon: Phone,
        label: contact.phone,
        href: contact.phoneHref ?? `tel:${contact.phone}`,
      }
      : null,
    contact.email
      ? {
        icon: Mail,
        label: contact.email,
        href: `mailto:${contact.email}`,
      }
      : null,
    contact.website
      ? {
        icon: Globe,
        label: contact.website,
        href: contact.websiteHref ?? `https://${contact.website}`,
      }
      : null,
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    href: string;
  }[];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-border/60 pt-6">
      <div className="mb-4 flex items-center gap-2.5">
        <Phone className="size-5 text-accent" aria-hidden />
        <h4 className="font-display text-lg font-semibold uppercase text-primary">
          Liên hệ
        </h4>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
        {items.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="inline-flex items-center gap-2 font-sans text-sm text-foreground transition-colors hover:text-accent"
          >
            <Icon className="size-4 shrink-0 text-accent" aria-hidden />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function DonationOptionPanel({
  option,
  fullWidth = false,
  className,
}: DonationOptionPanelProps) {
  const isUpdating = option.status === "updating";
  const account = option.account;

  return (
    <article
      className={cn(
        "rounded-[20px] bg-secondary p-6 md:p-8",
        className,
      )}
    >
      <div className="mb-8 text-center">
        <h3 className="font-display text-2xl font-semibold uppercase leading-tight text-primary md:text-[28px]">
          {option.headline}
        </h3>
        {option.subtitle ? (
          <p className="mt-2 font-sans text-sm text-foreground">
            {option.subtitle}
          </p>
        ) : null}
        <p className="mt-4 font-sans text-base leading-relaxed text-foreground">
          {option.description}
        </p>
      </div>

      {account ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-6 md:gap-8",
            fullWidth
              ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start"
              : "xl:grid-cols-2",
          )}
        >
          <BankCardPanel account={account} isUpdating={isUpdating} />
          <TransferDetailsPanel account={account} isUpdating={isUpdating} />
        </div>
      ) : null}

      {option.contact ? (
        <DonationContactBar contact={option.contact} />
      ) : null}
    </article>
  );
}
