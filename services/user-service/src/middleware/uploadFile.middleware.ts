import { Request, Response, NextFunction } from "express";
import multer from "multer";
import errorHandler from "../utils/errorHandler.utils";
import path from "path";
import fs from "fs";
import logger from "../utils/logger.utils";

//multer storage type
const memStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.FILE_STORAGE_PATH as string);
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const fileName =
            file.fieldname +
            "-" +
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            fileExtension;
        cb(null, fileName);
    },
});

//filter file based on mimetype
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new errorHandler("Only images and PDF files are allowed", 400));
    }
};

//multer config for mem storage
const uploadFileMem = multer({
    storage: memStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});

const uploadFileDisk = multer({
    storage: diskStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});

const deleteUploadedFile = (filePath?: string) => {
    if (!filePath) return;
    fs.unlink(filePath, (err) => {
        if (err) logger.error("Failed to delete file:", err);
    });
};

export { uploadFileMem, uploadFileDisk, deleteUploadedFile };
