"use client";

import { useEffect, useState } from "react";
import { Check, Globe, Link2, Loader2, MessageCircle, Pencil, Plus, Share2, Trash2, Send, Phone, Mail } from "lucide-react";
import { getPublicFooterSettings, updateFooterSettings, type FooterSettingsPayload } from "@/shared/services/footer-settings-api";

type FooterZone =
  | "newsletterTitle"
  | "newsletterSubtitle"
  | "newsletterPlaceholder"
  | "copyrightText"
  | "quickLinksTitle"
  | "quickLinks"
  | "ourServicesTitle"
  | "ourServices"
  | "serviceTimesTitle"
  | "serviceTimes"
  | "socialLinks";

function zoneLabel(zone: FooterZone): string {
  const labels: Record<string, string> = {
    newsletterTitle: "Tiêu đề Newsletter",
    newsletterSubtitle: "Phụ đề Newsletter",
    newsletterPlaceholder: "Placeholder Email",
    copyrightText: "Copyright Text",
    quickLinksTitle: "Tiêu đề Quick Links",
    quickLinks: "Quick Links",
    ourServicesTitle: "Tiêu đề Our Services",
    ourServices: "Our Services",
    serviceTimesTitle: "Tiêu đề Service Times",
    serviceTimes: "Service Times",
    socialLinks: "Social Links",
  };
  return labels[zone] || zone;
}

const getSocialIcon = (network: string) => {
  const normalized = network.toLowerCase();
  if (normalized.includes("facebook") || normalized.includes("globe")) return Globe;
  if (normalized.includes("instagram") || normalized.includes("message") || normalized.includes("twitter")) return MessageCircle;
  if (normalized.includes("dribbble") || normalized.includes("share")) return Share2;
  return Link2;
};

export function FooterSectionEditor() {
  const [data, setData] = useState<FooterSettingsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedZone, setSelectedZone] = useState<FooterZone | null>(null);

  useEffect(() => {
    getPublicFooterSettings()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!data) {
    return <div className="p-4 text-destructive">Lỗi tải dữ liệu.</div>;
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateFooterSettings(data);
      alert("Lưu thành công!");
      setSelectedZone(null);
    } catch (error: any) {
      alert(error.message || "Lưu thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof FooterSettingsPayload, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Helper for link arrays (Quick Links, Our Services)
  const addLink = (field: "quickLinks" | "ourServices") => {
    setData({ ...data, [field]: [...data[field], { label: "", url: "" }] });
  };
  const removeLink = (field: "quickLinks" | "ourServices", index: number) => {
    const newLinks = [...data[field]];
    newLinks.splice(index, 1);
    setData({ ...data, [field]: newLinks });
  };
  const updateLink = (field: "quickLinks" | "ourServices", index: number, key: "label" | "url", val: string) => {
    const newLinks = [...data[field]];
    newLinks[index] = { ...newLinks[index], [key]: val };
    setData({ ...data, [field]: newLinks });
  };

  const addServiceTime = () => {
    setData({ ...data, serviceTimes: [...data.serviceTimes, ""] });
  };

  const removeServiceTime = (index: number) => {
    const newTimes = [...data.serviceTimes];
    newTimes.splice(index, 1);
    setData({ ...data, serviceTimes: newTimes });
  };

  const updateServiceTime = (index: number, val: string) => {
    const newTimes = [...data.serviceTimes];
    newTimes[index] = val;
    setData({ ...data, serviceTimes: newTimes });
  };

  const addSocialLink = () => {
    setData({
      ...data,
      socialLinks: [...data.socialLinks, { network: "", url: "" }],
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...data.socialLinks];
    newLinks.splice(index, 1);
    setData({ ...data, socialLinks: newLinks });
  };

  const updateSocialLink = (index: number, field: "network" | "url", val: string) => {
    const newLinks = [...data.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: val };
    setData({ ...data, socialLinks: newLinks });
  };

  function renderEditPanel() {
    if (!selectedZone) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">Click vào phần tử trong khung xem trước để chỉnh sửa</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{zoneLabel(selectedZone)}</h3>

        {selectedZone === "newsletterTitle" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tiêu đề Newsletter</label>
            <input type="text" value={data?.newsletterTitle} onChange={(e) => handleFieldChange("newsletterTitle", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {selectedZone === "newsletterSubtitle" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Phụ đề Newsletter</label>
            <input type="text" value={data?.newsletterSubtitle} onChange={(e) => handleFieldChange("newsletterSubtitle", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {selectedZone === "copyrightText" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Copyright Text</label>
            <input type="text" value={data?.copyrightText} onChange={(e) => handleFieldChange("copyrightText", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {selectedZone === "newsletterPlaceholder" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Placeholder Email</label>
            <input type="text" value={data?.newsletterPlaceholder} onChange={(e) => handleFieldChange("newsletterPlaceholder", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {(selectedZone === "quickLinksTitle" || selectedZone === "ourServicesTitle" || selectedZone === "serviceTimesTitle") && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tiêu đề cột</label>
            <input type="text" value={data?.[selectedZone]} onChange={(e) => handleFieldChange(selectedZone, e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {(selectedZone === "quickLinks" || selectedZone === "ourServices") && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">{selectedZone === "quickLinks" ? "Quick Links" : "Our Services"}</label>
              <button onClick={() => addLink(selectedZone)} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                <Plus className="size-4" /> Thêm
              </button>
            </div>
            <div className="space-y-2">
              {data?.[selectedZone].map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" placeholder="Nhãn" value={link.label} onChange={(e) => updateLink(selectedZone, idx, "label", e.target.value)}
                    className="w-1/3 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
                  <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateLink(selectedZone, idx, "url", e.target.value)}
                    className="flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
                  <button onClick={() => removeLink(selectedZone, idx)}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-destructive/20 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-white">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedZone === "serviceTimes" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Service Times</label>
              <button onClick={addServiceTime} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                <Plus className="size-4" /> Thêm
              </button>
            </div>
            <div className="space-y-2">
              {data?.serviceTimes.map((time, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" value={time} onChange={(e) => updateServiceTime(idx, e.target.value)}
                    className="flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
                  <button onClick={() => removeServiceTime(idx)}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-destructive/20 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-white">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedZone === "socialLinks" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Social Links</label>
              <button onClick={addSocialLink} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                <Plus className="size-4" /> Thêm
              </button>
            </div>
            <div className="space-y-2">
              {data?.socialLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" placeholder="Network" value={link.network} onChange={(e) => updateSocialLink(idx, "network", e.target.value)}
                    className="w-1/3 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
                  <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                    className="flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
                  <button onClick={() => removeSocialLink(idx)}
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-destructive/20 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-white">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <button type="button" onClick={handleSave} disabled={isSaving}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Lưu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="overflow-hidden rounded-[20px] border border-border bg-[#0e1f31]">
          <div className="scale-[0.55] origin-top-left" style={{ width: `${100 / 0.55}%` }}>
            <FooterPreview settings={data} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[380px] shrink-0">
        <div className="sticky top-6 rounded-[20px] border border-border bg-card p-5">
          <div className="mb-5 border-b border-border pb-4">
            <h2 className="font-display text-base font-semibold text-card-foreground">Chỉnh sửa</h2>
            {selectedZone && <p className="mt-0.5 text-xs text-muted-foreground">Đang chỉnh sửa: {zoneLabel(selectedZone)}</p>}
          </div>
          <div className="min-h-[200px]">{renderEditPanel()}</div>
        </div>
      </div>
    </div>
  );
}

function FooterPreview({
  settings,
  selectedZone,
  onSelectZone,
}: {
  settings: FooterSettingsPayload;
  selectedZone: FooterZone | null;
  onSelectZone: (zone: FooterZone) => void;
}) {
  return (
    <footer className="mb-[15px] w-full rounded-[20px] bg-primary bg-[url('/images/dark-section-bg-image.png')] bg-cover bg-top bg-no-repeat pt-[120px] max-lg:mb-0 max-lg:rounded-none max-lg:pt-[60px]">
      <div className="mx-auto w-full max-w-[1300px] px-[15px]">
        <div className="mb-[60px] flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-[60px] max-lg:mb-[30px] max-lg:pb-[30px]">
          <button type="button" onClick={() => onSelectZone("newsletterTitle")}
            className={`max-w-[750px] text-left font-display text-3xl font-semibold uppercase leading-[1.2] text-white md:text-4xl lg:text-[42px] transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "newsletterTitle" ? "ring-2 ring-accent" : ""}`}>
            {settings.newsletterTitle} <Pencil className="ml-2 inline-block size-4 opacity-60" />
          </button>

          <div className="w-full max-w-[415px] max-lg:max-w-full">
            <button type="button" onClick={() => onSelectZone("newsletterSubtitle")}
              className={`block w-full text-left mb-5 font-display text-xl font-semibold uppercase text-white max-lg:mb-[15px] max-md:text-lg transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "newsletterSubtitle" ? "ring-2 ring-accent" : ""}`}>
              {settings.newsletterSubtitle} <Pencil className="ml-2 inline-block size-3 opacity-60" />
            </button>
            <form action="#" method="post" className="opacity-50 pointer-events-none">
              <button type="button" onClick={() => onSelectZone("newsletterPlaceholder")}
                className={`flex rounded-full bg-white/10 p-[5px] backdrop-blur-[30px] w-full transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "newsletterPlaceholder" ? "ring-2 ring-accent" : ""}`}>
                <input type="email" placeholder={settings.newsletterPlaceholder} readOnly className="min-w-0 flex-1 bg-transparent px-6 py-1.5 text-base text-white outline-none placeholder:text-white/60 pointer-events-none" />
                <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors duration-400 max-lg:size-10">
                  <Send className="size-[22px] max-lg:size-[18px]" aria-hidden />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-12">
          <div className="xl:col-span-3">
            <div className="inline-block opacity-50">
              <img src="/images/logo.svg" alt="sanam" className="h-[40px] w-auto max-w-[151px]" />
            </div>
            <ul className="mt-[50px] space-y-5 max-lg:mt-5 max-lg:space-y-3 opacity-50">
              <li>
                <span className="flex items-center gap-2.5 text-base text-white transition-colors duration-400 hover:text-accent">
                  <Phone className="size-6 shrink-0 text-accent" aria-hidden />
                  (+01) 123 456 789
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-base text-white transition-colors duration-400 hover:text-accent">
                  <Mail className="size-6 shrink-0 text-accent" aria-hidden />
                  info@domainname.com
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-[30px] max-md:justify-between xl:col-span-9 xl:ml-[4.167vw] xl:gap-[4.167vw]">
            <div className="relative w-full max-md:w-auto xl:border-r xl:border-white/10 xl:pr-[2.083vw] xl:w-[calc(25%-2.778vw)]">
              <button type="button" onClick={() => onSelectZone("quickLinksTitle")}
                className={`w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "quickLinksTitle" ? "ring-2 ring-accent" : ""}`}>
                <h2 className="mb-[25px] font-display text-xl font-semibold uppercase text-white max-md:mb-[15px] max-md:text-lg">
                  {settings.quickLinksTitle} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                </h2>
              </button>
              <button type="button" onClick={() => onSelectZone("quickLinks")}
                className={`block w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "quickLinks" ? "ring-2 ring-accent" : ""}`}>
                <ul>
                  {settings.quickLinks.map((link, idx) => (
                    <li key={idx} className="mb-[15px] text-base leading-normal text-white last:mb-0 max-lg:mb-2.5">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </button>
            </div>
            
            <div className="relative w-full max-md:w-auto xl:border-r xl:border-white/10 xl:pr-[2.083vw] xl:w-[calc(35%-2.778vw)]">
              <button type="button" onClick={() => onSelectZone("ourServicesTitle")}
                className={`w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "ourServicesTitle" ? "ring-2 ring-accent" : ""}`}>
                <h2 className="mb-[25px] font-display text-xl font-semibold uppercase text-white max-md:mb-[15px] max-md:text-lg">
                  {settings.ourServicesTitle} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                </h2>
              </button>
              <button type="button" onClick={() => onSelectZone("ourServices")}
                className={`block w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "ourServices" ? "ring-2 ring-accent" : ""}`}>
                <ul>
                  {settings.ourServices.map((link, idx) => (
                    <li key={idx} className="mb-[15px] text-base leading-normal text-white last:mb-0 max-lg:mb-2.5">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </button>
            </div>

            <div className="w-full xl:w-[calc(40%-2.778vw)]">
              <button type="button" onClick={() => onSelectZone("serviceTimesTitle")}
                className={`w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "serviceTimesTitle" ? "ring-2 ring-accent" : ""}`}>
                <h2 className="mb-[25px] font-display text-xl font-semibold uppercase text-white max-md:mb-[15px] max-md:text-lg">
                  {settings.serviceTimesTitle} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                </h2>
              </button>
              <button type="button" onClick={() => onSelectZone("serviceTimes")}
                className={`block w-full text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "serviceTimes" ? "ring-2 ring-accent" : ""}`}>
                <ul>
                  {settings.serviceTimes.map((time) => (
                    <li key={time} className="mb-[15px] text-base leading-normal text-white last:mb-0 max-lg:mb-2.5 flex items-center before:mr-[10px] before:block before:size-[5px] before:rounded-full before:bg-accent before:content-['']">
                      {time}
                    </li>
                  ))}
                </ul>
              </button>
              
              <div className="mt-[30px] border-t border-white/10 pt-[30px] max-lg:mt-5 max-lg:pt-5">
                <button type="button" onClick={() => onSelectZone("socialLinks")}
                  className={`block w-full text-left transition-all hover:ring-2 hover:ring-accent/50 p-2 -m-2 rounded ${selectedZone === "socialLinks" ? "ring-2 ring-accent" : ""}`}>
                  <ul className="flex flex-wrap gap-[15px]">
                    {settings.socialLinks.map(({ network }) => {
                      const Icon = getSocialIcon(network);
                      return (
                        <li key={network}>
                          <span className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-400 hover:bg-accent">
                            <Icon className="size-[18px]" aria-hidden />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[60px] border-t border-white/10 py-10 text-center max-lg:mt-[30px] max-lg:py-[30px]">
          <button type="button" onClick={() => onSelectZone("copyrightText")}
            className={`transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "copyrightText" ? "ring-2 ring-accent" : ""}`}>
            <p className="text-base text-white">{settings.copyrightText} <Pencil className="ml-1 inline-block size-3 opacity-60" /></p>
          </button>
        </div>
      </div>
    </footer>
  );
}
