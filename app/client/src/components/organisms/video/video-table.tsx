import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type AdminVideo = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISH";
  createdAt: string;
};

type Props = {
  videos: AdminVideo[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function AdminVideoTable({ videos, onEdit, onDelete }: Props) {
  return (
    <div className="border max-w-[90vw] mx-auto rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-6"
              >
                No videos found.
              </TableCell>
            </TableRow>
          ) : (
            videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {video.title}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      video.status === "PUBLISH" ? "default" : "secondary"
                    }
                  >
                    {video.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(video.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(video.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(video.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
