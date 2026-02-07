import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movie.js";
import userRoutes from "./routes/user.js";
import reviewsRoutes from "./routes/review.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
connectDB();
app.use(cors({
  origin: [
    "https://movie-app-rouge-eta.vercel.app", // Removed trailing slash
    "http://localhost:5173"                    // Added for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS for preflight
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/movies", movieRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
