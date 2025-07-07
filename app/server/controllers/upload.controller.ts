import type { Request, Response } from "express";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/lib/cloudinary";

export async function uploadThumbnail(req: Request, res: Response) {
  const file = req.files?.thumbnail?.[0];
  if (!file) {
    res.status(400).json({ error: "Thumbnail file required" });
    return;
  }

  const result = await uploadImageToCloudinary(file.buffer, "thumbnails");
  res.json({ url: result.secure_url });
}

export async function uploadVideoFile(req: Request, res: Response) {
  const file = req.files?.video?.[0];
  if (!file) {
    res.status(400).json({ error: "Video file required" });
    return;
  }

  const result = await uploadVideoToCloudinary(file.buffer, "videos");
  res.json({ url: result.secure_url });
}
