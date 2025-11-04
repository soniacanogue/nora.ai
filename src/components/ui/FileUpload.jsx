// src/components/ui/FileUpload.jsx
import React, { useRef, useState } from 'react';
import Button from './Button';

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
      <label className="block text-sm font-medium text-subtle mb-2">{label}</label>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" // El input real está oculto
      />
      <Button type="button" variant="secondary" onClick={handleButtonClick} className="w-auto">
        Seleccionar Archivos...
      </Button>

      {/* Mostrar los archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-subtle">Archivos seleccionados:</p>
          <ul className="list-disc list-inside text-foreground text-sm">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name} ({ (file.size / 1024).toFixed(1) } KB)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;