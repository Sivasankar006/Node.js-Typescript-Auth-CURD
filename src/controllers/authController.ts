import { Request, Response } from 'express';
import { Auth, hashPassword, verifyToken } from '../models/Auth';


interface AuthRequest extends Request {
    user?: any;
    token?: string;
    _id?: any;
}

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
        res.status(201).json({ data: newUser, message: 'User registered successfully' });
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

        console.log(user, "user")

        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        console.log(isMatch, "isMatch")

        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate authentication token
        const token = user.generateAuthToken();

        // Return the token and user details (without password) in the response
        res.status(200).json({ data: user, token, message: 'Login successfully', status: true });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Admin wise Show user get all details
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await Auth.find().select('-password');
        res.status(200).json({ data: users });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Admin wise Show single user get details
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await Auth.findById(req.params.id);
        if (user) {
            res.status(200).json({ data: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};


// check the AuthToken userId based check in single user get data
// verifying the user ID from an authorization token in a single user scenario:
// You are pass the header authtoken this user token pass is success other wise faild

// Start
export const getUserId = async (req: AuthRequest, res: Response) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authorization header not found' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = req.params.id;
        const user: any = await Auth.findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        res.status(200).json({ data: user });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};


// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.params.id;

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authorization header not found' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (decoded.userId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        if (req.body.password) {
            req.body.password = await hashPassword(req.body.password);
        }

        const updatedUser = await Auth.findByIdAndUpdate(userId, req.body, { new: true });

        if (updatedUser) {
            res.status(200).json({ data: updatedUser, message: "User updated successfully", status: true });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authorization header not found' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (decoded.userId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const deletedUser = await Auth.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// End
