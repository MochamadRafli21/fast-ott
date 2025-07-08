"use client";

import {
  AdminVideo,
  AdminVideoTable,
} from "@/components/organisms/video/video-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // optional toast

export default function AdminVideoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery<AdminVideo[]>({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const res = await fetch("/api/admin/videos");
      if (!res.ok) throw new Error("Failed to load videos");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete video");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: () => toast.error("Failed to delete video"),
  });

  const handleEdit = (id: string) => {
    router.push(`/admin/videos/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Videos</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <AdminVideoTable
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
