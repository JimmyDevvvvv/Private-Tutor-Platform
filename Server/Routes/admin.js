import express from "express";
import { isAdmin, isAuth } from "../MiddleWare/isAuth.js";
import { CreateCourse, testAPI } from "../Controllers/admin.js";
import { upload_files } from "../MiddleWare/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, upload_files, CreateCourse);
router.get("/test", testAPI);  // Define the route for the test API

export default router; // Export the router instance
