import type { NewsArticle } from "@/lib/news/types";

export const mockNewsArticles: NewsArticle[] = [
  {
    id: "news-001",
    slug: "thanh-le-khai-mac-nam-thanh-giao-xu-2026",
    title: "Thánh lễ Khai mạc Năm Thánh Giáo xứ Thánh Giuse 2026",
    excerpt:
      "Vào lúc 8h00 sáng Chúa Nhật ngày 24/5/2026, Giáo xứ Thánh Giuse long trọng cử hành Thánh lễ Khai mạc Năm Thánh kỷ niệm 100 năm thành lập giáo xứ. Đức Cha Giuse Nguyễn Văn Hưng sẽ chủ tế và ban phép lành toàn xá cho toàn thể cộng đoàn. Mọi giáo dân được mời gọi tham dự đông đủ, mặc trang phục chỉnh tề. Ban tổ chức bố trí ghế ngồi từ 7h30, kính mời quý vị đến sớm để ổn định chỗ ngồi.",
    contentFormat: "html",
    content: `
      <p>Giáo xứ trân trọng kính mời cộng đoàn tham dự Thánh lễ Khai mạc Năm Thánh kỷ niệm 100 năm thành lập giáo xứ.</p>
      <blockquote>
        <p>“Hãy tạ ơn Chúa vì muôn ngàn đời Chúa vẫn trọn tình thương.”</p>
      </blockquote>
      <h2>Thời gian & địa điểm</h2>
      <ul>
        <li><strong>Thời gian</strong>: 8h00, Chúa Nhật 24/5/2026 (đón tiếp từ 7h30).</li>
        <li><strong>Địa điểm</strong>: Nhà thờ Giáo xứ Thánh Giuse.</li>
      </ul>
      <h2>Lưu ý tham dự</h2>
      <ol>
        <li>Trang phục chỉnh tề, giữ trật tự trong khuôn viên thánh đường.</li>
        <li>Vui lòng đến sớm để ổn định chỗ ngồi.</li>
        <li>Ban tổ chức có hướng dẫn chỗ đậu xe theo khu vực.</li>
      </ol>
      <p>Xin cộng đoàn hiệp lời cầu nguyện để Năm Thánh trở thành dịp canh tân đời sống đức tin và tình hiệp nhất trong giáo xứ.</p>
    `,
    categoryId: "le-kinh",
    publishedAt: "2026-05-20T08:00:00+07:00",
    isFeatured: true,
    isVisible: true,
  },
  {
    id: "news-002",
    slug: "thu-moi-dai-hoi-giao-ly-vien-giao-phan-2026",
    title: "Thư mời tham dự Đại hội Giáo lý viên Giáo phận năm 2026",
    excerpt:
      "Kính gửi quý Giáo lý viên trong toàn Giáo phận. Ban Giáo lý Giáo phận trân trọng kính mời quý thầy cô tham dự Đại hội Giáo lý viên thường niên năm 2026, tổ chức vào ngày 07/6/2026 tại Trung tâm Mục vụ Giáo phận. Chủ đề năm nay: 'Giáo lý viên — Chứng nhân của niềm vui Tin Mừng'. Chương trình bao gồm Thánh lễ khai mạc, các chuyên đề huấn luyện, chia sẻ kinh nghiệm và giao lưu văn nghệ. Hạn đăng ký trước ngày 30/5/2026 qua văn phòng giáo xứ.",
    contentFormat: "html",
    content: `
      <p><strong>Kính gửi</strong>: Quý Giáo lý viên trong toàn Giáo phận.</p>
      <p>Ban Giáo lý trân trọng kính mời quý thầy cô tham dự Đại hội Giáo lý viên thường niên năm 2026.</p>
      <h2>Chủ đề</h2>
      <p>“Giáo lý viên — Chứng nhân của niềm vui Tin Mừng”.</p>
      <h2>Chương trình (dự kiến)</h2>
      <ul>
        <li>Thánh lễ khai mạc</li>
        <li>Chuyên đề huấn luyện</li>
        <li>Chia sẻ kinh nghiệm – giao lưu</li>
      </ul>
      <p><strong>Hạn đăng ký</strong>: trước ngày 30/5/2026 (qua văn phòng giáo xứ).</p>
      <p>Trân trọng kính mời.</p>
    `,
    categoryId: "su-kien",
    publishedAt: "2026-05-18T09:00:00+07:00",
    isFeatured: true,
    isVisible: true,
  },
  {
    id: "news-003",
    slug: "thong-bao-lich-xung-toi-mua-he-2026",
    title: "Thông báo lịch xưng tội Mùa Hè và chuẩn bị Lễ Hiện Xuống 2026",
    excerpt:
      "Để giáo dân chuẩn bị tâm hồn đón mừng Lễ Hiện Xuống (ngày 31/5/2026), Cha Chánh xứ thông báo lịch xưng tội đặc biệt như sau: Thứ Tư và Thứ Năm (27–28/5), từ 17h30 đến 19h30 tại nhà thờ chính. Quý cha giải tội sẽ có mặt tại các toà giải tội và sẵn sàng gặp gỡ cá nhân theo yêu cầu. Cha mời gọi mọi gia đình cùng tham dự, đặc biệt là các em thiếu nhi đã Rước lễ lần đầu.",
    contentFormat: "html",
    content: `
      <p>Để chuẩn bị tâm hồn đón mừng Lễ Hiện Xuống, Cha Chánh xứ thông báo lịch xưng tội đặc biệt như sau:</p>
      <ul>
        <li><strong>Thứ Tư – Thứ Năm (27–28/5)</strong>: 17h30 – 19h30</li>
        <li><strong>Địa điểm</strong>: Nhà thờ chính</li>
      </ul>
      <p>Quý cha giải tội sẽ có mặt tại các tòa giải tội và sẵn sàng gặp gỡ cá nhân theo nhu cầu.</p>
      <p>Xin cộng đoàn sắp xếp thời gian tham dự và hiệp ý cầu nguyện.</p>
    `,
    categoryId: "thong-bao",
    publishedAt: "2026-05-17T07:30:00+07:00",
    isFeatured: true,
    isVisible: true,
  },

  // ─── TIN THƯỜNG ────────────────────────────────────────────
  {
    id: "news-004",
    slug: "hoat-dong-tham-vien-duong-lao-thang-5-2026",
    title: "Giáo xứ thăm và tặng quà các cụ tại Viện dưỡng lão tháng 5",
    excerpt:
      "Sáng ngày 16/5/2026, đoàn thiện nguyện Giáo xứ Thánh Giuse gồm 35 thành viên đã đến thăm và tặng quà cho 80 cụ cao niên tại Viện dưỡng lão Bình An. Đoàn mang theo 80 phần quà gồm nhu yếu phẩm, bánh kẹo và hoa tươi, đồng thời tổ chức buổi văn nghệ nhỏ với các bài thánh ca quen thuộc. Cha Phó xứ Giuse Trần Minh Tuấn đã dâng lễ ngay tại sảnh lớn của viện dưỡng lão, mang lại niềm vui tinh thần cho các cụ và nhân viên chăm sóc.",
    contentFormat: "plain",
    content:
      "Sáng ngày 16/5/2026, đoàn thiện nguyện Giáo xứ Thánh Giuse gồm 35 thành viên đã đến thăm và tặng quà cho 80 cụ cao niên tại Viện dưỡng lão Bình An.\n\nChương trình gồm:\n- Gặp gỡ, thăm hỏi\n- Trao 80 phần quà\n- Văn nghệ với các bài thánh ca\n\nXin cộng đoàn tiếp tục hiệp lời cầu nguyện cho các cụ và cho những hoạt động bác ái của giáo xứ.",
    categoryId: "hoat-dong",
    publishedAt: "2026-05-16T15:00:00+07:00",
    isFeatured: false,
    isVisible: true,
  },
  {
    id: "news-005",
    slug: "ruoc-le-lan-dau-khoa-2026",
    title: "Thánh lễ Rước lễ lần đầu — Khóa 2026",
    excerpt:
      "Vào Chúa Nhật ngày 10/5/2026, 42 em thiếu nhi lớp Chiên Con đã long trọng Rước lễ lần đầu trong Thánh lễ 8h00 tại nhà thờ chính xứ. Các em được chuẩn bị kỹ lưỡng qua một năm học giáo lý với sự hướng dẫn tận tâm của quý thầy cô giáo lý viên. Cha Chánh xứ gửi lời chúc mừng đến từng gia đình và nhắn nhủ: đây là khởi đầu của một hành trình đức tin suốt đời, không phải điểm kết thúc.",
    contentFormat: "plain",
    content:
      "Thánh lễ Rước lễ lần đầu — Khóa 2026\n\n- Thời gian: 8h00, Chúa Nhật 10/5/2026\n- Địa điểm: Nhà thờ chính xứ\n\nXin chúc mừng các em và gia đình. Xin cộng đoàn hiệp lời cầu nguyện để các em luôn gắn bó với Thánh Thể và lớn lên trong đời sống đức tin.",
    categoryId: "le-kinh",
    publishedAt: "2026-05-10T12:00:00+07:00",
    isFeatured: false,
    isVisible: true,
  },
  {
    id: "news-006",
    slug: "bai-viet-loi-ich-kinh-man-coi-gia-dinh",
    title: "Kinh Mân Côi trong gia đình — Sợi dây nối kết yêu thương",
    excerpt:
      "Tháng 5 là tháng Hoa kính Đức Mẹ, cũng là dịp để các gia đình nhìn lại thói quen đọc Kinh Mân Côi chung trong nhà. Nhiều gia đình trong giáo xứ chia sẻ rằng chỉ cần 15 phút mỗi tối quây quần bên tràng hạt đã giúp con cái bình tĩnh hơn, cha mẹ bớt căng thẳng hơn và gia đình gắn kết nhau hơn. Bài viết tổng hợp những chứng từ sống động cùng gợi ý thực hành đơn giản để bất kỳ gia đình nào cũng có thể bắt đầu ngay hôm nay.",
    contentFormat: "html",
    content: `
      <p>Tháng Hoa kính Đức Mẹ là thời điểm đẹp để nhiều gia đình nhìn lại đời sống cầu nguyện chung.</p>
      <h2>Vì sao Kinh Mân Côi giúp gia đình gắn kết?</h2>
      <ul>
        <li>Tạo “nhịp” bình an mỗi ngày, giúp mọi người lắng lại.</li>
        <li>Con cái học được thói quen cầu nguyện và biết lắng nghe.</li>
        <li>Cha mẹ có cơ hội cùng nhau nâng đỡ, tha thứ và bắt đầu lại.</li>
      </ul>
      <h2>Gợi ý thực hành</h2>
      <ol>
        <li>Chọn một khung giờ cố định (10–15 phút).</li>
        <li>Bắt đầu từ 1 chục kinh, rồi tăng dần.</li>
        <li>Luân phiên người hướng dẫn, mỗi người dâng 1 ý cầu nguyện.</li>
      </ol>
      <p>Nếu gia đình bạn chưa bắt đầu, hãy bắt đầu thật nhỏ — và kiên trì mỗi ngày.</p>
    `,
    categoryId: "bai-viet",
    publishedAt: "2026-05-06T08:00:00+07:00",
    isFeatured: false,
    isVisible: true,
  },
  {
    id: "news-007",
    slug: "thong-bao-sua-chua-nha-tho-thang-6-2026",
    title: "Thông báo tạm dừng một số Thánh lễ do sửa chữa mái nhà thờ",
    excerpt:
      "Hội đồng mục vụ giáo xứ thông báo: Từ ngày 01 đến 14/6/2026, nhà thờ chính sẽ tiến hành sửa chữa mái và hệ thống chống thấm. Trong thời gian này, Thánh lễ sáng các ngày thường (5h30) tạm chuyển sang nhà nguyện phụ. Thánh lễ Chúa Nhật vẫn tổ chức bình thường tại sân ngoài nếu thời tiết cho phép. Kính mong cộng đoàn thông cảm và cầu nguyện cho công trình sớm hoàn thành.",
    contentFormat: "plain",
    content:
      "Hội đồng mục vụ giáo xứ thông báo:\n\nTừ ngày 01 đến 14/6/2026, nhà thờ chính sẽ tiến hành sửa chữa mái và hệ thống chống thấm.\n\n- Thánh lễ sáng ngày thường (5h30): tạm chuyển sang nhà nguyện phụ.\n- Thánh lễ Chúa Nhật: vẫn tổ chức bình thường (nếu thời tiết cho phép có thể dâng lễ ngoài sân).\n\nKính mong cộng đoàn thông cảm và cầu nguyện cho công trình sớm hoàn thành.",
    categoryId: "thong-bao",
    publishedAt: "2026-05-04T08:00:00+07:00",
    isFeatured: false,
    isVisible: true,
  },
  {
    id: "news-008",
    slug: "cao-pho-ba-maria-nguyen-thi-lan",
    title: "Cáo phó: Bà cố Maria Nguyễn Thị Lan",
    excerpt:
      "Trong niềm tin vào Chúa Kitô Phục Sinh, Gia đình và Ban Tang lễ Giáo xứ kính báo: Bà cố Maria Nguyễn Thị Lan, sinh năm 1938, đã được Chúa gọi về lúc 3h15 sáng ngày 19/5/2026 tại nhà riêng, hưởng thọ 88 tuổi. Thánh lễ An táng sẽ được cử hành vào lúc 7h00 sáng Thứ Sáu ngày 22/5/2026 tại nhà thờ Giáo xứ Thánh Giuse. Linh cữu quản tại tư gia: 47 Ngõ 12, đường Trần Hưng Đạo. Gia đình thành kính cáo phó và kính xin cộng đoàn hiệp lời cầu nguyện.",
    contentFormat: "plain",
    content:
      "Trong niềm tin vào Chúa Kitô Phục Sinh, Gia đình và Ban Tang lễ Giáo xứ kính báo:\n\nBà cố Maria Nguyễn Thị Lan (sinh năm 1938) đã được Chúa gọi về lúc 3h15 sáng ngày 19/5/2026, hưởng thọ 88 tuổi.\n\n- Thánh lễ An táng: 7h00, Thứ Sáu 22/5/2026\n- Nơi cử hành: Nhà thờ Giáo xứ Thánh Giuse\n- Linh cữu quàn tại: 47 Ngõ 12, đường Trần Hưng Đạo\n\nGia đình thành kính cáo phó và kính xin cộng đoàn hiệp lời cầu nguyện.",
    categoryId: "cao-pho",
    publishedAt: "2026-05-19T06:00:00+07:00",
    isFeatured: false,
    isVisible: true,
  },
];

export function getVisibleNews(): NewsArticle[] {
  return mockNewsArticles
    .filter((article) => article.isVisible)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getFeaturedNews(limit = 3): NewsArticle[] {
  return getVisibleNews()
    .filter((article) => article.isFeatured)
    .slice(0, limit);
}

export function getNewsById(id: string): NewsArticle | undefined {
  return mockNewsArticles.find((article) => article.id === id);
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return mockNewsArticles.find((article) => article.slug === slug);
}
