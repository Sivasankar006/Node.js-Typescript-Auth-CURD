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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const User_1 = require("../models/User");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find();
        res.status(200).json(users);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json({ message: "Email is already exists", status: false });
            return;
        }
        const newUser = new User_1.User(req.body);
        const savedUser = yield newUser.save();
        res.status(201).json({ savedUser, message: "Create user successfully", status: true });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_1.User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedUser) {
            res.status(200).json({ updatedUser, message: "Update user successfully", status: true });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield User_1.User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
