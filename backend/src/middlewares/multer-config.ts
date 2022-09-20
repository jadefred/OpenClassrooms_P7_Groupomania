import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void {
    cb(null, 'image');
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void {
    cb(null, Date.now() + '.' + file.originalname.split(' ').join('_'));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype.includes('jpeg') ||
    file.mimetype.includes('png') ||
    file.mimetype.includes('jpg')
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// module.exports

const multerExport = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('image');

export default multerExport;
