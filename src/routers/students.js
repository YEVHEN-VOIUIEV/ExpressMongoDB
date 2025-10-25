// src/routers/students.js

import { Router } from 'express';
import {
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createStudentSchema, updateStudentSchema } from '../validation/students.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { upload } from '../middlewares/multer.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get(
  '/', 
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(getStudentsController),
);

router.get(
  '/:studentId', 
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId, 
  ctrlWrapper(getStudentByIdController),
);

router.post(
  '/', 
  checkRoles(ROLES.TEACHER),
  upload.single('photo'),
  validateBody(createStudentSchema), 
  ctrlWrapper(createStudentController),
);

router.delete(
  '/:studentId', 
  checkRoles(ROLES.TEACHER),
  isValidId, 
  ctrlWrapper(deleteStudentController),
);

router.put(
  '/:studentId', 
  checkRoles(ROLES.TEACHER),
  isValidId, 
  upload.single('photo'),
  validateBody(createStudentSchema), 
  ctrlWrapper(upsertStudentController),
);

router.patch(
  '/:studentId', 
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId, 
  upload.single('photo'),
  validateBody(updateStudentSchema), 
  ctrlWrapper(patchStudentController),
);

export default router;
