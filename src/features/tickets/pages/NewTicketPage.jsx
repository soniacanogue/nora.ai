import React, { useState } from "react";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import FileUpload from "../../../shared/components/ui/FileUpload";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PublicLayout from "../../../shared/components/layout/PublicLayout";

const NewTicketPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("--- NUEVO TICKET ENVIADO (VALIDADO) ---");
        console.log("Datos:", data);
        console.log("Archivos:", files);
        toast.success("¡Consulta enviada con éxito!");
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
        <div className="bg-dt-primary p-8 rounded-lg border border-secondary text-dt-center">
          <h2 className="text-dt-2xl font-bold text-dt-green-400 mb-4">
            ¡Gracias!
          </h2>
          <p className="text-dt-foreground">
            Hemos recibido tu consulta. Recibirás una confirmación por correo
            electrónico en breve.
          </p>
          <p className="text-dt-subtle mt-2">
            Tu número de ticket de referencia es: TKT-005.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              onClick={handleCreateAnother}
              size="md"
              fullWidth={false}
              variant="secondary"
            >
              Crear otro ticket
            </Button>
            <a
              href="/"
              className="text-dt-sm text-dt-subtle hover:text-dt-foreground hover:underline"
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
      <div className="bg-dt-primary p-8 rounded-lg border border-secondary">
        <h2 className="text-dt-2xl font-bold text-dt-center text-dt-foreground mb-6">
          Contacta con Soporte
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="name"
                label="Nombre Completo"
                placeholder="Ingresa tu nombre completo"
                value=""
                onChange={() => {}}
                {...register("name", { required: "El nombre es obligatorio" })}
                required
              />
              {errors.name && (
                <p className="text-dt-red-500 text-dt-sm mt-1">
                  {typeof errors.name?.message === "string"
                    ? errors.name.message
                    : ""}
                </p>
              )}
            </div>
            <div>
              <Input
                id="email"
                label="Correo Electrónico"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value=""
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato de correo no válido",
                  },
                })}
                required
              />
              {errors.email && (
                <p className="text-dt-red-500 text-dt-sm mt-1">
                  {typeof errors.email?.message === "string"
                    ? errors.email.message
                    : ""}
                </p>
              )}
            </div>
          </div>
          <Input
            id="orderId"
            label="Número de Orden (Opcional)"
            placeholder="Ingresa el número de orden (opcional)"
            value=""
            {...register("orderId")}
          />
          <div>
            <Input
              id="subject"
              label="Asunto"
              placeholder="Ingresa el asunto"
              value=""
              onChange={() => {}}
              {...register("subject", { required: "El asunto es obligatorio" })}
              required
            />
            {errors.subject && (
              <p className="text-dt-red-500 text-dt-sm mt-1">
                {typeof errors.subject?.message === "string"
                  ? errors.subject.message
                  : ""}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-dt-sm font-medium text-dt-subtle mb-2"
            >
              Mensaje<span className="text-dt-red-500 ml-1">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full p-3 bg-dt-background border border-secondary rounded-md"
              {...register("message", {
                required: "El mensaje es obligatorio",
              })}
            />
            {errors.message && (
              <p className="text-dt-red-500 text-dt-sm mt-1">
                {typeof errors.message?.message === "string"
                  ? errors.message.message
                  : ""}
              </p>
            )}
          </div>
          <FileUpload
            label="Adjuntar Archivos (Opcional)"
            onFilesSelect={(selectedFiles) => setFiles(selectedFiles)}
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            onClick={() => {}}
          >
            {isSubmitting ? "Enviando..." : "Enviar Consulta"}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default NewTicketPage;
