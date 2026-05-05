import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  apiFootballKey: process.env.API_FOOTBALL_KEY || "",
  apiFootballBaseUrl:
    process.env.API_FOOTBALL_BASE_URL || "https://v3.football.api-sports.io",
  theNewsApiKey: process.env.THE_NEWS_API_KEY || "",
  theNewsApiBaseUrl:
    process.env.THE_NEWS_API_BASE_URL || "https://api.thenewsapi.com/v1/news",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};
