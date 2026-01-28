import { Router } from 'express';
//import multer from 'multer';
import { createEmployeeMaster, postEmployeeMaster } from '../controllers/employee.controller';

export function employeeRoutes() {
  const router = Router();

  //const upload = multer({ storage: multer.memoryStorage() });

  router.post(
    'employeeMaster/postData',
    //upload.any(),
    createEmployeeMaster,
  );
  router.post(
    '/employeeMaster/postData/:employeeId',
    // upload.any(), // legacy-compatible
    postEmployeeMaster,
  );

  return router;
}
