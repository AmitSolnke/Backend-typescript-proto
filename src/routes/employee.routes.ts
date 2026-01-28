import { Router } from 'express';
import multer from 'multer';
import {
  createEmployeeMaster,
  postEmployeeMaster,
  getEmployee,
} from '../controllers/employee.controller';

export function employeeRoutes() {
  const router = Router();

  const upload = multer({ storage: multer.memoryStorage() });

  //const upload = multer({ storage: multer.memoryStorage() });

  router.get('/getData/:employeeId', upload.any(), getEmployee);
  router.post('/postData', upload.any(), createEmployeeMaster);
  router.post('/postData/:employeeId', upload.any(), postEmployeeMaster);

  return router;
}
