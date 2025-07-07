declare namespace Express {
  export interface Request {
    user?: TokenPayload;
    files?: {
      video?: Multer.File[];
      thumbnail?: Multer.File[];
    };
  }
}
