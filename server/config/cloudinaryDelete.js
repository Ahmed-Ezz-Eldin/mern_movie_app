import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (public_id, resource_type = "image") => {
  if (!public_id) return;

  await cloudinary.uploader.destroy(public_id, {
    resource_type,
  });
};


