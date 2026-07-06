import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}

export const Editor = ({ onChange, value, placeholder }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list',
    'indent',
    'link', 'image',
  ];

  return (
    <div className="bg-white rounded-lg">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={(content) => {
          console.log("Editor content changed:", content);
          onChange(content);
        }}
        placeholder={placeholder || "Write something..."}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg"
      />
    </div>
  );
};