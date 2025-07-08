"use client";

import { VideoGrid } from "@/components/organisms/video/video-grid";
import { useQuery } from "@tanstack/react-query";
import { VIDEO_URL } from "@/constants/api/video";

export default function DashboardPage() {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch(VIDEO_URL);
      return res.json();
    },
  });

  return (
    <div className="container py-10">
      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
