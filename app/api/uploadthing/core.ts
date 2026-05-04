import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authFunc = async () => {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized user - image upload error")
    }

    return { userId }
}

// const handleUploadError = (error: UploadThingError) => {
//         toast.error(error.message, {

//             position: "top-center",
//             duration: 5000,
//             closeButton: true,
//         })
//     }



// FileRouter for your app, can contain multiple FileRoutes
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

 courseAttachmentsAlt: f({
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