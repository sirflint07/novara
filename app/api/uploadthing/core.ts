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
    "image": { maxFileSize: "8MB" },
    "application/pdf": { maxFileSize: "8MB" },
    "video": { maxFileSize: "1GB" },
  })
    .middleware(() => authFunc())
    .onUploadComplete(() => {}),
 
 chapterVideo: f({
   video: {
    maxFileSize: "1GB",
    maxFileCount: 3,
    minFileCount: 1
   }
 })
    .middleware(() => authFunc())
    .onUploadComplete(() => {})

    } satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;