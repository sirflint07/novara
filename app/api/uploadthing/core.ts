import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const authFunc = async () => {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized user - image upload error")
    }

    return { userId }
}

export const ourFileRouter = {
 courseImage: f({
    image: {
        maxFileSize: "8MB",
        minFileCount: 1,
        maxFileCount: 1
    }
 })
 .middleware(() => authFunc())
 .onUploadComplete(() => {}),

 courseAttachments: f({
    "image": { maxFileSize: "8MB", maxFileCount: 5 },
    "application/pdf": { maxFileSize: "8MB", maxFileCount: 5 },
    "video": { maxFileSize: "1GB", maxFileCount: 5 },
  })
    .middleware(() => authFunc())
    .onUploadComplete(() => {}),
 
 chapterVideo: f({
   video: {
    maxFileSize: "512MB",
    maxFileCount: 1,
   }
 })
    .middleware(() => authFunc())
    .onUploadComplete(() => {})

    } satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;