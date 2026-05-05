import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

const isCloudinaryConfigured =
  !!env.cloudinaryCloudName &&
  !!env.cloudinaryApiKey &&
  !!env.cloudinaryApiSecret;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

export async function uploadImage(image, folder = "mundial-fc") {
  if (!image) return "";

  if (!isCloudinaryConfigured) {
    return image;
  }

  const response = await cloudinary.uploader.upload(image, {
    folder,
  });

  return response.secure_url;
}
