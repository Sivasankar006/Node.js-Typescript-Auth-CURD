import { Request, Response } from 'express';
import { User } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
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

export const createUser = async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json({ message: "Email is already exists", status: false });
            return;
        }

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({ savedUser, message: "Create user successfully", status: true });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedUser) {
            res.status(200).json({ updatedUser, message: "Update user successfully", status: true });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};
