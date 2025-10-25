import { 
    getAllStudents, 
    getStudentById, 
    createStudent, 
    deleteStudent, 
    updateStudent,
} from '../services/students.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const getStudentsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const successStatus = 200;

    const students = await getAllStudents({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });

    return res.status(successStatus).json({
      status: successStatus,
      message: 'Successfully found students!',
      data: students,
    });
};

export const getStudentByIdController = async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);
    const successStatus = 200;
    const errorStatus = 404;

    if (!student) {
        return res.status(errorStatus).json({
            status: errorStatus,
            message: `Student with id ${studentId} not found`,
            data: null,
        });
    }

    return res.status(successStatus).json({
        status: successStatus,
        message: `Successfully found student with id ${studentId}!`,
        data: student,
    });
};

export const createStudentController = async (req, res) => {
    const student = await createStudent(req.body);
    const successStatus = 201;

    return res.status(successStatus).json({
        status: successStatus,
        message: `Successfully created a student!`,
        data: student,
    });
};

export const deleteStudentController = async (req, res) => {
    const { studentId } = req.params;
    const deleted = await deleteStudent(studentId);
    const successStatus = 204;
    const errorStatus = 404;

    if (!deleted) {
        return res.status(errorStatus).json({
            status: errorStatus,
            message: `Student with id ${studentId} not found`,
            data: null,
        });
    }

    return res.sendStatus(successStatus);
};

export const upsertStudentController = async (req, res) => {
    const { studentId } = req.params;

    const result = await updateStudent(studentId, req.body, {
        upsert: true,
    });

    const errorStatus = 404;

    if (!result) {
        return res.status(errorStatus).json({
            status: errorStatus,
            message: `Student with id ${studentId} not found`,
            data: null,
        });
    }

    const successStatus = result.isNew ? 201 : 200;

    return res.status(successStatus).json({
        status: successStatus,
        message: `Successfully upserted a student!`,
        data: result.student,
    });
};

export const patchStudentController = async (req, res) => {
    const { studentId } = req.params;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const updated = await updateStudent(studentId, {
        ...req.body,
        photo: photoUrl,
    });

    const successStatus = 200;
    const errorStatus = 404;

    if (!updated) {
        return res.status(errorStatus).json({
            status: errorStatus,
            message: `Student with id ${studentId} not found`,
            data: null,
        });
    }

    return res.status(successStatus).json({
        status: successStatus,
        message: `Successfully patched a student!`,
        data: updated,
    });
};
