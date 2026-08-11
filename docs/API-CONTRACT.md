# Giáo xứ Sa Nam — API Contract (Frontend ↔ Backend)

Tài liệu mô tả **định dạng JSON** và **endpoint gợi ý** để team Backend triển khai API phục vụ website Next.js (`sanam-next`).

**Nguồn tham chiếu trong repo:**

| Module | Types | Mock mẫu |
|--------|-------|----------|
| Tin tức | `src/lib/news/types.ts` | `src/lib/news/mock-news.ts` |
| Sự kiện | `src/lib/events/types.ts` | `src/lib/events/mock-events.ts` |
| Quý Cha / Ban Hành Giáo | `src/lib/clergy/types.ts` | `src/lib/clergy/mock-clergy.ts` |
| Đoàn thể | `src/lib/organization/types.ts` | `src/lib/organization/mock-*.ts` |
| Video / Live | `src/lib/videos/types.ts` | `src/lib/videos/mock-videos.ts` |
| Lịch Thánh Lễ | `src/lib/mass/mock-mass.ts` | (cùng file) |
| Liên hệ | `src/components/site/contact/contact-form.tsx` | `src/lib/contact/site-contact.ts` |

**Trạng thái FE hiện tại:** dùng mock/localStorage, chưa gọi API thật. Khi BE sẵn sàng, FE thay mock bằng `fetch` tới `NEXT_PUBLIC_API_URL`.

---

## 1. Quy ước chung

### 1.1 Giao thức

- REST over HTTPS
- Request/Response body: **`application/json; charset=utf-8`**
- Mã lỗi HTTP chuẩn: `400`, `401`, `403`, `404`, `422`, `500`

### 1.2 Response envelope (khuyến nghị)

**Danh sách:**

```json
{
  "data": [ /* ... */ ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 42
  }
}
```

**Một bản ghi:**

```json
{
  "data": { /* object */ }
}
```

**Lỗi:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mô tả lỗi cho người dùng hoặc dev",
    "details": [
      { "field": "email", "message": "Email không hợp lệ" }
    ]
  }
}
```

### 1.3 Ngày giờ

| Kiểu | Format | Ví dụ |
|------|--------|-------|
| Ngày đăng / sự kiện | ISO 8601 (có timezone) hoặc `YYYY-MM-DD` | `2026-05-20T08:00:00+07:00` |
| Ngày sinh, ngày thụ phong | `YYYY-MM-DD` | `1970-06-29` |
| Giờ lễ (lịch) | `HH:mm` (24h) | `05:30` |
| Lễ bổn mạng (hiển thị) | Chuỗi tự do | `29/06` |

### 1.4 Ảnh & media

- Trả **URL tuyệt đối** (`https://cdn.../path.jpg`), không nhúng file base64 trong list API.
- FE có ảnh mặc định khi thiếu: `/images/default-cover.jpg`.
- **Đề xuất bổ sung** các field sau (FE chưa có trong type nhưng cần từ BE):

| Entity | Field đề xuất |
|--------|----------------|
| `NewsArticle` | `coverImage?: string` |
| `ClergyMember` | `imageUrl?: string` |
| `Organization` | `coverImage?: string` |
| `MemberPerson` | `avatarUrl?: string` |

### 1.5 Slug

- `slug` dùng cho URL: `/news/{slug}`, `/events/{slug}`, `/organization/{slug}`.
- Chỉ chữ thường, số, dấu gạch ngang; unique trong từng collection.
- Nếu không có `slug`, FE có thể fallback `id` (nên BE luôn sinh slug).

### 1.6 API công khai vs Admin

| Loại | Quy tắc |
|------|---------|
| **Public API** (website) | Chỉ trả bản ghi `isVisible: true`; tin/sự kiện đã publish |
| **Admin API** (CMS) | CRUD đầy đủ, có auth; có thể trả `draft`, `isVisible: false` |

---

## 2. Danh mục (Categories)

### 2.1 Tin tức — `GET /api/news/categories`

Nguồn: `src/lib/news/categories.ts`

| `id` | `label` |
|------|---------|
| `thong-bao` | Thông báo |
| `su-kien` | Sự kiện |
| `le-kinh` | Lễ kính |
| `hoat-dong` | Hoạt động |
| `bai-viet` | Bài viết |
| `cao-pho` | Cáo phó |

```json
{
  "data": [
    { "id": "thong-bao", "label": "Thông báo", "sortOrder": 1 },
    { "id": "su-kien", "label": "Sự kiện", "sortOrder": 2 }
  ]
}
```

### 2.2 Sự kiện — `GET /api/events/categories`

Nguồn: `src/lib/events/categories.ts`

| `id` | `label` |
|------|---------|
| `le-kinh` | Lễ kính |
| `ruoc-kieu` | Rước kiệu |
| `hoi-cho` | Hội chợ |
| `giuong-trai` | Giữ chân |
| `gioi-tre` | Giới trẻ |
| `bac-ai` | Bác ái |

---

## 3. Tin tức (News)

### 3.1 Schema — `NewsArticle`

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `id` | string | ✓ | ID nội bộ |
| `slug` | string | | URL-friendly, unique |
| `title` | string | ✓ | Tiêu đề |
| `excerpt` | string | ✓ | Đoạn trích (danh sách) |
| `content` | string | ✓ | Nội dung đầy đủ |
| `contentFormat` | `"plain"` \| `"html"` | ✓ | FE render HTML khi `html` |
| `categoryId` | string | | Tham chiếu danh mục §2.1 |
| `coverImage` | string | | URL ảnh bìa (**đề xuất thêm**) |
| `publishedAt` | string | ✓ | ISO 8601 |
| `isFeatured` | boolean | ✓ | Hiện block Trang chủ (tối đa 3) |
| `isVisible` | boolean | ✓ | Bật/tắt hiển thị web |

### 3.2 Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/news` | Danh sách, mới nhất trước |
| GET | `/api/news?featured=true&limit=3` | Tin nổi bật Trang chủ |
| GET | `/api/news?categoryId=le-kinh` | Lọc danh mục |
| GET | `/api/news/{slug}` | Chi tiết |
| GET | `/api/news/categories` | Danh mục + có thể kèm `count` |

**Quy tắc FE (public):**

- `isVisible === true`
- Sắp xếp: `publishedAt` giảm dần
- Featured: `isFeatured === true`, lấy tối đa 3

### 3.3 Ví dụ JSON

```json
{
  "data": [
    {
      "id": "news-001",
      "slug": "thanh-le-khai-mac-nam-thanh-giao-xu-2026",
      "title": "Thánh lễ Khai mạc Năm Thánh Giáo xứ Thánh Giuse 2026",
      "excerpt": "Vào lúc 8h00 sáng Chúa Nhật ngày 24/5/2026...",
      "content": "<p>Giáo xứ trân trọng kính mời...</p>",
      "contentFormat": "html",
      "categoryId": "le-kinh",
      "coverImage": "https://cdn.example.com/news/news-001.jpg",
      "publishedAt": "2026-05-20T08:00:00+07:00",
      "isFeatured": true,
      "isVisible": true
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "total": 12 }
}
```

---

## 4. Sự kiện (Events)

### 4.1 Schema — `ParishEvent`

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `id` | string | ✓ | |
| `slug` | string | | |
| `name` | string | ✓ | Tên sự kiện |
| `startDate` | string | ✓ | `YYYY-MM-DD` |
| `startTime` | string | | `HH:mm` |
| `endDate` | string | | Mặc định = `startDate` nếu thiếu |
| `endTime` | string | | |
| `allDay` | boolean | | |
| `location` | string | ✓ | |
| `content` | string | ✓ | |
| `contentFormat` | `"plain"` \| `"html"` | ✓ | |
| `image` | string | | URL ảnh |
| `categoryId` | string | | §2.2 |
| `isFeatured` | boolean | ✓ | Block Trang chủ (tối đa 2) |
| `featuredOrder` | number | | Thứ tự nổi bật (nhỏ trước) |
| `status` | enum | ✓ | Xem bảng dưới |
| `isVisible` | boolean | ✓ | |

**`status`:**

| Giá trị | Ý nghĩa |
|---------|---------|
| `draft` | Nháp — không hiện web |
| `published` | Đã công bố |
| `cancelled` | Đã hủy |
| `postponed` | Hoãn |

### 4.2 Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/events` | Sự kiện còn diễn ra |
| GET | `/api/events?featured=true&limit=2` | Nổi bật Trang chủ |
| GET | `/api/events?thisWeek=true` | Sự kiện trong tuần (theo `anchor` hoặc server date) |
| GET | `/api/events/{slug}` | Chi tiết |
| GET | `/api/events/categories` | Danh mục |

**Quy tắc FE (public) — BE nên implement tương đương:**

1. `isVisible === true` **và** `status === "published"`
2. Chưa kết thúc: `endDate ?? startDate` ≥ hôm nay (00:00 local hoặc timezone `Asia/Ho_Chi_Minh`)
3. Sắp xếp theo `startDate` + `startTime` tăng dần
4. Featured: `isFeatured`, sort `featuredOrder` ASC

### 4.3 Ví dụ JSON

```json
{
  "data": [
    {
      "id": "event-001",
      "slug": "ruoc-kieu-chua-thanh-the-2026",
      "name": "Rước kiệu Chúa Thánh Thể — Lễ Thánh Thể",
      "startDate": "2026-05-31",
      "startTime": "16:00",
      "endTime": "18:30",
      "location": "Nhà thờ Giáo xứ Sa Nam — quanh khuôn viên giáo xứ",
      "content": "<p>Giáo xứ trân trọng kính mời...</p>",
      "contentFormat": "html",
      "image": "https://cdn.example.com/events/event-001.jpg",
      "categoryId": "ruoc-kieu",
      "isFeatured": true,
      "featuredOrder": 1,
      "status": "published",
      "isVisible": true
    }
  ]
}
```

---

## 5. Quý Cha & Ban Hành Giáo (Clergy)

### 5.1 Schema — `ClergyMember`

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `id` | number | ✓ | |
| `type` | `1` \| `2` | ✓ | `1` = Quý Cha (linh mục), `2` = Ban Hành Giáo |
| `fullName` | string | ✓ | |
| `position` | string | ✓ | Chức vụ |
| `motto` | string | | Khẩu hiệu |
| `description` | string | | Mô tả ngắn (thẻ) |
| `birthday` | string | | `YYYY-MM-DD` |
| `ordinationDate` | string | | Chỉ type `1` — ngày thụ phong |
| `patronSaint` | string | | Thánh bổn mạng |
| `patronDate` | string | | Lễ bổn mạng |
| `hometown` | string | | Quê quán / Giáo họ |
| `imageUrl` | string | | (**đề xuất thêm**) |
| `sortOrder` | number | | Thứ tự hiển thị |
| `isVisible` | boolean | | Mặc định `true` |

### 5.2 Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/clergy` | Tất cả (visible) |
| GET | `/api/clergy?type=1` | Quý Cha |
| GET | `/api/clergy?type=2` | Ban Hành Giáo |
| GET | `/api/clergy/{id}` | Chi tiết (popup) |

**Quy tắc FE:** `isVisible !== false`, sort `sortOrder` ASC.

### 5.3 Ví dụ JSON

```json
{
  "data": [
    {
      "id": 1,
      "type": 1,
      "fullName": "Linh mục Phaolô Nguyễn Văn Hữu",
      "position": "Cha Chánh Xứ",
      "motto": "Tôi đến không phải để được phục vụ...",
      "description": "Với hơn 20 năm hồng ân Linh mục...",
      "birthday": "1970-06-29",
      "ordinationDate": "2000-06-29",
      "patronSaint": "Thánh Phaolô Tông Đồ",
      "patronDate": "29/06",
      "hometown": "Giáo phận Vinh",
      "imageUrl": "https://cdn.example.com/clergy/1.jpg",
      "sortOrder": 1,
      "isVisible": true
    }
  ]
}
```

---

## 6. Đoàn thể (Organizations)

Mô hình **quan hệ** — BE có thể trả nested hoặc tách endpoint.

### 6.1 `Organization`

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `id` | string | ✓ | |
| `slug` | string | ✓ | URL: `/organization/{slug}` |
| `name` | string | ✓ | Tên hội đoàn |
| `memberCount` | number | ✓ | Số thành viên (hiển thị) |
| `description` | string | ✓ | |
| `coverImage` | string | | (**đề xuất thêm**) |
| `isVisible` | boolean | ✓ | |

### 6.2 `OrganizationTerm`

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | Format FE đang dùng: `"2024-2026"` = khóa 2024–2026 |
| `startYear` | number | |
| `endYear` | number | |

### 6.3 `MemberPerson`

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | |
| `saintName` | string | Tên thánh |
| `realName` | string | Tên thật |
| `dateOfBirth` | string | `YYYY-MM-DD` |
| `address` | string | |
| `avatarUrl` | string | (**đề xuất thêm**) |

### 6.4 `OrganizationMember`

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | |
| `personId` | string | → `MemberPerson.id` |
| `organizationSlug` | string | |
| `termId` | string | → `OrganizationTerm.id` |
| `position` | string | Chức vụ trong khóa |
| `isExecutive` | boolean | `true` = Ban điều hành |
| `sortOrder` | number | |

### 6.5 `MemberServiceRecord` (lịch sử phục vụ)

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | |
| `personId` | string | |
| `organizationSlug` | string | |
| `termId` | string | |
| `position` | string | |
| `status` | `"active"` \| `"retired"` \| `"inactive"` | |

### 6.6 Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/organizations` | Danh sách hội (visible) |
| GET | `/api/organizations/{slug}` | Chi tiết + members theo `termId` |
| GET | `/api/organizations/{slug}?termId=2024-2026` | Lọc khóa |
| GET | `/api/members/{personId}` | Hồ sơ + `serviceHistory` |

**Response chi tiết hội (gợi ý nested):**

```json
{
  "data": {
    "id": "org-001",
    "slug": "ca-doan",
    "name": "Ca đoàn",
    "memberCount": 48,
    "description": "Ca đoàn phục vụ trong các Thánh lễ...",
    "coverImage": "https://cdn.example.com/orgs/ca-doan.jpg",
    "isVisible": true,
    "terms": [
      { "id": "2024-2026", "startYear": 2024, "endYear": 2026 }
    ],
    "members": [
      {
        "id": "mem-001",
        "personId": "person-hung",
        "organizationSlug": "ca-doan",
        "termId": "2024-2026",
        "position": "Trưởng ban",
        "isExecutive": true,
        "sortOrder": 1,
        "saintName": "Gioan Baotixita",
        "realName": "Nguyễn Văn Hùng"
      }
    ]
  }
}
```

**Hồ sơ thành viên (`GET /api/members/{personId}`):**

```json
{
  "data": {
    "id": "person-hung",
    "saintName": "Gioan Baotixita",
    "realName": "Nguyễn Văn Hùng",
    "dateOfBirth": "1975-06-24",
    "address": "Khu Đông",
    "avatarUrl": "https://cdn.example.com/members/person-hung.jpg",
    "serviceHistory": [
      {
        "id": "rec-001",
        "organizationName": "Ca đoàn",
        "organizationSlug": "ca-doan",
        "termLabel": "Khóa 2024 – 2026",
        "startYear": 2024,
        "position": "Trưởng ban",
        "status": "active",
        "statusLabel": "Đang phục vụ"
      }
    ]
  }
}
```

---

## 7. Lịch Thánh Lễ (Mass schedule)

### 7.1 Schema

```typescript
// MassScheduleGroup
{
  "id": "weekday" | "saturday" | "sunday",
  "label": string,
  "entries": [{ "time": "HH:mm", "title"?: string }]
}
```

**Dữ liệu mặc định hiện tại (có thể CMS hóa):**

| `id` | `label` | Giờ |
|------|---------|-----|
| `weekday` | Ngày thường | 05:30 |
| `saturday` | Thứ Bảy | 05:30, 18:00, 19:00 (Giới trẻ) |
| `sunday` | Chủ Nhật | 04:30, 06:00, 08:00 (Thiếu nhi), 19:00 (Giới trẻ) |

### 7.2 Endpoint

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/mass-schedule` | Trả 3 nhóm; FE tự đưa nhóm “hôm nay” lên đầu |

**Tùy chọn:** query `?anchor=2026-06-01` để BE sắp xếp nhóm “hôm nay” trước (nếu muốn logic ở server).

### 7.3 Ví dụ JSON

```json
{
  "data": [
    {
      "id": "sunday",
      "label": "Chủ Nhật",
      "entries": [
        { "time": "04:30" },
        { "time": "06:00" },
        { "time": "08:00", "title": "Thiếu nhi" },
        { "time": "19:00", "title": "Giới trẻ" }
      ]
    },
    {
      "id": "weekday",
      "label": "Ngày thường",
      "entries": [{ "time": "05:30" }]
    }
  ]
}
```

---

## 8. Phụng vụ — Video & Livestream

### 8.1 Schema — `Video`

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | |
| `title` | string | |
| `youtubeId` | string | 11 ký tự |
| `youtubeUrl` | string | |
| `publishedAt` | string | Ngày đăng |
| `duration` | string | VD: `"1:05:12"` |
| `thumbnail` | string | URL (có thể derive từ YouTube) |
| `category` | `"mass-event"` \| `"hymn"` | Thánh lễ & sự kiện / Thánh ca |
| `description` | string | |
| `views` | number | |
| `speaker` | string | Cha / ca sĩ |

### 8.2 Schema — `LiveSettings`

| Field | Type | Mô tả |
|-------|------|-------|
| `isLive` | boolean | |
| `youtubeId` | string | |
| `youtubeUrl` | string | |
| `title` | string | |
| `description` | string | |
| `startedAt` | string | ISO 8601 |

**Lưu ý:** FE có thể gọi `GET /api/youtube/metadata?videoId=...` (route Next.js nội bộ) để bổ sung title/thumbnail từ YouTube oEmbed.

### 8.3 Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/videos` | Thư viện; query `?category=mass-event` |
| GET | `/api/live` | Trạng thái live hiện tại |

### 8.4 Ví dụ JSON

```json
{
  "data": {
    "isLive": false,
    "youtubeId": "",
    "youtubeUrl": "",
    "title": null,
    "description": null,
    "startedAt": null
  }
}
```

```json
{
  "data": [
    {
      "id": "v-001",
      "title": "Thánh Lễ Chúa Nhật...",
      "youtubeId": "jBNF5sjPSAk",
      "youtubeUrl": "https://www.youtube.com/watch?v=jBNF5sjPSAk",
      "publishedAt": "2026-05-31",
      "duration": "1:05:12",
      "thumbnail": "https://i.ytimg.com/vi/jBNF5sjPSAk/hqdefault.jpg",
      "category": "mass-event",
      "description": "Thánh lễ Chúa Nhật...",
      "views": 1250,
      "speaker": "Cha Chánh xứ"
    }
  ]
}
```

---

## 9. Liên hệ & cấu hình site

### 9.1 Gửi tin nhắn — `POST /api/contact-messages`

**Body (khớp form FE):**

| Field | Type | Bắt buộc |
|-------|------|----------|
| `firstName` | string | ✓ |
| `lastName` | string | ✓ |
| `phone` | string | ✓ |
| `email` | string | ✓ |
| `message` | string | |

```json
{
  "firstName": "Nguyễn",
  "lastName": "Văn An",
  "phone": "0912345678",
  "email": "nguyenvanan@example.com",
  "message": "Xin cầu nguyện cho gia đình..."
}
```

**Response thành công (`201`):**

```json
{
  "data": {
    "id": "msg-20260601-001",
    "createdAt": "2026-06-01T10:30:00+07:00"
  }
}
```

### 9.2 Thông tin liên hệ — `GET /api/site/contact`

Nguồn: `src/lib/contact/site-contact.ts`

```json
{
  "data": {
    "subtitle": "Liên hệ với chúng tôi",
    "title": "Kết nối với Giáo xứ Sa Nam",
    "description": "...",
    "formTitle": "Gửi lời nhắn hoặc yêu cầu cầu nguyện",
    "mapSubtitle": "Vị trí giáo xứ",
    "mapTitle": "Tìm đường đến Giáo xứ Sa Nam",
    "mapDescription": "...",
    "mapUrl": "https://www.google.com/maps/place/...",
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=...",
    "items": [
      {
        "id": "email",
        "title": "Email",
        "value": "lienhe@sanam.org",
        "href": "mailto:lienhe@sanam.org",
        "iconSrc": "/images/icon-mail-white.svg"
      }
    ]
  }
}
```

### 9.3 Quyên góp — `GET /api/site/donations`

Nguồn: `src/lib/contact/site-donations.ts`

Một website chỉ có **2 Destination** (nơi nhận quyên góp):
- `giao-xu` — Giáo xứ Sa Nam
- `ban-truyen-thong` — Ban Truyền Thông

Mỗi Destination có thể có **nhiều Bank Account**. Website chỉ hiển thị thông tin chuyển khoản, không xử lý thanh toán.

Khi nhúng trong `ContactSettings` (admin/public contact API), field tương ứng là `donationDestinations`.

```json
{
  "data": {
    "subtitle": "Quyên góp",
    "title": "Đồng hành cùng Giáo xứ Sa Nam",
    "description": "...",
    "destinations": [
      {
        "id": "giao-xu",
        "tabLabel": "Giáo xứ",
        "headline": "Ủng hộ Giáo xứ Sa Nam",
        "subtitle": "Giáo xứ Sa Nam — Giáo phận Bùi Chu",
        "description": "...",
        "status": "updating",
        "accounts": [],
        "contact": {
          "phone": "(028) 1234 5678",
          "email": "lienhe@sanam.org"
        }
      },
      {
        "id": "ban-truyen-thong",
        "tabLabel": "Ban Truyền Thông",
        "headline": "Ủng hộ phát triển website",
        "description": "...",
        "status": "available",
        "accounts": [
          {
            "id": "acc-tcb-001",
            "bankBrand": "techcombank",
            "bankDisplayName": "Techcombank",
            "accountNumber": "1234567890",
            "accountHolder": "NGUYEN VAN A",
            "transferContent": "UNG HO PHAT TRIEN WEB GIAO XU SA NAM",
            "isDefault": true,
            "cardImageSrc": "https://cdn.example.com/donation/card.png",
            "qrImageSrc": "https://cdn.example.com/donation/qr.jpg"
          },
          {
            "id": "acc-mb-002",
            "bankBrand": "mb",
            "bankDisplayName": "MB Bank",
            "accountNumber": "9876543210",
            "accountHolder": "NGUYEN VAN A",
            "transferContent": "UNG HO BAN TRUYEN THONG",
            "isDefault": false,
            "qrImageSrc": "https://cdn.example.com/donation/qr-mb.jpg"
          }
        ]
      }
    ]
  }
}
```

| Field | Ghi chú |
|-------|---------|
| `destinations` | Tối đa **2** Destination: `giao-xu`, `ban-truyen-thong` |
| `destinations[].id` | Chỉ nhận `"giao-xu"` \| `"ban-truyen-thong"` |
| `destinations[].accounts` | Mảng tài khoản ngân hàng (1 Destination → N accounts) |
| `accounts[].id` | ID ổn định của tài khoản |
| `accounts[].isDefault` | Tài khoản hiển thị mặc định khi Destination có nhiều tài khoản |
| `status` | `"available"` \| `"updating"` |

**Backward compatibility (FE):** nếu backend vẫn trả `donationOptions` / `account` (số ít), FE normalize thành `donationDestinations` / `accounts: [account]`.

---

## 10. Tích hợp phía Frontend (tham khảo)

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.sanam.org
```

```typescript
// Ví dụ sau khi BE có API
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news?featured=true&limit=3`, {
  headers: { Accept: "application/json" },
  next: { revalidate: 60 },
});
const { data } = await res.json();
```

Thay các hàm trong `mock-*.ts` bằng client gọi API; giữ nguyên TypeScript types trong `src/lib/**/types.ts`.

---

## 11. Admin API (gợi ý — ngoài phạm vi website public)

| Resource | CRUD |
|----------|------|
| News, Events, Clergy, Organizations, Members, Videos, Live | POST, PATCH, DELETE |
| Upload ảnh | `POST /api/admin/uploads` → trả URL |
| Auth | JWT / session cookie; role `editor`, `admin` |

---

## 12. Changelog tài liệu

| Ngày | Ghi chú |
|------|---------|
| 2026-06-01 | Tạo bản đầu từ types + mock + `TINH-NANG-WEB.md` |

---

**Liên hệ kỹ thuật:** gửi kèm link repo + file này cho BE. Mẫu JSON đầy đủ nằm trong các file `mock-*.ts` tương ứng từng module.
