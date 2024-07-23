import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./DataBase/db.js";
import userRoutes from './Routes/user.js';
import Courses from "./Routes/Courses.js";
import admin from "./Routes/admin.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes); // Updated routes to ensure clarity
app.use('/api', Courses);
app.use('/api', admin);

app.get("/", (req, res) => {
    res.send('Server is working');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
});
