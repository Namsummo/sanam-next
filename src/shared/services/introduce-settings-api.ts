const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface IntroduceSettingsData {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_INTRODUCE_SETTINGS: IntroduceSettingsData = {
  title: "Kinh ông thánh Quan Thầy Venceslao",
  content: `<p>Lạy ơn ông Thánh Venceslao vua, xưa đã đánh giặc xác thịt thế gian, ma quỷ là ba thù mạnh, cho hết lòng hết sức, vì có lòng kính mến trông cậy Đức Chúa Trời cho vững, chúng con xin ông Thánh Venceslao cầu cho chúng con đáng chịu lấy những sự Chúa Kitô đã hứa, Lạy ơn Đức Chúa Trời có phép vô cùng đã ban nhân đức khiêm nhường nhịn nhục cho ông Thánh Venceslao hạ mình xuống, vì đã được lên cao trọng làm vua thế gian mà càng lên trọng thì nên hưởng phúc Thiên đàng, chúng con xin Người cầu cho chúng con được lòng kính mến bắt chước Người, vì Đức khiêm nhường, nhịn nhục ở đời này cho ngày sau được hưởng phúc trọng cùng Người trên nước Thiên đàng, vì Đức Chúa Giêsu Kitô là Chúa chúng con. Amen</p>`,
};

export async function getIntroduceSettings(): Promise<IntroduceSettingsData> {
  const res = await fetch(`${API_BASE}/api/introduce-settings`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch introduce settings");
  return res.json();
}

export async function updateIntroduceSettings(
  token: string,
  data: Partial<IntroduceSettingsData>,
): Promise<IntroduceSettingsData> {
  const res = await fetch(`${API_BASE}/api/introduce-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update introduce settings" }));
    throw new Error(err.message || "Failed to update introduce settings");
  }
  return res.json();
}
