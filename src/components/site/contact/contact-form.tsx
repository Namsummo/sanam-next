"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/site/shared/ui/button/button";

const inputClassName = cn(
  "w-full rounded-[10px] border-0 bg-background px-5 py-[15px]",
  "font-sans text-base font-normal leading-none text-primary outline-none",
  "placeholder:text-foreground",
);

type ContactFormProps = {
  title: string;
  className?: string;
};

export function ContactForm({ title, className }: ContactFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div
      className={cn(
        "rounded-[20px] bg-secondary p-[3.125vw] max-md:p-7.5 max-sm:p-5",
        className,
      )}
    >
      <div className="mb-10 max-md:mb-7.5">
        <h2 className="font-display text-[30px] font-semibold uppercase leading-none text-primary max-md:text-[26px] max-sm:text-[22px]">
          {title}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="font-sans">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <div className="mb-4">
            <label htmlFor="contact-first-name" className="sr-only">
              Họ
            </label>
            <input
              id="contact-first-name"
              type="text"
              name="firstName"
              placeholder="Họ"
              required
              className={inputClassName}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact-last-name" className="sr-only">
              Tên
            </label>
            <input
              id="contact-last-name"
              type="text"
              name="lastName"
              placeholder="Tên"
              required
              className={inputClassName}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact-phone" className="sr-only">
              Số điện thoại
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              required
              className={inputClassName}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Email"
              required
              className={inputClassName}
            />
          </div>

          <div className="mb-5 md:col-span-2">
            <label htmlFor="contact-message" className="sr-only">
              Nội dung
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Nội dung tin nhắn hoặc yêu cầu cầu nguyện"
              className={cn(inputClassName, "min-h-35 resize-y leading-normal")}
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" variant="primary">
              Gửi tin nhắn
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
