import Image from "next/image";
import Link from "next/link";
import { Calendar, History, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { DEFAULT_COVER } from "@/lib/image-constants";
import { formatIsoDateToVi } from "@/lib/format";
import { getServiceRecordsByPersonId } from "@/lib/organization/mock-member-service-records";
import { buildServiceHistoryRows } from "@/lib/organization/service-history";
import type { MemberPerson, MemberServiceStatus } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<MemberServiceStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  retired: "bg-amber-100 text-amber-900",
  inactive: "bg-gray-200 text-gray-700",
};

type OrganizationMemberDetailViewProps = {
  person: MemberPerson;
  backHref: string;
  backLabel: string;
};

export function OrganizationMemberDetailView({
  person,
  backHref,
  backLabel,
}: OrganizationMemberDetailViewProps) {
  const historyRows = buildServiceHistoryRows(
    getServiceRecordsByPersonId(person.id),
  );

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="overflow-hidden rounded-[24px] border border-border/40 bg-card shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        <div className="border-b border-border/40 bg-[#eae7de]/70 p-6 sm:p-8 md:flex md:items-center md:gap-8">
          <figure className="mx-auto mb-5 size-[140px] shrink-0 overflow-hidden rounded-[20px] border-4 border-white shadow-md md:mx-0 md:mb-0 md:size-[180px]">
            <Image
              src={DEFAULT_COVER}
              alt={`${person.saintName} ${person.realName}`}
              width={180}
              height={180}
              className="size-full object-cover"
              priority
            />
          </figure>

          <div className="text-center md:text-left">
            <p className="font-sans text-sm font-medium text-foreground/70">
              {person.saintName}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-primary md:text-4xl">
              {person.realName}
            </h1>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
              <div className="flex items-center justify-center gap-2 rounded-[12px] bg-white/60 px-4 py-2.5 md:justify-start">
                <Calendar className="size-4 shrink-0 text-accent" aria-hidden />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    Ngày sinh
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatIsoDateToVi(person.dateOfBirth)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-[12px] bg-white/60 px-4 py-2.5 md:justify-start">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    Địa chỉ
                  </p>
                  <p className="text-sm font-semibold text-primary">{person.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <History className="size-5 text-accent" aria-hidden />
            <h2 className="font-display text-xl font-semibold uppercase text-primary md:text-2xl">
              Lịch sử phục vụ
            </h2>
          </div>

          {historyRows.length === 0 ? (
            <p className="font-sans text-base text-foreground/80">
              Chưa có lịch sử phục vụ được ghi nhận.
            </p>
          ) : (
            <div className="rounded-[16px] border border-border/40 bg-[#f5f3ec]/50">
              <Table className="min-w-[640px]">
                <TableHeader className="bg-[#eae7de]/40">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider text-primary">
                      Đoàn hội
                    </TableHead>
                    <TableHead className="px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider text-primary">
                      Khóa / Thời gian
                    </TableHead>
                    <TableHead className="px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider text-primary">
                      Chức vụ
                    </TableHead>
                    <TableHead className="px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider text-primary">
                      Trạng thái
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-border/30 hover:bg-white/40"
                    >
                      <TableCell className="px-4 py-3.5 font-sans text-sm font-semibold text-primary">
                        {row.organizationName}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                        {row.termLabel}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                        {row.position}
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold",
                            STATUS_BADGE[row.status],
                          )}
                        >
                          {row.statusLabel}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <Link
          href={backHref}
          className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
        >
          ← {backLabel}
        </Link>
      </div>
    </div>
  );
}
