import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.routes.mjs";
import { errorHandler } from "./middleware/error.middleware.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

app.use(limiter);
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

app.get("/", (request, response) => {
    return response.status(200).send("API is working!")
})