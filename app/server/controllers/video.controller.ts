import type { Request, Response } from "express";
import {
  createVideoSchema,
  updateVideoSchema,
  type CreateVideoInput,
} from "@ott/types";
import { PrismaClient } from "@prisma/client";
import { getRoles } from "@/lib/auth";
import { Role, VIDEO_STATUS } from "@prisma/client";

const prisma = new PrismaClient();

export async function createVideo(req: Request, res: Response) {
  const parse = createVideoSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }

  const data: CreateVideoInput = parse.data;

  const video = await prisma.video.create({
    data,
  });

  res.status(200).json(video);
}

export async function updateVideo(req: Request, res: Response) {
  const parse = updateVideoSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }

  const video = await prisma.video.update({
    where: { id: req.params.id },
    data: parse.data,
  });

  res.json(video);
}

export async function listVideos(req: Request, res: Response) {
  const userRole = getRoles(req);

  const videos = await prisma.video.findMany({
    where: {
      ...(userRole === Role.USER ? { status: VIDEO_STATUS.PUBLISH } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(videos);
}

export async function getVideo(req: Request, res: Response) {
  const userRole = getRoles(req);

  const video = await prisma.video.findUnique({
    where: {
      id: req.params.id,
      ...(userRole === Role.USER ? { status: VIDEO_STATUS.PUBLISH } : {}),
    },
  });

  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  res.json(video);
}

export async function deleteVideo(req: Request, res: Response) {
  const video = await prisma.video.delete({ where: { id: req.params.id } });
  res.json({ success: true, video });
}
