import jwt from 'jsonwebtoken';
import { User } from '../Models/user.js';

export const isAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            message: "No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.Jwt_Sec);
        const user = await User.findById(decoded._id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "User not found or not verified",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: "Access denied",
        });
    }
    next();
};
