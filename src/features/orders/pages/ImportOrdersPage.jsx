// src/features/orders/pages/ImportOrdersPage.jsx

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useUploadCsv,
  useStartImport,
  useImportJob,
  useCancelImportJob,
} from "../hooks/useImport";
import Button from "src/shared/components/ui/Button";
import { useQueryClient } from "@tanstack/react-query";
// Importaríamos un nuevo componente de Drag and Drop
// import DragAndDropArea from "src/shared/components/ui/DragAndDropArea";

const REQUIRED_FIELDS = ["orderId", "clientEmail", "status"];

// Componente principal
const ImportOrdersPage = () => {
  const [jobId, setJobId] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // --- HOOKS ---
  const {
    data: job,
    isLoading: isLoadingJob,
    refetch: refetchJob,
  } = useImportJob(jobId);

  // Debug log to track job changes
  useEffect(() => {
    console.log("🔍 Job data updated:", {
      jobId,
      hasJob: !!job,
      status: job?.status,
      progress: job?.progress,
      isLoading: isLoadingJob,
      timestamp: new Date().toLocaleTimeString(),
    });
  }, [job, jobId, isLoadingJob]);

  const { mutate: uploadFile, isPending: isUploading } = useUploadCsv({
    onSuccess: (data) => {
      setJobId(data.jobId);
      setHeaders(data.headers);
      toast.success("Archivo subido. Ahora mapea las columnas.");
    },
    onError: (error) => toast.error(`Error al subir: ${error.message}`),
  });

  const { mutate: startImport, isPending: isStarting } = useStartImport({
    onSuccess: () => toast.success("Iniciando procesamiento..."),
    onError: (error) => toast.error(`Error al iniciar: ${error.message}`),
  });

  const { mutate: cancelImport, isPending: isCancelling } =
    useCancelImportJob();

  // Add useEffect to monitor job status changes and force refresh if needed
  useEffect(() => {
    if (job) {
      // If the job is completed but we don't see it in the UI, force a refresh
      if (job.status === "completed" && job.summary) {
        queryClient.invalidateQueries({ queryKey: ["importJob", jobId] });
      }
    }
  }, [job?.status, job?.progress, job?.summary, queryClient, jobId]);

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
    uploadFile(file);
  };

  const handleConfirmMapping = () => {
    // Validación de mapeo
    if (REQUIRED_FIELDS.some((field) => !mapping[field])) {
      toast.error("Por favor mapea todos los campos requeridos.");
      return;
    }
    startImport({ jobId, mapping });
  };

  const handleCancel = () => {
    if (job?.status === "processing") {
      cancelImport(jobId);
    } else {
      resetState();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Force invalidate and refetch

      await queryClient.invalidateQueries({ queryKey: ["importJob", jobId] });

      const result = await refetchJob();
    } catch (error) {
      console.error("❌ Error refreshing job status:", error);
      toast.error("Error al actualizar el estado");
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetState = () => {
    setJobId(null);
    setHeaders([]);
    setMapping({});
  };

  // --- RENDERIZADO CONDICIONAL POR PASOS ---
  const renderContent = () => {
    if (!jobId || !job) {
      return (
        <Step1Upload
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />
      );
    }

    switch (job.status) {
      case "pending_mapping":
        return (
          <Step2Mapping
            headers={headers}
            mapping={mapping}
            setMapping={setMapping}
            onConfirm={handleConfirmMapping}
            onCancel={handleCancel}
            isStarting={isStarting}
          />
        );
      case "processing":
        return (
          <Step3Progress
            progress={job.progress}
            onCancel={handleCancel}
            isCancelling={isCancelling}
          />
        );
      case "completed":
        return <Step4Summary summary={job.summary} onReset={resetState} />;
      case "cancelled":
        return (
          <div className="text-dt-center">
            <p className="text-dt-yellow-400 font-bold">
              Importación Cancelada.
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth={false}
              onClick={resetState}
              className="mt-4"
            >
              Empezar de Nuevo
            </Button>
          </div>
        );
      default:
        return <div>Estado desconocido.</div>;
    }
  };

  return (
    <div>
      <h1 className="text-dt-3xl font-bold text-dt-foreground mb-6">
        Importar Órdenes desde CSV
      </h1>
      <div className="bg-dt-primary p-8 rounded-lg border border-secondary min-h-[300px]">
        {isLoadingJob && !job ? (
          <p>Cargando estado del job...</p>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

// Step Components
const Step1Upload = ({ onFileSelect, isUploading }) => (
  <div>
    <h2 className="text-dt-xl font-bold text-dt-foreground mb-4">
      Paso 1: Selecciona tu archivo CSV
    </h2>
    <p className="text-dt-subtle mb-4">
      El archivo debe contener las siguientes columnas: orderId, clientEmail,
      status
    </p>
    <input
      type="file"
      accept=".csv"
      onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
      className="text-dt-subtle file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-dt-sm file:font-semibold file:bg-dt-accent file:text-dt-foreground hover:file:bg-dt-accent-hover"
      disabled={isUploading}
    />
    {isUploading && <p className="mt-2 text-dt-subtle">Subiendo archivo...</p>}
  </div>
);

const Step2Mapping = ({
  headers,
  mapping,
  setMapping,
  onConfirm,
  onCancel,
  isStarting,
}) => (
  <div>
    <h2 className="text-dt-xl font-bold text-dt-foreground mb-4">
      Paso 2: Mapea las columnas
    </h2>
    <p className="text-dt-subtle mb-6">
      Asigna las columnas de tu archivo CSV a los campos requeridos por Nora AI.
    </p>

    <div className="space-y-4">
      {REQUIRED_FIELDS.map((field) => (
        <div key={field} className="grid grid-cols-2 gap-4 items-center">
          <label className="font-bold text-dt-foreground">
            {field} <span className="text-dt-red-400">*</span>
          </label>
          <select
            value={mapping[field] || ""}
            onChange={(e) =>
              setMapping((prev) => ({ ...prev, [field]: e.target.value }))
            }
            className="bg-dt-background border border-secondary rounded-md p-2 w-full"
          >
            <option value="">Selecciona una columna...</option>
            {headers.map((header) => (
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
        size="md"
        fullWidth={false}
        onClick={onCancel}
        disabled={isStarting}
      >
        Cancelar
      </Button>
      <Button
        size="md"
        fullWidth={false}
        variant="primary"
        onClick={onConfirm}
        disabled={isStarting}
      >
        {isStarting ? "Procesando..." : "Confirmar e Importar"}
      </Button>
    </div>
  </div>
);

const Step3Progress = ({ progress, onCancel, isCancelling }) => {
  const progressValue = progress?.percentage || progress || 0;

  return (
    <div>
      <h2 className="text-dt-xl font-bold text-dt-foreground mb-4">
        Paso 3: Procesando archivo
      </h2>
      <div className="flex justify-between text-dt-sm text-dt-subtle mb-2">
        <span className="flex items-center">
          Procesando archivo...
          <span className="inline-block ml-2 w-2 h-2 bg-dt-green-400 rounded-full animate-pulse"></span>
        </span>
        <span className="font-mono">{progressValue}%</span>
      </div>
      <div className="w-full bg-dt-secondary rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-dt-gradient-to-r from-accent to-green-400 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className="text-dt-center">
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
      <div className="mt-4 text-dt-xs text-dt-subtle text-dt-center">
        ⏱️ Actualizando automáticamente cada 2 segundos • Progreso:{" "}
        {progressValue}%
      </div>
    </div>
  );
};

const Step4Summary = ({ summary, onReset }) => (
  <div className="text-dt-center">
    <h2
      className={`text-dt-2xl font-bold mb-4 ${
        summary.errors?.length === 0
          ? "text-dt-green-400"
          : "text-dt-yellow-400"
      }`}
    >
      {summary.errors?.length === 0
        ? "¡Importación Exitosa!"
        : "Importación Completada con Advertencias"}
    </h2>

    <div className="bg-dt-background rounded-lg p-6 mb-6 text-dt-left">
      <div className="grid grid-cols-3 gap-4 text-dt-center mb-4">
        <div>
          <div className="text-dt-3xl font-bold text-dt-foreground">
            {summary.total || 0}
          </div>
          <div className="text-dt-sm text-dt-subtle">Total de Filas</div>
        </div>
        <div>
          <div className="text-dt-3xl font-bold text-dt-green-400">
            {summary.imported || 0}
          </div>
          <div className="text-dt-sm text-dt-subtle">Importadas</div>
        </div>
        <div>
          <div className="text-dt-3xl font-bold text-dt-red-400">
            {summary.failed || 0}
          </div>
          <div className="text-dt-sm text-dt-subtle">Fallidas</div>
        </div>
      </div>

      {summary.errors && summary.errors.length > 0 && (
        <div className="border-t border-secondary pt-4">
          <h3 className="font-bold text-dt-foreground mb-2">
            Errores Encontrados:
          </h3>
          <ul className="list-disc list-inside text-dt-sm text-dt-subtle max-h-40 overflow-y-auto">
            {summary.errors.slice(0, 10).map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          {summary.errors.length > 10 && (
            <p className="text-dt-xs text-dt-subtle mt-2">
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
