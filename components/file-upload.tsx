'use client'

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { toast } from "sonner"

interface fileUploadProps {
    onChange: (url: string) => void,
    endpoint: keyof typeof ourFileRouter
}

export const UploadFile = ({ onChange, endpoint }: fileUploadProps) => {
    return (
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            const fileUrl = res?.[0]?.ufsUrl
            onChange(fileUrl)
            toast.success("File uploaded successfully")
        }}
        onUploadError={(error: Error) => {toast.error(`Upload failed: ${error.message} - file size above max`)}}
        />
    )
}