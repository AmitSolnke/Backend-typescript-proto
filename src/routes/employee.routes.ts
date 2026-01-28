import { Router } from 'express';
import multer from 'multer';
import {
  createEmployeeMaster,
  postEmployeeMaster,
  getEmployee,
  getAllEmployees,
} from '../controllers/employee.controller';
import { authMiddleware } from 'middlewares/auth.middleware';

export function employeeRoutes() {
  const router = Router();

  const upload = multer({ storage: multer.memoryStorage() });

  //const upload = multer({ storage: multer.memoryStorage() });

  router.get('/getData', authMiddleware, upload.any(), getAllEmployees);
  router.get('/getData/:employeeId', authMiddleware, upload.any(), getEmployee);
  router.post('/postData', upload.any(), authMiddleware, createEmployeeMaster);
  router.post('/postData/:employeeId', authMiddleware, upload.any(), postEmployeeMaster);

  return router;
}
