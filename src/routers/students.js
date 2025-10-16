// src/routers/students.js

import { Router } from "express";
import {
  getStudentsController,
  getStudentByIdController,
} from '../controllers/students.js';

const router = Router();

router.get('/students', getStudentsController);
router.get('/students/:studentId', getStudentByIdController);

export default router;
