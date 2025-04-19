import express, { Router } from "express"
import {login,logout,signup} from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controllers.js";
import { checkAuth } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post('/signup',signup)

router.post('/login',login)

router.post('/logout',logout)

router.put("/updateProfile",protectRoute ,updateProfile)

router.get('/check',protectRoute,checkAuth)

export default router