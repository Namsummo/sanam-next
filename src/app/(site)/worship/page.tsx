
import { WorshipPlatform } from "@/components/site/worship/worship-platform";

export const metadata = {
  title: "Truyền Thông Trực Tuyến — Giáo xứ Sa Nam",
  description: "Trang phát trực tiếp Thánh lễ và lưu trữ bài giảng, video phụng vụ của Giáo xứ Sa Nam.",
};

export default function WorshipPage() {
  return (
    <main className="w-full bg-background min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-[1300px]">
        <WorshipPlatform />
      </div>
    </main>
  );
}

