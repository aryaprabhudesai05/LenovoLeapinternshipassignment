import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUpload({ onFile, accept = ".pdf,.doc,.docx", label = "Drop your resume here" }) {
  const [drag, setDrag] = useState(false);
  const [name, setName] = useState("");

  const handle = (files) => {
    const file = files?.[0];
    if (file) {
      setName(file.name);
      onFile?.(file);
    }
  };

  return (
    <div
      className={`dropzone ${drag ? "drag" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files);
      }}
      onClick={() => document.getElementById("file-input").click()}
    >
      <UploadCloud size={34} color="var(--primary)" />
      <h4 style={{ marginTop: 12 }}>{label}</h4>
      <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
        {name || "PDF, DOCX up to 5MB"}
      </p>
      <input
        id="file-input"
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}
