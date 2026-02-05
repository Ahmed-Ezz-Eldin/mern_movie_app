import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movie.js";
import userRoutes from "./routes/user.js";
import reviewsRoutes from "./routes/review.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/movies", movieRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
connectDB();