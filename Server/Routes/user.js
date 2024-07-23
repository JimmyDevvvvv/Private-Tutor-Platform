import express from "express";
import {loginUser, MyProfile, register, verifyUser} from "../Controllers/user.js";
import {isAuth} from "../MiddleWare/isAuth.js";

const router = express.Router(); // Corrected this line

router.post('/user/register', register);
router.post("/user/verify",verifyUser)
router.post("/user/login",loginUser)
router.get("/user/me",isAuth,MyProfile)
export default router;
