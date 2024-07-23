import { User } from "../Models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../MiddleWare/Send_Email.js";
import tryCatch from "../MiddleWare/TryCatch.js";

export const register = tryCatch(async (req, res) => {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            message: "User already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({
        name,
        email,
        password: hashPassword,
        isActive: false, // Set user as inactive initially
    });

    await user.save(); // Save user to the database

    const otp = Math.floor(Math.random() * 100000);
    const activationToken = jwt.sign(
        {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            otp,
        },
        process.env.Activation_Secert,
        {
            expiresIn: "24h",
        }
    );

    const data = {
        name,
        otp,
    };

    await sendMail(
        email,
        "E learning",
        data
    );

    res.status(200).json({
        message: "OTP was sent to your email",
        activationToken,
    });
});

export const verifyUser = tryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    try {
        const verify = jwt.verify(activationToken, process.env.Activation_Secert);
        if (verify.otp !== otp) return res.status(400).json({
            message: "Wrong OTP",
        });

        const user = await User.findById(verify.user.id);
        if (!user) return res.status(400).json({
            message: "User not found",
        });

        user.isActive = true; // Update user status to active
        await user.save(); // Save the updated user status

        res.json({
            message: "User verified successfully"
        });
    } catch (error) {
        return res.status(400).json({
            message: "OTP expired or invalid",
        });
    }
});

export const loginUser = tryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // Corrected reference to User model
    if (!user) return res.status(400).json({
        message: "No user with this email",
    });

    if (!user.isActive) return res.status(400).json({
        message: "User not found or not verified",
    });

    const matchPassword = await bcrypt.compare(password, user.password); // Corrected typo
    if (!matchPassword) return res.status(400).json({
        message: "Wrong password"
    });

    const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, { // Ensure Jwt_Sec is defined in .env
        expiresIn: "15d",
    });

    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user,
    });
});

export const MyProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ user });
});
