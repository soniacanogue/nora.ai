// src/pages/ImportOrdersPage.jsx
import React, { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';
import Papa from 'papaparse';

const REQUIRED_FIELDS = ['orderId', 'clientEmail', 'status', 'trackingNumber'];

const ImportOrdersPage = () => {
  const [step, setStep] = useState(1); // <-- LÍNEA CORREGIDA
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          setCsvHeaders(results.meta.fields);
          setStep(2);
        },
      });
    }
  };

  const handleMappingChange = (dbField, csvHeader) => {
    setMapping(prev => ({ ...prev, [dbField]: csvHeader }));
  };

  const handleImport = () => {
    console.log("--- INICIANDO IMPORTACIÓN ---");
    console.log("Archivo:", csvFile.name);
    console.log("Mapeo:", mapping);
    setStep(3);
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-foreground mb-6">Importar Órdenes desde CSV</h1>
      
      <div className="bg-primary p-8 rounded-lg border border-secondary">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Paso 1: Selecciona tu archivo CSV</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} className="text-subtle file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-foreground hover:file:bg-accent-hover" />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Paso 2: Mapea las columnas</h2>
            <p className="text-subtle mb-6">Asigna las columnas de tu archivo CSV a los campos requeridos por Nora AI.</p>
            <div className="space-y-4">
              {REQUIRED_FIELDS.map(field => (
                <div key={field} className="grid grid-cols-2 gap-4 items-center">
                  <label className="font-bold text-foreground">{field}</label>
                  <select onChange={(e) => handleMappingChange(field, e.target.value)} className="bg-background border border-secondary rounded-md p-2 w-full">
                    <option value="">Selecciona una columna...</option>
                    {csvHeaders.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={handleImport} className="w-auto">Confirmar e Importar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">¡Éxito!</h2>
            <p className="text-foreground">Hemos iniciado la importación de tu archivo <span className="font-bold">{csvFile.name}</span>.</p>
            <p className="text-subtle mt-2">Recibirás una notificación cuando el proceso haya finalizado.</p>
            <Button onClick={() => setStep(1)} className="w-auto mt-6">Importar otro archivo</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ImportOrdersPage;