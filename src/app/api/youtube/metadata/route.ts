import { NextRequest, NextResponse } from "next/server";
import { fetchYoutubeMetadata } from "@/lib/videos/youtube-metadata";

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  const metadata = await fetchYoutubeMetadata(videoId);

  if (!metadata) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json(metadata);
}
