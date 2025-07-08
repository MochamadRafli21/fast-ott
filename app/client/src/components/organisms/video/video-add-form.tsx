"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVideoSchema, CreateVideoInput } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UPLOAD_VIDEO_URL, UPLOAD_THUMBNAIL_URL } from "@/constants/api/upload";
import { VIDEO_URL } from "@/constants/api/video";
import { useAuth } from "@/providers/auth-provider";

export default function AddVideoForm() {
  const { token } = useAuth();

  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
  });

  const uploadToCloudinary = async (
    file: File,
    endpoint: string,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
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
        field === "thumbnail" ? UPLOAD_THUMBNAIL_URL : UPLOAD_VIDEO_URL;
      const secure_url = await uploadToCloudinary(file, endpoint);
      form.setValue(field, secure_url, { shouldValidate: true });
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CreateVideoInput) => {
    try {
      const res = await fetch(VIDEO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Submit failed");
      }

      router.push("/admin");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div>
        <label htmlFor="title">Title</label>
        <Input
          {...form.register("title")}
          id="title"
          placeholder="Video title"
        />
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
        <label htmlFor="thumbnail">Thumbnail</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "thumbnail")}
        />
        {form.watch("thumbnail") && (
          <img
            src={form.watch("thumbnail")}
            alt="Thumbnail Preview"
            className="mt-2 w-48 rounded-lg"
          />
        )}
        {form.formState.errors.thumbnail && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.thumbnail.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="video">Video File</label>
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
        {form.formState.errors.url && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.url.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={uploading || !form.formState.isValid}>
        {uploading ? "Uploading..." : "Submit Video"}
      </Button>
    </form>
  );
}
