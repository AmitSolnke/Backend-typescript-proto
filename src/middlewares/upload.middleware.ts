import multer from 'multer';
import path from 'path';
import fs from 'fs';

const BASE_UPLOAD_PATH = 'storage/app';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'Others';

    switch (file.fieldname) {
      case 'profile_picture':
        folder = 'Profile';
        break;
      case 'pan_photo':
        folder = 'Pan';
        break;
      case 'aadhar_photo':
        folder = 'Aadhar';
        break;
    }

    const uploadPath = path.join(BASE_UPLOAD_PATH, folder);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const uploadEmployeeFiles = multer({
  storage,
});
