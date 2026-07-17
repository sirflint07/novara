'use client'

import { UploadButton } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { toast } from "sonner"

interface SingleFileUploadProps {
    onChange: (url: string, fileName: string) => void,
    endpoint: keyof typeof ourFileRouter
}

export const SingleFileUpload = ({ onChange, endpoint }: SingleFileUploadProps) => {
    return (
        <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                const file = res?.[0]
                if (file) {
                    const url = file.ufsUrl || file.url
                    const fileName = file.name
                    onChange(url, fileName)
                    toast.success("File uploaded successfully")
                } else {
                    toast.error("No file uploaded")
                }
            }}
            onUploadError={(error: Error) => {
                console.error("Upload error:", error)
                toast.error(`Upload failed: ${error.message}`)
            }}
        />
    )
}