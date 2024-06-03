"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.loginUser = exports.registerUser = void 0;
const Auth_1 = require("../models/Auth");
// User registration
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield Auth_1.Auth.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        const newUser = new Auth_1.Auth({ name, email, password });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.registerUser = registerUser;
// User login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield Auth_1.Auth.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate authentication token
        const token = user.generateAuthToken();
        // Return the token in the response
        res.status(200).json({ token });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.loginUser = loginUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Auth_1.Auth.find();
        res.status(200).json(users);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.getUsers = getUsers;
