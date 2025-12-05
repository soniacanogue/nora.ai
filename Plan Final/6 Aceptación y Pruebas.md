### 6. Criterios de Aceptación y Casos de Prueba del MVP
#### 6.1. Reglas Operacionales de Aceptación
*   **Vinculación Automática:** Cuando llegue un email con un `ordenId`, el ticket creado debe mostrar la orden vinculada automáticamente.
*   **Gestión de Respuestas de Email:** El sistema debe identificar correctamente los correos de respuesta y agregar el contenido como un `mensaje` al ticket existente.
*   **Rendimiento del LLM:** El LLM mock debe generar una propuesta de respuesta en menos de 1 segundo.
*   **Flujo de Aprobación:** El agente debe poder aprobar y enviar la propuesta del LLM con un solo clic. El `mensaje` de salida y el `aprobadoPorUsuarioId` deben registrarse correctamente.
*   **Flujo de Escalado:** Si `escalate=true`, el ticket debe cambiar su estado a `escalado_nivel_2` y aparecer en la cola de Nivel 2.
*   **Demostración:** El video de demostración final debe mostrar de forma fluida los 3 casos de prueba principales (WISMO, devolución, producto dañado).

#### 6.2. Plan de Pruebas y Demo (E2E con Playwright)
Se implementará un conjunto enfocado de pruebas E2E para garantizar la estabilidad de los flujos críticos, usando helpers para mockear servicios externos.

*   **Test A (WISMO - Flujo Feliz):** Simular webhook de Mailgun, esperar ticket en UI, hacer clic en "Aprobar y Enviar", y verificar en BD que el `mensaje` y `aprobadoPorUsuarioId` son correctos.
*   **Test B (Devolución - Edición Humana):** Crear ticket desde formulario web, editar la `respuestaSugeridaIA`, enviar, y verificar en BD que `esAutomatico=false` y el contenido es el correcto.
*   **Test C (Daño con Foto - Escalado Automático):** Simular webhook de Mailgun con un adjunto de imagen y verificar que el ticket se crea con estado `escalado_nivel_2`.
*   **Test D (Respuesta de Cliente - Hilo de Conversación):** Simular webhook de Mailgun con `In-Reply-To` y verificar que no se crea un ticket nuevo, sino que se agrega un `mensaje` al existente.
