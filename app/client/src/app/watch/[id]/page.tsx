"use client";

import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { VIDEO_URL } from "@/constants/api/video";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await fetch(`${VIDEO_URL}${id}`);
      if (!res.ok) throw new Error("Video not found");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading || !video) {
    return (
      <div className="container py-10">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2 mt-4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <Card>
        <div className="aspect-video relative rounded-t-md overflow-hidden">
          <ReactPlayer
            src={video.url}
            controls
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
        <CardContent className="p-6">
          <h1 className="text-xl font-bold">{video.title}</h1>
          {video.description && (
            <p className="text-muted-foreground mt-2">{video.description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
