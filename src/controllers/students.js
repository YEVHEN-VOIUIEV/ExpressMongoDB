// src/controllers/students.js

import createHttpError from 'http-errors';

import { getAllStudents, getStudentById, createStudent } from '../services/students.js';

export const getStudentsController = async (req, res) => {
    const students = await getAllStudents();

    res.json({
        status: 200,
        message: 'Successfully found students!',
        data: students,
    });
};

export const getStudentByIdController = async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
        throw createHttpError(404, 'Student not found');
    }

    res.json({
        status: 200,
        message: `Successfully found student with id ${studentId}!`,
        data: student,
    });
};

export const createStudentController = async (req, res) => {
    const student = await createStudent(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a student!`,
        data: student,
    });
};
