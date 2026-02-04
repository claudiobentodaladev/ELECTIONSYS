import express from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import "../config/auth.passport.mjs";
import "../database/mongodb/db.connection.mjs";


dotenv.config();

const router = express.Router()


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

router.use(limiter);
router.use(helmet());
router.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true }));

router.use(session({
    secret: process.env.SESSION_SECRET || "helloC",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    },
    store: connectMongo.create({
        client: mongoose.connection.getClient()
    })
}));
router.use(passport.initialize());
router.use(passport.session());