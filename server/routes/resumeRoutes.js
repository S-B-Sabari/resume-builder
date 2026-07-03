import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, restoreResume, permanentlyDeleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume); // Now a soft delete
resumeRouter.put('/restore/:resumeId', protect, restoreResume);
resumeRouter.delete('/permanent-delete/:resumeId', protect, permanentlyDeleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;
