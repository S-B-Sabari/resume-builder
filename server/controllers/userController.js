import User from "../models/User.js"
import Resume from "../models/Resume.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import fs from 'fs'
import imageKit from "../configs/imageKit.js"

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        //check if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        //create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({
            message: 'User created successfully', token,
            user: newUser
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        let user = await User.findOne({ email })

        // Auto-provision or update sample admin credentials on demand
        if (email === 'admin@gmail.com') {
            if (!user) {
                const hashedPassword = await bcrypt.hash('admin123', 10)
                user = await User.create({
                    name: 'Admin User',
                    email: 'admin@gmail.com',
                    password: hashedPassword
                })
            } else if (password === 'admin123') {
                const isPasswordCorrect = user.comparePassword(password)
                if (!isPasswordCorrect) {
                    const hashedPassword = await bcrypt.hash('admin123', 10)
                    user.password = hashedPassword
                    await user.save()
                }
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        //check if password is correct
        if (!user.comparePassword(password)) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        // return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({ message: 'Login successful', token, user })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        //return user
        user.password = undefined;
        return res.status(200).json({ user })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        //return active user resumes
        const resumes = await Resume.find({ userId, is_deleted: { $ne: true } })
        return res.status(200).json({ resumes })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for getting deleted user resumes
// GET: /api/users/deleted-resumes
export const getDeletedResumes = async (req, res) => {
    try {
        const userId = req.userId;

        //return soft-deleted resumes
        const resumes = await Resume.find({ userId, is_deleted: true })
        return res.status(200).json({ resumes })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for updating user profile
// PUT: /api/users/update
export const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;
        const imageFile = req.file;

        // check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        if (imageFile) {
            const imageBufferData = fs.createReadStream(imageFile.path)
            const response = await imageKit.files.upload({
                file: imageBufferData,
                fileName: 'profile_photo.png',
                folder: 'user-profiles',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75'
                }
            });
            user.image = response.url;
        }

        await user.save();
        user.password = undefined;

        return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
