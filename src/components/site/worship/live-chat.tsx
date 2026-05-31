"use client";

import React from "react";
import { MessageSquare, ShieldAlert } from "lucide-react";

interface LiveChatProps {
  youtubeId: string;
  isLive: boolean;
}

export function LiveChat({ youtubeId, isLive }: LiveChatProps) {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

  if (!isLive) return null;

  return (
    <div className="flex flex-col h-full bg-primary border border-white/10 rounded-xl overflow-hidden shadow-xl">
      <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <div className="size-2 rounded-full bg-accent animate-pulse" />
        <MessageSquare className="size-4 text-white/80" />
        <span className="font-display text-sm font-semibold tracking-wider text-white uppercase">
          Trò chuyện trực tiếp
        </span>
      </div>

      <div className="flex-1 min-h-[300px] bg-black/25">
        {youtubeId ? (
          <iframe
            title="YouTube Live Chat"
            src={`https://www.youtube.com/live_chat?v=${youtubeId}&embed_domain=${hostname}`}
            className="w-full h-full min-h-[300px] border-0"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
            <ShieldAlert className="size-10 text-white/30 mb-3" />
            <p className="text-sm font-medium">Chưa có Stream ID hợp lệ</p>
            <p className="text-xs text-white/40 mt-1 max-w-[200px]">
              Stream ID chưa được cấu hình cho buổi phát trực tiếp này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
