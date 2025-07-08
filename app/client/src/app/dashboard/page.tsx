"use client";

import { VideoGrid } from "@/components/organisms/video/video-grid";
import { Header } from "@/components/molecules/header";
import { useQuery } from "@tanstack/react-query";
import { VIDEO_URL } from "@/constants/api/video";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { token } = useAuth();
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch(VIDEO_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  return (
    <>
      <Header />
      <div className="container py-10">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </div>
    </>
  );
}
