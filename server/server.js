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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://movie-app-rouge-eta.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174"
    ];
    

  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

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