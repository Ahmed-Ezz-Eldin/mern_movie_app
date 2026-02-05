
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "posterImg") {
      return {
        folder: "movies/posters",
        resource_type: "image",
        format: "jpg",
      };
    }

    if (file.fieldname === "videoUrl") {
      return {
        folder: "movies/videos",
        resource_type: "video",
      };
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "posterImg" &&
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "videoUrl" &&
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const uploadMovie = multer({ storage, fileFilter });

export default uploadMovie;


// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "posterImg") {
//       cb(null, "uploads/movies/posters");
//     } else if (file.fieldname === "videoUrl") {
//       cb(null, "uploads/movies/videos");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "posterImg") {
//     return file.mimetype.startsWith("image/")
//       ? cb(null, true)
//       : cb(new Error("Poster must be image"));
//   }

//   if (file.fieldname === "videoUrl") {
//     return file.mimetype.startsWith("video/")
//       ? cb(null, true)
//       : cb(new Error("Video must be video file"));
//   }
// };

// export default multer({ storage, fileFilter });
