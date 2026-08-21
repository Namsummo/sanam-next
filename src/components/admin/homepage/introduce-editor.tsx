"use client";

import { BlogEditor } from "@/components/admin/shared/blog-editor";
import { Button } from "@/components/site/shared/ui/button/button";

export function IntroduceEditor() {
  return (
    <div className="border border-border rounded-xl p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Nội dung trang Giới thiệu
          </h2>
        </div>
        <div>
          <label
            htmlFor="introduce-title"
            className="mb-1.5 block text-sm font-medium text-card-foreground"
          >
            Tiêu đề nổi bật
          </label>
          <input
            id="introduce-title"
            type="text"
            placeholder="Nhập nội dung"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-display text-lg font-semibold text-card-foreground placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-card-foreground">
            Nội dung
          </label>
          <BlogEditor content=''
            onChange={() => { }}

          />
        </div>
        <div className="flex justify-end gap-2 items-center">
          <Button
            variant="primary"
            type="submit"
            showIcon={false}
            className="h-11"
          >
            Lưu
          </Button>
        </div>

      </div>
    </div>
  );
}
