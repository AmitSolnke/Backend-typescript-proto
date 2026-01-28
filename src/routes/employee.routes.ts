import { Router } from 'express';
import multer from 'multer';
import { createEmployeeMaster, postEmployeeMaster } from '../controllers/employee.controller';

export function employeeRoutes() {
  const router = Router();

  const upload = multer({ storage: multer.memoryStorage() });

  //const upload = multer({ storage: multer.memoryStorage() });

  router.post('/postData', upload.any(), createEmployeeMaster);
  router.post('/postData/:employeeId', upload.any(), postEmployeeMaster);

  return router;
}
