
import express from "express";
import { login, register } from "../controllers/user.js";
import uploadProfile from "../middleware/uploadProfile.js";
const router = express.Router();
router.post("/signup", uploadProfile.single("imgProfile"), register);
router.post("/signin", login);

export default router;
