import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "coins",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

// Products have a main photo and an optional second one.
export const productPhotos = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "photo_2", maxCount: 1 },
]);

export default upload;
