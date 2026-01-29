interface UploadedFilePaths {
  profile_picture?: string;
  pan_photo?: string;
  aadhar_photo?: string;
}
export type MulterFieldFiles = {
  [fieldname: string]: Express.Multer.File[];
};

export function extractEmployeeFilePaths(files?: MulterFieldFiles): UploadedFilePaths {
  const paths: UploadedFilePaths = {};

  if (!files) {
    return paths;
  }

  if (files.profile_picture?.[0]) {
    paths.profile_picture = files.profile_picture[0].path;
  }

  if (files.pan_photo?.[0]) {
    paths.pan_photo = files.pan_photo[0].path;
  }

  if (files.aadhar_photo?.[0]) {
    paths.aadhar_photo = files.aadhar_photo[0].path;
  }

  return paths;
}
