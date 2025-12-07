// src/features/orders/pages/ImportOrdersPage.jsx

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { useImportBatch } from "../hooks/useImport";
import Button from "src/shared/components/ui/Button";
import Select from "src/shared/components/ui/Select";

const REQUIRED_FIELDS = ["orderId", "clientEmail", "status"];
const BATCH_SIZE = 10;

// Componente principal
const ImportOrdersPage = () => {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({
    total: 0,
    imported: 0,
    failed: 0,
    errors: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const abortControllerRef = useRef(null);

  // --- HOOKS ---
  const { mutateAsync: importBatch } = useImportBatch();

  // --- MANEJADORES DE EVENTOS ---
  const handleFileSelect = (file) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Por favor selecciona un archivo CSV válido");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      toast.error("El archivo no puede superar los 10MB.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("Parse errors:", results.errors);
        }
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
          setFileData(results.data);
          setStep(2);
          toast.success("Archivo cargado. Ahora mapea las columnas.");
        } else {
          toast.error("No se pudieron leer las columnas del archivo CSV.");
        }
      },
      error: (error) => {
        toast.error(`Error al leer el archivo: ${error.message}`);
      },
    });
  };

  const handleConfirmMapping = async () => {
    // Validación de mapeo
    if (REQUIRED_FIELDS.some((field) => !mapping[field])) {
      toast.error("Por favor mapea todos los campos requeridos.");
      return;
    }

    setStep(3);
    setIsProcessing(true);
    setProgress(0);
    setSummary({
      total: fileData.length,
      imported: 0,
      failed: 0,
      errors: [],
    });

    abortControllerRef.current = new AbortController();

    try {
      await processBatches();
      setStep(4);
    } catch (error) {
      if (error.name === "AbortError") {
        toast("Importación cancelada");
        setStep(4); // Show summary of what was done
      } else {
        console.error("Error fatal en importación:", error);
        toast.error("Error durante la importación");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const processBatches = async () => {
    const total = fileData.length;
    let processed = 0;
    // Use a local summary to accumulate results
    let currentSummary = {
      total,
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < total; i += BATCH_SIZE) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const batch = fileData.slice(i, i + BATCH_SIZE);
      const mappedBatch = batch.map((row) => {
        const mappedRow = {};
        Object.entries(mapping).forEach(([targetField, sourceHeader]) => {
          mappedRow[targetField] = row[sourceHeader];
        });
        return mappedRow;
      });

      try {
        const result = await importBatch(mappedBatch);

        // Update summary based on result
        const batchImported =
          result.imported !== undefined ? result.imported : mappedBatch.length;
        const batchFailed = result.failed !== undefined ? result.failed : 0;
        const batchErrors = result.errors || [];

        currentSummary.imported += batchImported;
        currentSummary.failed += batchFailed;
        currentSummary.errors = [...currentSummary.errors, ...batchErrors];
      } catch (err) {
        console.error("Batch failed", err);
        currentSummary.failed += batch.length;
        currentSummary.errors.push(
          `Lote ${Math.floor(i / BATCH_SIZE) + 1} falló: ${err.message}`,
        );
      }

      processed += batch.length;
      setProgress(Math.round((processed / total) * 100));
      setSummary({ ...currentSummary });

      // Small delay to allow UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const resetState = () => {
    setStep(1);
    setFileData([]);
    setHeaders([]);
    setMapping({});
    setProgress(0);
    setSummary({ total: 0, imported: 0, failed: 0, errors: [] });
  };

  // --- RENDERIZADO CONDICIONAL POR PASOS ---
  const renderContent = () => {
    switch (step) {
      case 1:
        return <Step1Upload onFileSelect={handleFileSelect} />;
      case 2:
        return (
          <Step2Mapping
            headers={headers}
            mapping={mapping}
            setMapping={setMapping}
            onConfirm={handleConfirmMapping}
            onCancel={resetState}
          />
        );
      case 3:
        return (
          <Step3Progress
            progress={progress}
            onCancel={handleCancel}
            isCancelling={!isProcessing && progress < 100} // Simplified logic
          />
        );
      case 4:
        return <Step4Summary summary={summary} onReset={resetState} />;
      default:
        return <div>Estado desconocido.</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dt-foreground mb-6">
        Importar Órdenes desde CSV
      </h1>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8 shadow-glow min-h-[300px]">
        {renderContent()}
      </div>
    </div>
  );
};

// Step Components
const Step1Upload = ({ onFileSelect }) => (
  <div>
    <h2 className="text-xl font-bold text-dt-foreground mb-4">
      Paso 1: Selecciona tu archivo CSV
    </h2>
    <p className="text-dt-subtle mb-4">
      El archivo debe contener las siguientes columnas: orderId, clientEmail,
      status
    </p>
    <div className="relative group">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
        className="block w-full text-sm text-dt-subtle
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-dt-accent file:text-white
            hover:file:bg-dt-accent-hover
            file:cursor-pointer cursor-pointer
            bg-black/20 rounded-lg border border-white/10 p-2
            focus:outline-none focus:border-dt-accent/50 transition-colors"
      />
    </div>
  </div>
);

const Step2Mapping = ({
  headers,
  mapping,
  setMapping,
  onConfirm,
  onCancel,
}) => (
  <div>
    <h2 className="text-xl font-bold text-dt-foreground mb-4">
      Paso 2: Mapea las columnas
    </h2>
    <p className="text-dt-subtle mb-6">
      Asigna las columnas de tu archivo CSV a los campos requeridos por Nora AI.
    </p>

    <div className="space-y-4">
      {REQUIRED_FIELDS.map((field) => (
        <div key={field} className="grid grid-cols-2 gap-4 items-center">
          <label className="font-bold text-dt-foreground">
            {field} <span className="text-red-400">*</span>
          </label>
          <Select
            value={mapping[field] || ""}
            onChange={(e) =>
              setMapping((prev) => ({ ...prev, [field]: e.target.value }))
            }
            placeholder="Selecciona una columna..."
            options={[
              { value: "", label: "Selecciona una columna..." },
              ...headers.map((header) => ({ value: header, label: header })),
            ]}
            className="w-full"
          />
        </div>
      ))}
    </div>

    <div className="mt-8 flex justify-between">
      <Button
        variant="secondary"
        size="md"
        fullWidth={false}
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button size="md" fullWidth={false} variant="primary" onClick={onConfirm}>
        Confirmar e Importar
      </Button>
    </div>
  </div>
);

const Step3Progress = ({ progress, onCancel, isCancelling }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-dt-foreground mb-4">
        Paso 3: Procesando archivo
      </h2>
      <div className="flex justify-between text-sm text-dt-subtle mb-2">
        <span className="flex items-center">
          Procesando archivo...
          <span className="inline-block ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </span>
        <span className="font-mono">{progress}%</span>
      </div>
      <div className="w-full bg-dt-secondary rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-accent to-green-400 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center">
        <Button
          variant="secondary"
          size="md"
          fullWidth={false}
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelando..." : "Cancelar Importación"}
        </Button>
      </div>
      <div className="mt-4 text-xs text-dt-subtle text-center">
        ⏱️ Enviando lotes al servidor... • Progreso: {progress}%
      </div>
    </div>
  );
};

const Step4Summary = ({ summary, onReset }) => (
  <div className="text-center">
    <h2
      className={`text-2xl font-bold mb-4 ${
        summary.errors?.length === 0 ? "text-dt-success" : "text-yellow-400"
      }`}
    >
      {summary.errors?.length === 0
        ? "¡Importación Exitosa!"
        : "Importación Completada con Advertencias"}
    </h2>

    <div className="bg-black/20 border border-white/10 rounded-lg p-6 mb-6 text-left">
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
          <div className="text-3xl font-bold text-dt-foreground font-mono">
            {summary.total || 0}
          </div>
          <div className="text-xs uppercase tracking-wider text-dt-subtle mt-1">
            Total de Filas
          </div>
        </div>
        <div className="p-4 bg-dt-success/5 rounded-lg border border-dt-success/10">
          <div className="text-3xl font-bold text-dt-success font-mono">
            {summary.imported || 0}
          </div>
          <div className="text-xs uppercase tracking-wider text-dt-success/70 mt-1">
            Importadas
          </div>
        </div>
        <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/10">
          <div className="text-3xl font-bold text-red-400 font-mono">
            {summary.failed || 0}
          </div>
          <div className="text-xs uppercase tracking-wider text-red-400/70 mt-1">
            Fallidas
          </div>
        </div>
      </div>

      {summary.errors && summary.errors.length > 0 && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <h3 className="font-bold text-dt-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Errores Encontrados:
          </h3>
          <ul className="list-none space-y-2 text-sm text-dt-subtle max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {summary.errors.slice(0, 10).map((error, idx) => (
              <li
                key={idx}
                className="bg-red-500/10 text-red-300 p-2 rounded border border-red-500/20 text-xs font-mono"
              >
                {error}
              </li>
            ))}
          </ul>
          {summary.errors.length > 10 && (
            <p className="text-xs text-dt-subtle mt-2 text-center italic">
              ...y {summary.errors.length - 10} errores más
            </p>
          )}
        </div>
      )}
    </div>

    <Button size="md" fullWidth={false} variant="primary" onClick={onReset}>
      Importar Otro Archivo
    </Button>
  </div>
);

export default ImportOrdersPage;
