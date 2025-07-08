"use client";

import {
  AdminVideo,
  AdminVideoTable,
} from "@/components/organisms/video/video-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VIDEO_URL } from "@/constants/api/video";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function AdminVideoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery<AdminVideo[]>({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const res = await fetch(VIDEO_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load videos");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${VIDEO_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete video");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: () => console.error("Failed to find video"),
  });

  const handleEdit = (id: string) => {
    router.push(`/admin/videos/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container py-10">
      <Card className="w-full max-w-[90vw] min-h-screen mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <div className="w-full flex items-center justify-between">
            <CardTitle className="text-2xl text-start">Manage Videos</CardTitle>
            <Link href="/admin/new">
              <Button>Add Video</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <AdminVideoTable
              videos={videos}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
