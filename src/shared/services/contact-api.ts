const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ContactInfoItemData {
  id: string;
  title: string;
  value: string;
  href?: string;
  iconSrc: string;
  fullWidth?: boolean;
}

export interface DonationBankAccountData {
  bankBrand: string;
  bankDisplayName: string;
  accountNumber: string;
  accountNumberDisplay?: string;
  accountHolder: string;
  transferContent: string;
  cardImageSrc?: string;
  cardImageAlt?: string;
  qrImageSrc?: string;
  qrImageAlt?: string;
}

export interface DonationContactInfoData {
  phone?: string;
  phoneHref?: string;
  email?: string;
  website?: string;
  websiteHref?: string;
}

export interface DonationOptionData {
  id: string;
  tabLabel: string;
  headline: string;
  subtitle?: string;
  description: string;
  status: "available" | "updating";
  account?: DonationBankAccountData;
  contact?: DonationContactInfoData;
}

export interface ContactSettingsData {
  _id?: string;
  subtitle: string;
  title: string;
  description: string;
  formTitle: string;

  mapSubtitle: string;
  mapTitle: string;
  mapDescription: string;
  mapUrl: string;
  mapEmbedUrl: string;

  contactItems: ContactInfoItemData[];

  donationSubtitle: string;
  donationTitle: string;
  donationDescription: string;
  donationOptions: DonationOptionData[];

  createdAt?: string;
  updatedAt?: string;
}

export async function getPublicContactSettings(): Promise<ContactSettingsData> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch contact settings");
  return res.json();
}

export async function getAdminContactSettings(
  token: string,
): Promise<ContactSettingsData> {
  const res = await fetch(`${API_BASE}/api/admin/contact`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch contact settings");
  return res.json();
}

export async function updateContactSettings(
  token: string,
  data: Partial<ContactSettingsData>,
): Promise<ContactSettingsData> {
  const res = await fetch(`${API_BASE}/api/admin/contact`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to update contact settings" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function uploadContactFile(
  token: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to upload" }));
    throw new Error(err.message);
  }
  const data = await res.json();
  return `${API_BASE}${data.url}`;
}
