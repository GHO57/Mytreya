import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
app.use(cookieParser());

//api routes
import admin from "./routes/admin.routes";
import auth from "./routes/auth.routes";
import client from "./routes/client.routes";
import vendor from "./routes/vendor.routes";
import external from "./routes/external.routes";

app.use("/admins", admin);
app.use("/auth", auth);
app.use("/clients", client);
app.use("/vendors", vendor);
app.use("/externals", external);

//error handling middleware
app.use(errorHandlingMiddleware);

export default app;
