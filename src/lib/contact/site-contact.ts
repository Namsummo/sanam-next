export type ContactInfoItem = {
  id: string;
  title: string;
  value: string;
  href?: string;
  iconSrc: string;
  fullWidth?: boolean;
};

export const siteContactInfo = {
  subtitle: "Liên hệ với chúng tôi",
  title: "Kết nối với Giáo xứ Sa Nam",
  description:
    "Chúng tôi rất mong được lắng nghe từ quý vị. Dù quý vị có nhu cầu cầu nguyện, thắc mắc về các Thánh lễ hay muốn tham gia phục vụ trong giáo xứ, xin đừng ngần ngại liên hệ.",
  formTitle: "Gửi lời nhắn hoặc yêu cầu cầu nguyện",
  mapSubtitle: "Vị trí giáo xứ",
  mapTitle: "Tìm đường đến Giáo xứ Sa Nam",
  mapDescription:
    "Nhà thờ Giáo xứ Sa Nam thuộc xóm 4, xã Giao Minh, tỉnh Ninh Bình, thuộc Giáo phận Bùi Chu. Mời quý vị đến tham dự Thánh lễ và các hoạt động cộng đoàn.",
  mapUrl:
    "https://www.google.com/maps/place/Nh%C3%A0+th%E1%BB%9D+Sa+Nam/@20.2788263,106.5327158,17z/data=!3m1!4b1!4m6!3m5!1s0x3136001f74824841:0x364809c0ff5b79b8!8m2!3d20.2788213!4d106.5352961!16s%2Fg%2F1tfz7np2?entry=ttu",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.789!2d106.5325419!3d20.2788213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136001f74824841%3A0x364809c0ff5b79b8!2zTmjhuqFuIHRo4b-mIFNhIE5hbQ!5e0!3m2!1svi!2s!4v1748515200000!5m2!1svi!2s",
} as const;

export const siteContactItems: ContactInfoItem[] = [
  {
    id: "email",
    title: "Email",
    value: "lienhe@sanam.org",
    href: "mailto:lienhe@sanam.org",
    iconSrc: "/images/icon-mail-white.svg",
  },
  {
    id: "phone",
    title: "Điện thoại",
    value: "(028) 1234 5678",
    href: "tel:+842812345678",
    iconSrc: "/images/icon-phone-white.svg",
  },
  {
    id: "location",
    title: "Địa chỉ",
    value: "Xóm 4, xã Giao Minh, tỉnh Ninh Bình (Giáo phận Bùi Chu)",
    href: "https://www.google.com/maps/place/Nh%C3%A0+th%E1%BB%9D+Sa+Nam/@20.2788263,106.5327158,17z/data=!3m1!4b1!4m6!3m5!1s0x3136001f74824841:0x364809c0ff5b79b8!8m2!3d20.2788213!4d106.5352961!16s%2Fg%2F1tfz7np2?entry=ttu",
    iconSrc: "/images/icon-location-white.svg",
    fullWidth: true,
  },
];
