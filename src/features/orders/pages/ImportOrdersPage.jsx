import React, { useState } from "react";
import AppLayout from "../../../shared/components/layout/AppLayout";
import Button from "../../../shared/components/ui/Button";
import Papa from "papaparse";
import toast from "react-hot-toast";

const REQUIRED_FIELDS = ["orderId", "clientEmail", "status", "trackingNumber"];

const ImportOrdersPage = () => {
  const [step, setStep] = useState(1);
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importSummary, setImportSummary] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error("Por favor selecciona un archivo CSV válido");
        return;
      }
      setCsvFile(file);
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          if (results.meta.fields && results.meta.fields.length > 0) {
            setCsvHeaders(results.meta.fields);
            setStep(2);
          } else {
            toast.error("El archivo CSV está vacío o tiene un formato inválido");
          }
        },
        error: (error) => {
          toast.error(`Error al leer el archivo: ${error.message}`);
        }
      });
    }
  };

  const handleMappingChange = (dbField, csvHeader) => {
    setMapping((prev) => ({ ...prev, [dbField]: csvHeader }));
  };

  const validateMapping = () => {
    const errors = [];
    REQUIRED_FIELDS.forEach((field) => {
      if (!mapping[field]) {
        errors.push(`El campo "${field}" es requerido y debe ser mapeado`);
      }
    });
    return errors;
  };

  const validateRow = (row, rowIndex) => {
    const errors = [];
    
    REQUIRED_FIELDS.forEach((field) => {
      const csvColumn = mapping[field];
      const value = row[csvColumn];
      
      if (!value || value.trim() === "") {
        errors.push(`Fila ${rowIndex + 1}: El campo "${field}" está vacío`);
      }
    });

    // Validate email format
    const emailColumn = mapping["clientEmail"];
    if (emailColumn && row[emailColumn]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row[emailColumn])) {
        errors.push(`Fila ${rowIndex + 1}: Email inválido "${row[emailColumn]}"`);
      }
    }

    return errors;
  };

  const handleImport = async () => {
    // Validate mapping
    const mappingErrors = validateMapping();
    if (mappingErrors.length > 0) {
      setValidationErrors(mappingErrors);
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setValidationErrors([]);

    // Parse the complete CSV file
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let imported = 0;
        let skipped = 0;
        const errors = [];

        // Simulate processing with progress
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const rowErrors = validateRow(row, i);
          
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
            skipped++;
          } else {
            imported++;
          }

          // Update progress
          const progressPercent = Math.round(((i + 1) / rows.length) * 100);
          setProgress(progressPercent);
          
          // Simulate async processing delay
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        setImportSummary({
          total: rows.length,
          imported,
          skipped,
          errors: errors.slice(0, 10), // Only show first 10 errors
        });

        setIsProcessing(false);
        setStep(3);
        
        if (imported > 0) {
          toast.success(`${imported} órdenes importadas exitosamente`);
        }
        if (skipped > 0) {
          toast.error(`${skipped} órdenes omitidas debido a errores`);
        }
      },
      error: (error) => {
        setIsProcessing(false);
        toast.error(`Error al procesar el archivo: ${error.message}`);
      }
    });
  };

  const resetImport = () => {
    setStep(1);
    setCsvFile(null);
    setCsvHeaders([]);
    setMapping({});
    setProgress(0);
    setImportSummary(null);
    setValidationErrors([]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Importar Órdenes desde CSV
      </h1>

      <div className="bg-primary p-8 rounded-lg border border-secondary">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Paso 1: Selecciona tu archivo CSV
            </h2>
            <p className="text-subtle mb-4">
              El archivo debe contener las siguientes columnas: orderId, clientEmail, status, trackingNumber
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-subtle file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-foreground hover:file:bg-accent-hover"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Paso 2: Mapea las columnas
            </h2>
            <p className="text-subtle mb-6">
              Asigna las columnas de tu archivo CSV a los campos requeridos por
              Nora AI.
            </p>
            
            {validationErrors.length > 0 && (
              <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-red-200 mb-2">Errores de validación:</h3>
                <ul className="list-disc list-inside text-red-300 text-sm">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {REQUIRED_FIELDS.map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-2 gap-4 items-center"
                >
                  <label className="font-bold text-foreground">
                    {field} <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={mapping[field] || ""}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    className="bg-background border border-secondary rounded-md p-2 w-full"
                  >
                    <option value="">Selecciona una columna...</option>
                    {csvHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button 
                variant="secondary" 
                onClick={resetImport} 
                className="w-auto"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleImport} 
                className="w-auto"
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Confirmar e Importar"}
              </Button>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-subtle mb-2">
                  <span>Procesando archivo...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && importSummary && (
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${
              importSummary.skipped === 0 ? "text-green-400" : "text-yellow-400"
            }`}>
              {importSummary.skipped === 0 ? "¡Importación Exitosa!" : "Importación Completada con Advertencias"}
            </h2>
            
            <div className="bg-background rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">{importSummary.total}</div>
                  <div className="text-sm text-subtle">Total de Filas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{importSummary.imported}</div>
                  <div className="text-sm text-subtle">Importadas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">{importSummary.skipped}</div>
                  <div className="text-sm text-subtle">Omitidas</div>
                </div>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="border-t border-secondary pt-4">
                  <h3 className="font-bold text-foreground mb-2">Errores Encontrados:</h3>
                  <ul className="list-disc list-inside text-sm text-subtle max-h-40 overflow-y-auto">
                    {importSummary.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                  {importSummary.skipped > importSummary.errors.length && (
                    <p className="text-xs text-subtle mt-2">
                      ...y {importSummary.skipped - importSummary.errors.length} errores más
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button onClick={resetImport} className="w-auto">
              Importar Otro Archivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportOrdersPage;
