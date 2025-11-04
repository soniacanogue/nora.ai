// src/pages/public/NewTicketPage.jsx
import React, { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload'; // 1. IMPORTAR

const NewTicketPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState([]); // 2. AÑADIR ESTADO PARA ARCHIVOS
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => { /* ... (sin cambios) ... */ };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('--- NUEVO TICKET ENVIADO ---');
    console.log('Datos:', formData);
    console.log('Archivos:', files); // 3. MOSTRAR ARCHIVOS EN CONSOLA

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };
  
  // ... (código del mensaje de "Gracias" sin cambios) ...

  return (
    <PublicLayout>
      <div className="bg-primary p-8 rounded-lg border border-secondary">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">Contacta con Soporte</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (inputs de nombre, email, etc. sin cambios) ... */}
          
          <textarea
            // ... (props sin cambios)
          />

          {/* 4. AÑADIR EL COMPONENTE DE CARGA DE ARCHIVOS */}
          <FileUpload 
            label="Adjuntar Archivos (Opcional)"
            onFilesSelect={(selectedFiles) => setFiles(selectedFiles)}
          />

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Consulta'}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default NewTicketPage;