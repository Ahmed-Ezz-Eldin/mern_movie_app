import express from "express";
import { addReview } from "../controllers/review.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:movieId", protect, addReview);

export default router;
