import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type VideoCardProps = {
  id: string;
  title: string;
  thumbnail: string;
};

export function VideoCard({ id, title, thumbnail }: VideoCardProps) {
  return (
    <Link href={`/watch/${id}`}>
      <Card className="hover:shadow-lg transition-shadow">
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
        </CardContent>
      </Card>
    </Link>
  );
}
