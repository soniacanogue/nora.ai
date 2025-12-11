// src/features/admin/ai-agents/components/AgentForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { agentSchema } from "../schemas";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";

// Manual Zod resolver for React Hook Form
// Esta función conecta Zod con React Hook Form sin necesidad de un paquete externo.
const manualZodResolver = async (data) => {
  try {
    // safeParse no lanza errores, devuelve un objeto con el resultado
    const result = await agentSchema.safeParseAsync(data);

    if (result.success) {
      // Si la validación es exitosa, devolvemos los valores validados y un objeto de errores vacío.
      return { values: result.data, errors: {} };
    } else {
      // Si falla, transformamos el array de errores de Zod al formato que React Hook Form necesita.
      const formattedErrors = result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = {
          type: "zod",
          message: issue.message,
        };
        return acc;
      }, {});
      return { values: {}, errors: formattedErrors };
    }
  } catch (error) {
    // En caso de un error inesperado
    return { values: {}, errors: {} };
  }
};

export function AgentForm({ initialData, onSubmit, isSubmitting, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: manualZodResolver,
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      promptBase: initialData?.promptBase || "",
      modelo: initialData?.modelo || "",
      temperatura: initialData?.temperatura || 0.3,
      umbralConfianza: initialData?.umbralConfianza || 0.75,
      promptsPorCanal: JSON.stringify(
        initialData?.promptsPorCanal || {},
        null,
        2,
      ),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="nombre"
        label="Nombre del Agente"
        {...register("nombre")}
        error={errors.nombre?.message}
      />
      <Input
        id="descripcion"
        label="Descripción"
        {...register("descripcion")}
        error={errors.descripcion?.message}
      />
      <Input
        id="modelo"
        label="Modelo de IA"
        placeholder="ej: x-ai/grok-4.1-fast:free"
        {...register("modelo")}
        error={errors.modelo?.message}
      />
      <Input
        id="temperatura"
        label="Temperatura (0.0 - 1.0)"
        type="number"
        step="0.1"
        min="0"
        max="1"
        {...register("temperatura", { valueAsNumber: true })}
        error={errors.temperatura?.message}
      />
      <div>
        <label
          htmlFor="promptBase"
          className="block text-sm font-medium text-dt-subtle mb-2"
        >
          Prompt Base
        </label>
        <textarea
          id="promptBase"
          rows={10}
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:border-dt-accent/50 focus:ring-1 focus:ring-dt-accent/50 text-dt-foreground transition-colors"
          {...register("promptBase")}
        />
        {errors.promptBase && (
          <p className="mt-1 text-sm text-red-500">
            {errors.promptBase.message}
          </p>
        )}
      </div>
      <Input
        id="umbralConfianza"
        label="Umbral de Confianza (0.0 - 1.0)"
        type="number"
        step="0.01"
        {...register("umbralConfianza", { valueAsNumber: true })}
        error={errors.umbralConfianza?.message}
      />
      <div>
        <label
          htmlFor="promptsPorCanal"
          className="block text-sm font-medium text-dt-subtle mb-2"
        >
          Prompts Específicos por Canal (JSON)
        </label>
        <textarea
          id="promptsPorCanal"
          rows={5}
          className="w-full p-3 bg-black/20 border border-white/10 rounded-md font-mono text-sm focus:outline-none focus:border-dt-accent/50 focus:ring-1 focus:ring-dt-accent/50 text-dt-foreground transition-colors"
          {...register("promptsPorCanal")}
        />
        {errors.promptsPorCanal && (
          <p className="mt-1 text-sm text-red-500">
            {errors.promptsPorCanal.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          fullWidth={false}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          fullWidth={false}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
