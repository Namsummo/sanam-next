import * as XLSX from "xlsx";
import type { ExecutiveMember } from "@/lib/organization/types";
import { normalizeExecutiveMemberRole } from "@/lib/organization/executive-member-roles";
import { normalizeExecutiveMembers } from "@/lib/organization/executive-members";

const HEADERS_WITH_STT = [
  "STT",
  "Tên thánh",
  "Họ và tên",
  "Ngày sinh",
  "Chức vụ",
  "Giáo khu",
  "Link ảnh",
];

const HEADERS_LEGACY = [
  "Tên thánh",
  "Họ và tên",
  "Ngày sinh",
  "Chức vụ",
  "Giáo khu",
  "Link ảnh",
];

const EXAMPLE_ROW = [
  "1",
  "Gioan",
  "Nguyễn Văn A",
  "1990-01-15",
  "Trưởng",
  "Giáo khu 1",
  "https://cdng.europosters.eu/pod_public/750/186138.jpg",
];

type ParsedMembersResult = {
  members: ExecutiveMember[];
  errors: string[];
};

type ColumnLayout = {
  hasSortOrder: boolean;
  hasImageLink: boolean;
};

function cellToString(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim();
}

function normalizeHeaderLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseSortOrder(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function normalizeImageUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

function detectColumnLayout(headerRow: unknown[]): ColumnLayout {
  const headers = headerRow.map((cell) =>
    normalizeHeaderLabel(cellToString(cell)),
  );
  const firstHeader = headers[0] ?? "";
  const hasSortOrder =
    firstHeader === "stt" ||
    firstHeader === "so thu tu" ||
    headers.includes("stt");
  const hasImageLink = headers.some(
    (header) =>
      header === "link anh" ||
      header === "link hinh anh" ||
      header === "url anh" ||
      header === "image" ||
      header === "anh",
  );

  return { hasSortOrder, hasImageLink };
}

function memberToRow(member: ExecutiveMember): string[] {
  return [
    String(member.sortOrder ?? ""),
    member.patronSaint ?? "",
    member.fullName,
    member.birthday ?? "",
    member.position ?? "",
    member.parish ?? "",
    member.image ?? "",
  ];
}

function rowToMember(
  row: unknown[],
  rowNumber: number,
  layout: ColumnLayout,
): { member?: ExecutiveMember; error?: string } {
  const offset = layout.hasSortOrder ? 1 : 0;
  const sortOrder = layout.hasSortOrder
    ? parseSortOrder(cellToString(row[0]))
    : undefined;
  const patronSaint = cellToString(row[offset]);
  const fullName = cellToString(row[offset + 1]);
  const birthday = cellToString(row[offset + 2]);
  const positionRaw = cellToString(row[offset + 3]);
  const parish = cellToString(row[offset + 4]);
  const imageRaw = layout.hasImageLink ? cellToString(row[offset + 5]) : "";
  const image = normalizeImageUrl(imageRaw);

  if (!fullName) {
    if (
      !patronSaint &&
      !birthday &&
      !positionRaw &&
      !parish &&
      !imageRaw &&
      sortOrder == null
    ) {
      return {};
    }

    return { error: `Dòng ${rowNumber}: Họ và tên không được để trống.` };
  }

  if (imageRaw && !image) {
    return {
      error: `Dòng ${rowNumber}: Link ảnh không hợp lệ (cần bắt đầu bằng http:// hoặc https://).`,
    };
  }

  const position = normalizeExecutiveMemberRole(positionRaw) || "Thành viên";

  return {
    member: {
      fullName,
      patronSaint: patronSaint || undefined,
      birthday: birthday || undefined,
      position,
      parish: parish || undefined,
      image: image || "",
      sortOrder,
    },
  };
}

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

function createWorksheet(rows: string[][]) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 24 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 42 },
  ];
  return worksheet;
}

export function downloadMembersExcelTemplate(
  filename = "mau-thanh-vien-ban-dieu-hanh.xlsx",
) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    createWorksheet([HEADERS_WITH_STT, EXAMPLE_ROW]),
    "Thành viên",
  );
  downloadWorkbook(workbook, filename);
}

export function exportMembersToExcel(
  members: ExecutiveMember[],
  filename = "thanh-vien-ban-dieu-hanh.xlsx",
) {
  const normalizedMembers = normalizeExecutiveMembers(members);
  const rows = [HEADERS_WITH_STT, ...normalizedMembers.map(memberToRow)];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, createWorksheet(rows), "Thành viên");
  downloadWorkbook(workbook, filename);
}

export async function parseMembersFromExcel(
  file: File,
): Promise<ParsedMembersResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return { members: [], errors: ["File Excel không có sheet dữ liệu."] };
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  if (rows.length === 0) {
    return { members: [], errors: ["File Excel không có dữ liệu."] };
  }

  const headerRow = Array.isArray(rows[0]) ? rows[0] : [];
  const layout = detectColumnLayout(headerRow);
  const dataRows = rows.slice(1);
  const parsedMembers: ExecutiveMember[] = [];
  const errors: string[] = [];

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2;
    const result = rowToMember(
      Array.isArray(row) ? row : [],
      rowNumber,
      layout,
    );

    if (result.error) {
      errors.push(result.error);
      return;
    }

    if (result.member) {
      parsedMembers.push(result.member);
    }
  });

  if (parsedMembers.length === 0 && errors.length === 0) {
    errors.push("Không tìm thấy thành viên hợp lệ trong file Excel.");
  }

  return {
    members: normalizeExecutiveMembers(parsedMembers),
    errors,
  };
}

export { HEADERS_LEGACY, HEADERS_WITH_STT };
