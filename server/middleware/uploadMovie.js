import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "posterImg") {
      cb(null, "uploads/movies/posters");
    } else if (file.fieldname === "videoUrl") {
      cb(null, "uploads/movies/videos");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "posterImg") {
    return file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Poster must be image"));
  }

  if (file.fieldname === "videoUrl") {
    return file.mimetype.startsWith("video/")
      ? cb(null, true)
      : cb(new Error("Video must be video file"));
  }
};

export default multer({ storage, fileFilter });
