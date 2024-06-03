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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// User Schema
const AuthSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});
// Pre-save hook to hash password before saving
AuthSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
            next();
        }
        catch (error) {
            // next(error);
        }
    });
});
// Method to compare password for login
AuthSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
// Method to generate authentication token
AuthSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'defaultsecret', {
        expiresIn: '1h' // Token expires in 1 hour
    });
    return token;
};
// Create and export User model
exports.Auth = (0, mongoose_1.model)('Auth', AuthSchema);
