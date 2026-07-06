'use client'

import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { toast } from "sonner"

interface fileUploadProps {
    onChange: (files: { url: string; fileName: string }[]) => void,
    endpoint: keyof typeof ourFileRouter
}

export const UploadFile = ({ onChange, endpoint }: fileUploadProps) => {
    return (
        <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("Upload complete - all files:", res)
                
                const uploadedFiles = res?.map((file) => ({
                    url: file.ufsUrl || file.url,
                    fileName: file.name,
                })) || []
                
                console.log("Processed files:", uploadedFiles)
                
                if (uploadedFiles.length > 0) {
                    onChange(uploadedFiles)
                    toast.success(`${uploadedFiles.length} file(s) uploaded successfully`)
                } else {
                    toast.error("No files were uploaded")
                }
            }}
            onUploadError={(error: Error) => {
                if (error.message.includes("FileCountMismatch")) {
                    toast.error("You have exceeded the maximum number of files allowed for upload.")
                } else {
                    console.error("Upload error:", error)
                    toast.error(`Upload failed: ${error.message}`)
                }
            }}
        />
    )
}