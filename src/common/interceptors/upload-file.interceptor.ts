import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export function uploadFileS3(fileName: string) {
    return class UploadUtility extends FileInterceptor(fileName, {
        storage: memoryStorage()
    }) {}
}