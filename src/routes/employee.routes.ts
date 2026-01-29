import { Router } from 'express';
import multer from 'multer';
import {
  createEmployeeMaster,
  postEmployeeMaster,
  getEmployee,
  getAllEmployees,
} from '../controllers/employee.controller';
import { uploadEmployeeFiles } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

export function employeeRoutes() {
  const router = Router();

  const upload = multer({ storage: multer.memoryStorage() });

  //const upload = multer({ storage: multer.memoryStorage() });

  router.get('/getData', authMiddleware, getAllEmployees);
  router.get('/getData/:employeeId', authMiddleware, getEmployee);
  router.post(
    '/postData',
    authMiddleware,
    uploadEmployeeFiles.fields([
      { name: 'profile_picture', maxCount: 1 },
      { name: 'pan_photo', maxCount: 1 },
      { name: 'aadhar_photo', maxCount: 1 },
    ]),
    createEmployeeMaster,
  );
  router.post(
    '/postData/:employeeId',
    authMiddleware,
    uploadEmployeeFiles.fields([
      { name: 'profile_picture', maxCount: 1 },
      { name: 'pan_photo', maxCount: 1 },
      { name: 'aadhar_photo', maxCount: 1 },
    ]),
    postEmployeeMaster,
  );

  return router;
}
