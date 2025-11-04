// src/pages/public/NewTicketPage.jsx
import React, { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const NewTicketPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('--- NUEVO TICKET ENVIADO (VALIDADO) ---');
        console.log('Datos:', data);
        console.log('Archivos:', files);
        toast.success('¡Consulta enviada con éxito!');
        setIsSubmitted(true);
        resolve();
      }, 1500);
    });
  };

  const handleCreateAnother = () => {
    reset();
    setFiles([]);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <PublicLayout>
        <div className="bg-primary p-8 rounded-lg border border-secondary text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">¡Gracias!</h2>
          <p className="text-foreground">Hemos recibido tu consulta. Recibirás una confirmación por correo electrónico en breve.</p>
          <p className="text-subtle mt-2">Tu número de ticket de referencia es: TKT-005.</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button 
              onClick={handleCreateAnother} 
              className="w-full max-w-xs"
              variant="secondary"
            >
              Crear otro ticket
            </Button>
            <a 
              href="/" 
              className="text-sm text-subtle hover:text-foreground hover:underline"
            >
              o volver a la página principal
            </a>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-primary p-8 rounded-lg border border-secondary">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">Contacta con Soporte</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                id="name" 
                label="Nombre Completo" 
                {...register("name", { required: "El nombre es obligatorio" })}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input 
                id="email" 
                label="Correo Electrónico" 
                type="email" 
                {...register("email", { 
                  required: "El correo es obligatorio", 
                  pattern: { value: /^\S+@\S+$/i, message: "Formato de correo no válido" }
                })}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <Input id="orderId" label="Número de Orden (Opcional)" {...register("orderId")} />
          <div>
            <Input 
              id="subject" 
              label="Asunto" 
              {...register("subject", { required: "El asunto es obligatorio" })}
              required
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-subtle mb-2">
              Mensaje<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full p-3 bg-background border border-secondary rounded-md"
              {...register("message", { required: "El mensaje es obligatorio" })}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>
          <FileUpload 
            label="Adjuntar Archivos (Opcional)"
            onFilesSelect={(selectedFiles) => setFiles(selectedFiles)}
          />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default NewTicketPage;