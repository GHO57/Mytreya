import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import errorHandlingMiddleware from "./middleware/errorHandling.middleware";

//express app
const app: Express = express();

//cors configuration options
const corsOptions: cors.CorsOptions = {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

//necessary middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//proxy middlewares

//proxy to users-service
app.use(
    "/api/v1/users",
    createProxyMiddleware<Request, Response>({
        target: process.env.USER_SERVICE_URL,
        changeOrigin: true,
        on: {
            proxyReq: fixRequestBody,
        },
    }),
);

//error handling middleware
app.use(errorHandlingMiddleware);

export default app;
