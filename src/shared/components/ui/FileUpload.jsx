import React, { useRef, useState } from "react";
import Button from "./Button";
import toast from "react-hot-toast";

const FileUpload = ({ label, onFilesSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // UC-10: File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ];

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // UC-10: Validate files
    const validatedFiles = [];
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" excede el tamaño máximo de 10MB`);
        continue;
      }
      
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" tiene un tipo no permitido. Solo se permiten imágenes, PDF, documentos y CSV.`);
        continue;
      }
      
      validatedFiles.push(file);
    }
    
    if (validatedFiles.length === 0) {
      event.target.value = "";
      return;
    }
    
    setSelectedFiles(validatedFiles);
    onFilesSelect(validatedFiles); // Notificar al componente padre
    event.target.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (indexToRemove) => {
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-dt-subtle mb-2">
        {label}
      </label>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
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
      <p className="text-xs text-dt-subtle mt-1 opacity-70">
        Máximo 10MB por archivo. Permitidos: Imágenes, PDF, Word, Excel, TXT, CSV
      </p>

      {/* Mostrar los archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-dt-subtle">Archivos seleccionados:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => {
              const sizeInMB = file.size / (1024 * 1024);
              const isLarge = sizeInMB > 5;
              const fileIcon = file.type.startsWith('image/') ? '🖼️' : 
                              file.type.includes('pdf') ? '📄' : 
                              file.type.includes('word') || file.type.includes('document') ? '📝' :
                              file.type.includes('excel') || file.type.includes('spreadsheet') ? '📊' :
                              '📎';
              
              return (
                <li 
                  key={index}
                  className={`flex items-center justify-between gap-3 border rounded-md px-3 py-2 text-sm ${
                    isLarge ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-black/20'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{fileIcon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-dt-foreground font-medium truncate">{file.name}</span>
                      <span className={`text-xs ${isLarge ? 'text-amber-200' : 'text-dt-subtle'}`}>
                        {sizeInMB < 1 ? `${(file.size / 1024).toFixed(1)} KB` : `${sizeInMB.toFixed(2)} MB`}
                        {isLarge && ' ⚠️'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-wider text-dt-error hover:underline flex-shrink-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Quitar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
