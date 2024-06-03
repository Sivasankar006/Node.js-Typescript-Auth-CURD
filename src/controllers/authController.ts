import { Request, Response } from 'express';
import { Auth } from '../models/Auth';
const jwt = require('jsonwebtoken');

// User registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const newUser = new Auth({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// User login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate authentication token
        const token = user.generateAuthToken();

        // Return the token in the response
        res.status(200).json({ user, token, message: 'login successfully', status: true });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Admin wise Show user details
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await Auth.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};


export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await Auth.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};