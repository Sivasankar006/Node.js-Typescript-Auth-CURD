"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
// Routes
app.use('/api', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Connect to MongoDB
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/mydb", {})
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((err) => {
    console.log(err);
});
exports.default = app;
