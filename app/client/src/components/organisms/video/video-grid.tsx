import { VideoCard, VideoCardProps } from "./video-card";

type VideoGridProps = {
  videos: VideoCardProps[];
};

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="text-muted-foreground text-center mt-8">No videos found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}
