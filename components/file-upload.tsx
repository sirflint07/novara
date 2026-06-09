'use client'

import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { toast } from "sonner"

interface fileUploadProps {
    onChange: (url: string, fileName: string) => void,
    endpoint: keyof typeof ourFileRouter
}

export const UploadFile = ({ onChange, endpoint }: fileUploadProps) => {
    return (
         <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);

          console.log("Full upload response:", res)
            const fileUrl = res?.[0]?.ufsUrl
            const fileName = res?.[0]?.name
            console.log("Extracted URL:", fileUrl)
            console.log("Extracted File Name:", fileName)
            onChange(fileUrl, fileName)
            toast.success("File uploaded successfully")

        }}
        onUploadError={(error: Error) => {
            alert(`Upload error: ${error.message}`);
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message}`);
        }}
      />
    )
}