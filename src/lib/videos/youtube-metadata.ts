export interface YoutubeMetadata {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  viewCount?: number;
  publishedAt?: string;
  duration?: string;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function parseYoutubePageDetails(html: string): Partial<YoutubeMetadata> {
  const viewCountMatch = html.match(/"viewCount"\s*:\s*"(\d+)"/);
  const publishDateMatch = html.match(/"publishDate"\s*:\s*"([^"]+)"/);
  const lengthSecondsMatch = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);

  const details: Partial<YoutubeMetadata> = {};

  if (viewCountMatch) {
    details.viewCount = Number.parseInt(viewCountMatch[1], 10);
  }

  if (publishDateMatch) {
    details.publishedAt = publishDateMatch[1].split("T")[0];
  }

  if (lengthSecondsMatch) {
    details.duration = formatDuration(
      Number.parseInt(lengthSecondsMatch[1], 10),
    );
  }

  return details;
}

export async function fetchYoutubeMetadata(
  videoId: string,
): Promise<YoutubeMetadata | null> {
  const id = videoId.trim();
  if (!id) return null;

  try {
    const oembedUrl = new URL("https://www.youtube.com/oembed");
    oembedUrl.searchParams.set("url", `https://www.youtube.com/watch?v=${id}`);
    oembedUrl.searchParams.set("format", "json");

    const [oembedResponse, pageResponse] = await Promise.all([
      fetch(oembedUrl.toString(), { next: { revalidate: 300 } }),
      fetch(`https://www.youtube.com/watch?v=${id}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "vi-VN,vi;q=0.9",
        },
        next: { revalidate: 300 },
      }),
    ]);

    if (!oembedResponse.ok) return null;

    const oembed = (await oembedResponse.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };

    if (!oembed.title) return null;

    let pageDetails: Partial<YoutubeMetadata> = {};
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      pageDetails = parseYoutubePageDetails(html);
    }

    return {
      title: oembed.title,
      authorName: oembed.author_name ?? "",
      thumbnailUrl:
        oembed.thumbnail_url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      viewCount: pageDetails.viewCount,
      publishedAt: pageDetails.publishedAt,
      duration: pageDetails.duration,
    };
  } catch {
    return null;
  }
}
