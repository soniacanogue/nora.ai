// src/features/admin/ai-agents/schemas.js

import { z } from "zod";

// Helper para validar si un string es un JSON válido
const jsonString = z.string().transform((val, ctx) => {
  try {
    return JSON.parse(val);
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Debe ser un objeto JSON válido.",
    });
    return z.NEVER;
  }
});

export const agentSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  descripcion: z.string().optional(),
  promptBase: z
    .string()
    .min(20, "El prompt base debe tener al menos 20 caracteres."),
  umbralConfianza: z.coerce // coerce convierte el string del input a número
    .number()
    .min(0, "El umbral debe ser como mínimo 0.")
    .max(1, "El umbral debe ser como máximo 1."),
  // Para el MVP, validamos que el campo de texto sea un JSON válido.
  // En el futuro, esto podría tener un schema más estricto.
  promptsPorCanal: jsonString.or(z.object({})), // Acepta el string JSON o un objeto ya parseado
});

// Exportamos el tipo inferido para usarlo en nuestros componentes
/**
 * @typedef {z.infer<typeof agentSchema>} AgentFormData
 */