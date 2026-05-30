export type BankBrand = "techcombank" | "mb" | "vietcombank" | "generic";

export type DonationContactInfo = {
  phone?: string;
  phoneHref?: string;
  email?: string;
  website?: string;
  websiteHref?: string;
};

export type DonationBankAccount = {
  bankBrand: BankBrand;
  bankDisplayName: string;
  accountNumber: string;
  accountNumberDisplay?: string;
  accountHolder: string;
  transferContent: string;
  cardImageSrc?: string;
  cardImageAlt?: string;
  qrImageSrc?: string;
  qrImageAlt?: string;
};

export type DonationOption = {
  id: "parish" | "developer";
  tabLabel: string;
  headline: string;
  subtitle?: string;
  description: string;
  status: "available" | "updating";
  account?: DonationBankAccount;
  contact?: DonationContactInfo;
};

export const siteDonationInfo = {
  subtitle: "Quyên góp",
  title: "Đồng hành cùng Giáo xứ Sa Nam",
  description:
    "Quý vị có thể quyên góp ủng hộ hoạt động mục vụ giáo xứ hoặc đóng góp phát triển website phục vụ cộng đoàn.",
} as const;

const parishContact: DonationContactInfo = {
  phone: "(028) 1234 5678",
  phoneHref: "tel:+842812345678",
  email: "lienhe@sanam.org",
  website: "sanam.org",
  websiteHref: "https://sanam.org",
};

export const siteDonationOptions: DonationOption[] = [
  {
    id: "parish",
    tabLabel: "Giáo xứ",
    headline: "Ủng hộ Giáo xứ Sa Nam",
    subtitle: "Giáo xứ Sa Nam — Giáo phận Bùi Chu",
    description:
      "Ủng hộ hoạt động mục vụ, sửa chữa nhà thờ và các nhu cầu phục vụ của Giáo xứ Sa Nam.",
    status: "updating",
    contact: parishContact,
    account: {
      bankBrand: "generic",
      bankDisplayName: "Giáo xứ Sa Nam",
      accountNumber: "",
      accountHolder: "Đang cập nhật",
      transferContent: "Ung ho Giao xu Sa Nam",
      cardImageSrc: "/images/donation/parish-account-card.png",
      cardImageAlt: "Thông tin tài khoản quyên góp giáo xứ Sa Nam",
    },
  },
  {
    id: "developer",
    tabLabel: "Phát triển website",
    headline: "Ủng hộ phát triển website",
    subtitle: "Giáo xứ Sa Nam — Phát triển & duy trì website",
    description:
      "Hỗ trợ đội ngũ phát triển duy trì và nâng cấp website phục vụ cộng đoàn giáo xứ.",
    status: "available",
    contact: parishContact,
    account: {
      bankBrand: "techcombank",
      bankDisplayName: "Techcombank",
      accountNumber: "120230508888",
      accountNumberDisplay: "1202 3050 8888",
      accountHolder: "GIAO XU SA NAM",
      transferContent: "Ung ho phat trien website Giao xu Sa Nam",
      cardImageSrc: "/images/donation/developer-techcombank-account-card.png",
      cardImageAlt:
        "Thông tin tài khoản Techcombank quyên góp phát triển website",
      qrImageSrc: "/images/qr-code.jpg",
      qrImageAlt: "Mã QR Techcombank quyên góp phát triển website",
    },
  },
];

export const bankBrandThemes: Record<
  BankBrand,
  { background: string; logoText: string; logoClassName: string }
> = {
  techcombank: {
    background:
      "linear-gradient(135deg, #8b0018 0%, #c8102e 48%, #e31937 100%)",
    logoText: "TCB",
    logoClassName: "text-[#c8102e]",
  },
  mb: {
    background:
      "linear-gradient(135deg, #002855 0%, #005baa 52%, #0078d4 100%)",
    logoText: "MB",
    logoClassName: "text-[#005baa]",
  },
  vietcombank: {
    background:
      "linear-gradient(135deg, #004a32 0%, #006341 52%, #008556 100%)",
    logoText: "V",
    logoClassName: "text-[#006341]",
  },
  generic: {
    background:
      "linear-gradient(135deg, #1a1a1a 0%, #333333 52%, #4a4a4a 100%)",
    logoText: "GX",
    logoClassName: "text-primary",
  },
};

export function formatAccountNumber(account: DonationBankAccount) {
  return account.accountNumberDisplay ?? account.accountNumber;
}
