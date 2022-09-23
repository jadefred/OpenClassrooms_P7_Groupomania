import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { DestinationCallback, FileNameCallback } from '../config/interface';

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void {
    cb(null, './src/image');
    //image
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

export const multerExport = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('image');
