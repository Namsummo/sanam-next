const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type SocialLink = {
  network: string;
  url: string;
};

export type FooterLink = {
  label: string;
  url: string;
};

export type FooterSettingsPayload = {
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  copyrightText: string;
  quickLinksTitle: string;
  quickLinks: FooterLink[];
  ourServicesTitle: string;
  ourServices: FooterLink[];
  serviceTimesTitle: string;
  serviceTimes: string[];
  socialLinks: SocialLink[];
};

export async function getPublicFooterSettings(): Promise<FooterSettingsPayload> {
  const res = await fetch(`${API_BASE}/api/footer-settings`, {
    next: { tags: ["footer-settings"] },
  });
  if (!res.ok) throw new Error("Failed to fetch footer settings");
  return res.json();
}

export async function updateFooterSettings(data: FooterSettingsPayload): Promise<FooterSettingsPayload> {
  const res = await fetch(`${API_BASE}/api/footer-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update footer settings" }));
    throw new Error(err.message || "Failed to update footer settings");
  }

  return res.json();
}
