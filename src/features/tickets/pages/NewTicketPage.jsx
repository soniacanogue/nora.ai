import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import FileUpload from "../../../shared/components/ui/FileUpload";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PublicLayout from "../../../shared/components/layout/PublicLayout";
import { createPublicTicket, uploadAttachment } from "../api/ticketsApi";

const NewTicketPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.companyField) {
      toast.error("No pudimos enviar tu solicitud. Intenta nuevamente.");
      return;
    }

    try {
      // If there are files, upload them first and use the returned URLs/ids
      let uploadedFilesMeta = [];
      if (files && files.length > 0) {
        const uploadResults = await Promise.all(
          files.map(async (f) => {
            const res = await uploadAttachment(f);
            return res;
          }),
        );

        uploadedFilesMeta = uploadResults.map((meta, idx) => {
          // Normalize the response to our expected payload shape.
          // Prefer `url`, `publicUrl`, `path`, or `id` from backend metadata.
          const url = meta?.url || meta?.publicUrl || meta?.public_url || meta?.path || meta?.fileUrl || meta?.downloadUrl || null;
          const id = meta?.id || meta?.fileId || meta?.uploadId || null;

          return {
            nombreArchivo: files[idx].name,
            urlAlmacenamiento: url || null,
            tipoMime: files[idx].type,
            tamano: files[idx].size,
          };
        });
      }

      const payload = {
        canal: "formulario_web",
        prioridad: "media",
        asunto: data.subject,
        mensajeInicial: data.message,
        correoCliente: data.email,
        nombreCliente: data.name,
        ordenId: data.orderId || null,
        archivos: uploadedFilesMeta,
      };

      const createdTicket = await createPublicTicket(payload);
      const returnedTicketId =
        createdTicket?.id ||
        createdTicket?.ticketId ||
        createdTicket?.reference ||
        null;

      console.log("--- NUEVO TICKET ENVIADO (VALIDADO) ---");
      console.log("Datos:", payload);
      toast.success("¡Consulta enviada con éxito!");

      const confirmationPath = returnedTicketId
        ? `/new-ticket/confirmation?ticketId=${encodeURIComponent(returnedTicketId)}`
        : "/new-ticket/confirmation";

      reset();
      setFiles([]);

      navigate(confirmationPath, {
        state: { ticketId: returnedTicketId },
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(
        "Hubo un error al enviar tu consulta. Por favor intenta de nuevo.",
      );
    }
  };

  return (
    <PublicLayout>
      <div className="bg-dt-primary p-8 rounded-lg border border-secondary">
        <h2 className="text-2xl font-bold text-center text-dt-foreground mb-6">
          Contacta con Soporte
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="companyField">No completar este campo</label>
            <input
              id="companyField"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("companyField")}
            />
          </div>
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
                <p className="text-red-500 text-sm mt-1">
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
                <p className="text-red-500 text-sm mt-1">
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
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.subject?.message === "string"
                  ? errors.subject.message
                  : ""}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-dt-subtle mb-2"
            >
              Mensaje<span className="text-red-500 ml-1">*</span>
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
              <p className="text-red-500 text-sm mt-1">
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
