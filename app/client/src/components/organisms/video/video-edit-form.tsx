"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createVideoSchema, CreateVideoInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { VIDEO_URL } from "@/constants/api/video";

export default function EditVideoForm() {
  const { token } = useAuth();

  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
  });

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`${VIDEO_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const video = await res.json();
        form.reset(video); // set initial values
      } catch (err) {
        console.error(err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  const uploadToCloudinary = async (
    file: File,
    type: "thumbnail" | "url",
    endpoint: string,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append(type === "thumbnail" ? "thumbnail" : "video", file);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "url",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const endpoint =
        field === "thumbnail" ? "/api/upload/thumbnail" : "/api/upload/video";
      const secure_url = await uploadToCloudinary(file, field, endpoint);
      form.setValue(field, secure_url, { shouldValidate: true });
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CreateVideoInput) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to update video");
      }

      router.push("/admin");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input {...form.register("title")} id="title" />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="descriptions">Descriptions</label>
        <textarea
          className="px-4 py-2"
          {...form.register("descriptions")}
          id="descriptions"
          placeholder="Video descriptions"
        />
        {form.formState.errors.descriptions && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.descriptions.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          className="mt-1 px-4 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          {...form.register("status")}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISH">Publish</option>
        </select>
        {form.formState.errors.status && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.status.message}
          </p>
        )}
      </div>

      <div>
        <Label>Thumbnail</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "thumbnail")}
        />
        {form.watch("thumbnail") && (
          <img
            src={form.watch("thumbnail")}
            alt="Thumbnail"
            className="mt-2 w-48 rounded-lg"
          />
        )}
      </div>

      <div>
        <Label>Video</Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileUpload(e, "url")}
        />
        {form.watch("url") && (
          <video
            src={form.watch("url")}
            controls
            className="mt-2 w-full rounded-lg"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={uploading}>
        {uploading ? "Updating..." : "Update Video"}
      </Button>
    </form>
  );
}
