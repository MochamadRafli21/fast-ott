import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type VideoCardProps = {
  id: string;
  title: string;
  descriptions: string;
  thumbnail: string;
};

export function VideoCard({
  id,
  title,
  descriptions,
  thumbnail,
}: VideoCardProps) {
  return (
    <Link href={`/dashboard/watch/${id}`}>
      <Card className="hover:shadow-lg transition-shadow gap-1 py-0">
        <div className="relative w-full aspect-video">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover rounded-t-md"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{descriptions}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
