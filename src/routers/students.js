// src/routers/students.js

import { Router } from "express";
import {
  getStudentsController,
  getStudentByIdController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));
router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));

export default router;
