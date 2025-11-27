import React, { useRef, useState } from "react";
import Button from "./Button";

const FileUpload = ({ label, onFilesSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    onFilesSelect(files); // Notificar al componente padre
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <label className="block text-dt-sm font-medium text-dt-subtle mb-2">
        {label}
      </label>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" // El input real está oculto
      />
      <Button
        type="button"
        variant="secondary"
        size="md"
        fullWidth={false}
        onClick={handleButtonClick}
      >
        Seleccionar Archivos...
      </Button>

      {/* Mostrar los archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-dt-sm text-dt-subtle">Archivos seleccionados:</p>
          <ul className="list-disc list-inside text-dt-foreground text-dt-sm">
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
