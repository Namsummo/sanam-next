export type ContactFormValues = {
  subtitle: string;
  title: string;
  description: string;
  formTitle: string;

  mapSubtitle: string;
  mapTitle: string;
  mapDescription: string;
  mapUrl: string;
  mapEmbedUrl: string;

  donationSubtitle: string;
  donationTitle: string;
  donationDescription: string;
};

export function createEmptyContactFormValues(): ContactFormValues {
  return {
    subtitle: "Liên hệ với chúng tôi",
    title: "Kết nối với Giáo xứ Sa Nam",
    description:
      "Chúng tôi rất mong được lắng nghe từ quý vị.",
    formTitle: "Gửi lời nhắn hoặc yêu cầu cầu nguyện",

    mapSubtitle: "Vị trí giáo xứ",
    mapTitle: "Tìm đường đến Giáo xứ Sa Nam",
    mapDescription:
      "Nhà thờ Giáo xứ Sa Nam thuộc xóm 4, xã Giao Minh, tỉnh Ninh Bình, thuộc Giáo phận Bùi Chu.",
    mapUrl: "",
    mapEmbedUrl: "",

    donationSubtitle: "Quyên góp",
    donationTitle: "Đồng hành cùng Giáo xứ Sa Nam",
    donationDescription:
      "Quý vị có thể quyên góp ủng hộ hoạt động mục vụ giáo xứ hoặc đóng góp phát triển website.",
  };
}
