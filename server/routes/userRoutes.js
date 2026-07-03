import express from "express"
import { getUserById, getUserResumes, getDeletedResumes, loginUser, registerUser, updateUser } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
userRouter.get('/deleted-resumes', protect, getDeletedResumes);
userRouter.put('/update', upload.single('image'), protect, updateUser);

export default userRouter;