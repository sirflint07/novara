import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
  className?: string;
}

export const Preview = ({ value, className }: PreviewProps) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill-new"), { ssr: false }), []);

    return (
        <div 
      className={cn(
        "prose prose-sm max-w-none text-gray-700",
        className
      )}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: 1.7,
      }}
    >
      <style jsx>{`
        .quill-preview :global(.ql-editor) {
          padding: 0;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #1f2937;
        }
        .quill-preview :global(.ql-editor h1) {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .quill-preview :global(.ql-editor h2) {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .quill-preview :global(.ql-editor h3) {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .quill-preview :global(.ql-editor ul),
        .quill-preview :global(.ql-editor ol) {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .quill-preview :global(.ql-editor ul li) {
          list-style-type: disc;
          margin-bottom: 0.25rem;
        }
        .quill-preview :global(.ql-editor ol li) {
          
          margin-bottom: 0.25rem;
        }
        .quill-preview :global(.ql-editor blockquote) {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #4b5563;
          font-style: italic;
        }
        .quill-preview :global(.ql-editor a) {
          color: #4f46e5;
          text-decoration: underline;
        }
        .quill-preview :global(.ql-editor code) {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .quill-preview :global(.ql-editor pre) {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 0.75rem 0;
        }
      `}</style>
      <ReactQuill 
        theme="bubble"
        value={value || ""}
        readOnly={true}
        modules={{ toolbar: false }}
        className="quill-preview"
      />
    </div>
    )
}