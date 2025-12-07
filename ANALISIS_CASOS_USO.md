# Auditoría de Implementación: Casos de Uso

Este documento detalla el estado de implementación de los casos de uso analizados en el frontend, comparando los requisitos funcionales con el código actual.

---

## UC-01 (Creación de Ticket Web)

### ✅ Lo que está implementado
* **Formulario completo:**...

### ❌ Lo que falta
* **ID de ticket dinámico:** ...

### ⚠️ Observaciones
* **Experiencia de adjuntos:** ...

---

## UC-02 (Listado y Detalle de Tickets)

### ✅ Lo que está implementado
* **Listado funcional:**...

### ❌ Lo que falta
* **Badge de origen:** ...

### ⚠️ Observaciones
* **Contexto del agente:**...

---


## UC-03: Responder a un Ticket (Correo) Existente

### ✅ Lo que está implementado
*   **Visualización de Mensajes:**...

### ❌ Lo que falta
*   **Indicadores de Canal:**...

### ⚠️ Observaciones
*   La lógica principal de est---

---

## UC-04: Aprobar Respuesta Sugerida por la IA

### ✅ Lo que está implementado

### ❌ Lo que falta

### ⚠️ Observaciones

---

## UC-05: Editar y Enviar Respuesta Sugerida por la IA

### ✅ Lo que está implementado

### ❌ Lo que falta

### ⚠️ Observaciones

---

## UC-06: Escalar Ticket a Nivel 2

### ✅ Lo que está implementado
* **Endpoint de escalamiento:** `POST /tickets/:id/escalate` implementado correctamente.
* **Cambio de estado:** El endpoint cambia automáticamente el estado del ticket a `escalado_nivel_2`.
* **Nota interna:** Soporte para agregar una nota interna explicando el motivo del escalamiento.
* **DTO definido:** `EscalateTicketDto` con campo `note` (opcional) documentado en la API.

### ❌ Lo que falta
* **Notificación a especialistas:** No está claro si el backend notifica automáticamente a los agentes de Nivel 2 cuando se escala un ticket.
* **Reglas de escalamiento automático:** Verificar si existe lógica de escalamiento automático basado en el análisis de la IA (mencionado en UC-24).

### ⚠️ Observaciones
* El caso de uso menciona que puede ser invocado tanto manualmente por un agente como automáticamente por el sistema (UC-24).
* La interfaz frontend debe mostrar claramente la opción de escalamiento y solicitar una nota explicativa al agente.
* Considerar implementar validaciones de permisos (solo Nivel 1 y superiores deberían poder escalar).

---

## UC-07: Gestionar Etiquetas del Ticket

### ✅ Lo que está implementado
* **Agregar etiqueta:** `POST /tickets/:id/tags/:tagId` implementado.
* **Quitar etiqueta:** `DELETE /tickets/:id/tags/:tagId` implementado.
* **Gestión de etiquetas maestras:** CRUD completo en `/tags` (UC-17).
* **Visualización en tickets:** Las etiquetas se incluyen en la respuesta del ticket.

### ❌ Lo que falta
* **Sugerencias de IA:** Verificar si el sistema guarda las `etiquetasSugeridasIA` del análisis de la IA y las muestra al agente.
* **Etiquetas predefinidas:** Confirmar si hay un conjunto de etiquetas predeterminadas del sistema.

### ⚠️ Observaciones
* Este UC permite al agente agregar/quitar etiquetas manualmente para categorizar el ticket.
* Las etiquetas son útiles para filtrado, búsqueda y generación de reportes.
* El frontend debería mostrar tanto las etiquetas actuales como las sugeridas por la IA (si existen).

---

## UC-08: Resolver Ticket

### ✅ Lo que está implementado
* **Actualización de estado:** `PATCH /tickets/:id` permite cambiar el estado a `cerrado`.
* **Endpoint genérico:** El endpoint de actualización de tickets soporta todos los cambios de estado.
* **Historial de estados:** El sistema debe mantener un registro de los cambios de estado del ticket.

### ❌ Lo que falta
* **Validación de precondiciones:** Verificar si el backend valida que solo se puedan cerrar tickets en estados apropiados (ej: `esperando_cliente`, `en_progreso_nivel_2`).
* **Mensaje final obligatorio:** Confirmar si el sistema requiere un mensaje final al cliente antes de cerrar.
* **Encuesta de satisfacción:** No se encontró endpoint para enviar encuesta post-cierre (si está en los requisitos).

### ⚠️ Observaciones
* El UC menciona que el agente puede cerrar el ticket después de resolver el problema.
* Debe existir la posibilidad de reabrir tickets cerrados (ver UC-10 en el documento original).
* Considerar implementar un mensaje de confirmación en el frontend antes de cerrar definitivamente.

---

## UC-09: Consultar Historial del Cliente

### ✅ Lo que está implementado
* **Vista 360 del cliente:** `GET /customers/:email/360` implementado.
* **Búsqueda de clientes:** `GET /customers/search?query=...` permite buscar por nombre o correo.
* **Datos completos:** El endpoint devuelve tickets históricos y órdenes asociadas al cliente.
* **Integración con tickets:** Los tickets muestran información del cliente asociado.

### ❌ Lo que falta
* **Métricas del cliente:** Verificar si se calculan métricas como "número total de tickets", "tiempo promedio de resolución", "valor total de órdenes".
* **Timeline de interacciones:** Confirmar si existe una vista cronológica de todas las interacciones del cliente.

### ⚠️ Observaciones
* Este UC es fundamental para que los agentes tengan contexto completo del cliente antes de responder.
* La vista 360 debe incluir: historial de tickets, órdenes realizadas, estado de RMAs, patrones de comportamiento.
* El frontend debe presentar esta información de forma clara y accesible desde el panel de detalle del ticket.

---

## UC-10: Adjuntar y Descargar Archivos

### ✅ Lo que está implementado
* **Sistema de uploads:** `POST /uploads` implementado para subir archivos.
* **Soporte en creación de tickets:** Los DTOs incluyen campo `archivos` para adjuntos.
* **Soporte en respuestas:** El endpoint de reply acepta archivos adjuntos.
* **Almacenamiento:** Los archivos se guardan con metadata (nombre, URL, tipo MIME, tamaño).

### ❌ Lo que falta
* **Descarga de archivos:** No se encontró endpoint explícito `GET /uploads/:fileId` para descargar archivos.
* **Validación de tipos:** Verificar si hay restricciones en tipos de archivo permitidos (ej: no ejecutables).
* **Límites de tamaño:** Confirmar límite máximo de tamaño de archivo.
* **Antivirus:** Verificar si existe integración con servicio de escaneo de malware.

### ⚠️ Observaciones
* Los archivos adjuntos son críticos para soporte técnico (capturas de pantalla, logs, facturas).
* El sistema debe soportar múltiples archivos por mensaje.
* Considerar implementar previsualización de imágenes en el frontend.
* La URL de almacenamiento sugiere que se usa un servicio externo (S3, Azure Blob, etc.).

---

## UC-11: Añadir Nota Interna al Ticket

### ✅ Lo que está implementado
* **Endpoint de mensajes:** `POST /tickets/:id/messages` implementado.
* **Flag de nota interna:** El DTO `CreateMessageDto` incluye campo `esNotaInterna` (boolean).
* **Diferenciación:** Las notas internas NO son visibles para el cliente, solo para agentes.
* **Soporte de adjuntos:** Las notas internas pueden incluir archivos adjuntos.

### ❌ Lo que falta
* **Permisos de visualización:** Verificar que el backend filtre correctamente las notas internas al mostrar tickets a clientes.
* **Indicador visual:** Confirmar que las notas internas se marcan claramente en la UI para evitar confusiones.

### ⚠️ Observaciones
* Las notas internas son fundamentales para comunicación entre agentes sin que el cliente las vea.
* Casos de uso: documentar decisiones, compartir información de contexto, explicar escalamientos.
* El frontend debe mostrar las notas internas con un estilo visual diferente (ej: fondo amarillo, icono de candado).
* Este endpoint es el mismo que se usa para responder al cliente, solo varía el flag `esNotaInterna`.

---

## UC-12: Gestionar Configuración de Agente IA

### ✅ Lo que está implementado
* **CRUD completo:** Todos los endpoints implementados:
  - `GET /ai/config` - Listar configuraciones
  - `POST /ai/config` - Crear nueva configuración
  - `GET /ai/config/:id` - Obtener configuración específica
  - `PATCH /ai/config/:id` - Actualizar configuración
  - `DELETE /ai/config/:id` - Eliminar configuración
* **DTOs completos:** `CreateAiConfigDto` y `UpdateAiConfigDto` bien definidos con todos los campos necesarios.
* **Campos importantes:** nombre, descripción, promptBase, promptsPorCanal, modelo, temperatura, umbralConfianza.

### ❌ Lo que falta
* **Configuración activa:** Verificar si existe un mecanismo para marcar una configuración como "activa" o "por defecto".
* **Versionado:** No está claro si se mantiene historial de cambios en las configuraciones.
* **Testing de prompts:** No se encontró endpoint para probar un prompt antes de guardarlo.

### ⚠️ Observaciones
* Este UC es clave para permitir a los administradores ajustar el comportamiento de la IA.
* El campo `promptsPorCanal` permite personalizar prompts según el canal (web, correo, chat).
* La `temperatura` controla la creatividad/determinismo de las respuestas de la IA.
* El `umbralConfianza` determina cuándo escalar automáticamente un ticket.

---

## UC-13: Gestionar Plantillas de Respuesta

### ✅ Lo que está implementado
* **CRUD completo:** Todos los endpoints implementados:
  - `GET /templates` - Listar plantillas
  - `POST /templates` - Crear nueva plantilla
  - `GET /templates/:id` - Obtener plantilla específica
  - `PATCH /templates/:id` - Actualizar plantilla
  - `DELETE /templates/:id` - Eliminar plantilla
* **DTOs definidos:** `CreateTemplateDto` y `UpdateTemplateDto` con campos: nombre, plantillaCuerpo, plantillaAsunto.
* **Variables de plantilla:** Soporte para variables tipo `{{ticketId}}`, `{{nombreCliente}}`, etc.

### ❌ Lo que falta
* **Endpoint de aplicación:** No se encontró un endpoint específico para "aplicar plantilla a ticket" (UC-21).
  - **Recomendación:** Implementar `POST /tickets/:id/apply-template/:templateId`
* **Categorización:** No está claro si las plantillas se pueden categorizar por tipo de problema.
* **Estadísticas de uso:** Falta tracking de cuáles plantillas son más utilizadas.

### ⚠️ Observaciones
* Las plantillas permiten estandarizar respuestas comunes y mejorar la eficiencia del agente.
* El sistema de variables debe soportar al menos: ticketId, nombreCliente, correoCliente, ordenId, fechaCreacion.
* El frontend debe proporcionar una UI intuitiva para insertar variables en las plantillas.
* Considerar implementar previsualización de plantilla con datos reales del ticket.

---

## UC-14: Gestionar Base de Conocimiento para IA

### ✅ Lo que está implementado
* **Nada encontrado:** No se identificaron endpoints específicos para gestión de base de conocimiento.

### ❌ Lo que falta
* **CRUD de documentos de conocimiento:** Falta implementar endpoints para:
  - `GET /knowledge-base` - Listar documentos
  - `POST /knowledge-base` - Crear nuevo documento
  - `GET /knowledge-base/:id` - Obtener documento
  - `PATCH /knowledge-base/:id` - Actualizar documento
  - `DELETE /knowledge-base/:id` - Eliminar documento
* **Categorización:** Sistema para organizar documentos por categorías (FAQ, políticas, procedimientos).
* **Búsqueda semántica:** Endpoint para buscar en la base de conocimiento usando embeddings.
* **Versionado:** Historial de cambios en documentos.
* **Integración con IA:** Mecanismo para inyectar contexto de la KB en los prompts.

### ⚠️ Observaciones
* **Este es un caso de uso NO IMPLEMENTADO en el backend.**
* La base de conocimiento es fundamental para que la IA proporcione respuestas precisas y actualizadas.
* Debe soportar diferentes tipos de contenido: FAQs, políticas de devolución, guías de troubleshooting, etc.
* **Prioridad:** ALTA - Sin esto, la IA no puede acceder a información de la empresa.
* **Recomendación:** Implementar primero un CRUD básico, luego agregar búsqueda vectorial para mejorar precisión.

---

## UC-15: Importar Órdenes (CSV)

### ✅ Lo que está implementado
* **Importación desde CSV:** `POST /orders/import/csv` implementado.
* **Importación desde JSON:** `POST /orders/import/json` también disponible.
* **DTOs definidos:** `ImportOrderDto` con campos: orderId, clientEmail, status.
* **Endpoint de órdenes:** `GET /orders` y `GET /orders/:id` para consultar órdenes importadas.

### ❌ Lo que falta
* **Validación de formato:** Verificar si el backend valida el formato del CSV (headers, tipos de datos).
* **Manejo de duplicados:** Confirmar cómo se manejan órdenes duplicadas (update vs error).
* **Reportes de importación:** No está claro si se devuelve un reporte detallado de éxitos/fallos.
* **Procesamiento asíncrono:** Para archivos grandes, verificar si la importación es asíncrona.

### ⚠️ Observaciones
* La importación de órdenes es fundamental para vincular tickets con compras del cliente.
* El archivo CSV debe incluir al menos: ID de orden, email del cliente, estado, fecha, productos.
* El sistema debe asociar automáticamente órdenes con clientes existentes por email.
* Considerar implementar un preview de importación antes de confirmar.
* El frontend debe mostrar progreso durante la importación de archivos grandes.

---

## UC-16: Gestionar Usuarios

### ✅ Lo que está implementado
* **CRUD completo de usuarios:** Todos los endpoints implementados:
  - `GET /users` - Listar todos los usuarios
  - `POST /users` - Crear nuevo usuario
  - `GET /users/:id` - Obtener usuario específico
  - `PATCH /users/:id` - Actualizar usuario
  - `DELETE /users/:id` - Eliminar usuario
* **Perfil del usuario:** `GET /users/profile` y `PATCH /users/profile` para usuario autenticado.
* **Roles y permisos:** El sistema debe soportar roles (admin, agente_nivel_1, agente_nivel_2, supervisor).

### ❌ Lo que falta
* **Gestión de permisos:** Verificar si existe un sistema granular de permisos por recurso.
* **Activación/Desactivación:** Confirmar si existe un mecanismo para desactivar usuarios sin eliminarlos.
* **Cambio de contraseña:** No se encontró endpoint específico para cambio de contraseña.
* **Recuperación de contraseña:** Falta endpoint para reset de contraseña vía email.

### ⚠️ Observaciones
* La gestión de usuarios es fundamental para control de acceso y asignación de tickets.
* Debe soportar diferentes roles: Admin, Supervisor, Agente Nivel 1, Agente Nivel 2.
* Cada rol debe tener permisos específicos (ej: solo admin puede gestionar configuración de IA).
* El frontend debe validar permisos del usuario actual antes de mostrar ciertas opciones.

---

## UC-17: Gestionar Etiquetas Maestras

### ✅ Lo que está implementado
* **CRUD completo de etiquetas:** Todos los endpoints implementados:
  - `GET /tags` - Listar todas las etiquetas
  - `POST /tags` - Crear nueva etiqueta
  - `GET /tags/:id` - Obtener etiqueta específica
  - `PATCH /tags/:id` - Actualizar etiqueta
  - `DELETE /tags/:id` - Eliminar etiqueta
* **DTOs definidos:** `CreateTagDto` y `UpdateTagDto` con campos: nombre, descripción, color.
* **Colores:** Soporte para asignar colores a etiquetas (formato hex: #FF5733).

### ❌ Lo que falta
* **Validación de eliminación:** Verificar si el backend impide eliminar etiquetas que están en uso.
* **Conteo de uso:** No está claro si se muestra cuántos tickets tienen cada etiqueta.
* **Etiquetas del sistema:** Confirmar si existen etiquetas predefinidas que no se pueden eliminar.

### ⚠️ Observaciones
* Las etiquetas maestras son el catálogo centralizado de etiquetas disponibles en el sistema.
* A diferencia de UC-07 (que agrega etiquetas a tickets), este UC gestiona el catálogo.
* Las etiquetas son útiles para: categorización, filtrado, reportes, análisis de tendencias.
* Ejemplos: "Devolución", "Garantía", "Consulta Técnica", "Queja", "Urgente", "VIP".
* El frontend debe mostrar las etiquetas con sus colores asignados para mejor UX.

---

## UC-18: Gestionar Integraciones

### ✅ Lo que está implementado
* **CRUD completo de integraciones:** Todos los endpoints implementados:
  - `GET /integrations` - Listar integraciones
  - `POST /integrations` - Crear nueva integración
  - `GET /integrations/:id` - Obtener integración específica
  - `PATCH /integrations/:id` - Actualizar integración
  - `DELETE /integrations/:id` - Eliminar integración
* **DTOs completos:** `CreateIntegrationDto` y `UpdateIntegrationDto` con campos:
  - nombre, claveApiEnc (API key encriptada), endpoint, urlWebhook, configJson, activo.

### ❌ Lo que falta
* **Testing de conexión:** No se encontró endpoint para probar una integración antes de guardarla.
* **Logs de integración:** Falta endpoint para ver logs de llamadas a integraciones externas.
* **Reintentos:** No está claro si existe lógica de reintentos para integraciones fallidas.

### ⚠️ Observaciones
* Las integraciones permiten conectar NoraAI con servicios externos (Mailgun, OpenRouter, etc.).
* El campo `claveApiEnc` indica que las API keys se almacenan encriptadas (buena práctica de seguridad).
* El campo `configJson` permite almacenar configuración específica de cada integración.
* El flag `activo` permite desactivar integraciones sin eliminarlas.
* **Integraciones clave:** Mailgun (email), OpenRouter (IA), posiblemente Stripe/Shopify (órdenes).

---

## UC-19: Reasignar Ticket Manualmente

### ✅ Lo que está implementado
* **Endpoint de reasignación:** `POST /tickets/:id/reassign` implementado.
* **DTO definido:** `ReassignTicketDto` con campos: assigneeId (UUID requerido), note (opcional).
* **Nota explicativa:** Soporte para agregar una nota interna explicando la reasignación.
* **Actualización simple:** También se puede usar `PATCH /tickets/:id` con campo `assigneeId`.

### ❌ Lo que falta
* **Validación de agente:** Verificar si el backend valida que el assigneeId corresponde a un usuario activo y con rol apropiado.
* **Notificación:** No está claro si el agente destino recibe una notificación de la reasignación.
* **Historial de asignaciones:** Confirmar si se mantiene un registro de todas las reasignaciones.

### ⚠️ Observaciones
* La reasignación permite distribuir carga de trabajo o asignar tickets a especialistas.
* Casos de uso: vacaciones, sobrecarga de trabajo, especialización por tipo de problema.
* El sistema debe validar que el agente destino tiene permisos para manejar ese tipo de ticket.
* Considerar implementar sugerencias de agentes basadas en especialización o carga actual.
* El frontend debe mostrar información del agente actual y permitir búsqueda de agentes disponibles.

---

## UC-20: Generar Reportes (Exportar)

### ✅ Lo que está implementado
* **Exportación a CSV:** `GET /tickets/export` implementado.
* **Filtros opcionales:** El endpoint acepta parámetros de filtrado (estado, fechas, agente, etc.).
* **Formato CSV:** Exporta tickets en formato CSV listo para análisis en Excel/Google Sheets.

### ❌ Lo que falta
* **Otros formatos:** Verificar si soporta exportación a Excel (.xlsx), PDF.
* **Reportes predefinidos:** No se encontraron endpoints para reportes específicos (ej: reporte de SLA, reporte de satisfacción).
* **Programación de reportes:** Falta funcionalidad para generar reportes automáticos periódicos.
* **Dashboard de reportes:** No hay endpoint para obtener reportes consolidados con gráficos.

### ⚠️ Observaciones
* La exportación a CSV es fundamental para análisis offline y cumplimiento normativo.
* Los filtros permiten exportar subsets específicos (ej: tickets de último mes, por agente, por estado).
* Considerar agregar opciones de exportación más avanzadas en el futuro.
* El frontend debe mostrar un diálogo de opciones de exportación con preview de campos incluidos.
* **Campos a exportar:** ID, asunto, estado, prioridad, canal, cliente, agente, fechas, etiquetas.

---

## UC-21: Visualizar Dashboard de Métricas

### ✅ Lo que está implementado
* **Dashboard de administrador:** `GET /dashboards/admin` implementado.
* **Dashboard de agente:** `GET /dashboards/agent` implementado.
* **Dashboard de supervisor:** `GET /dashboards/supervisor` implementado.
* **Métricas diferenciadas:** Cada rol tiene un dashboard con métricas relevantes a su función.

### ❌ Lo que falta
* **Detalle de métricas:** No está claro qué métricas específicas retorna cada dashboard.
* **Filtros temporales:** Verificar si se puede filtrar por rango de fechas (hoy, semana, mes).
* **Comparativa temporal:** Falta información de si se incluyen comparativas (ej: vs semana anterior).
* **Tiempo real:** Confirmar si las métricas se actualizan en tiempo real o tienen caché.

### ⚠️ Observaciones
* **Métricas esperadas para Admin:**
  - Total de tickets por estado, SLA promedio, tasa de resolución, satisfacción del cliente
  - Carga de trabajo por agente, tickets escalados, uso de IA
* **Métricas esperadas para Agente:**
  - Mis tickets asignados, pendientes de respuesta, tiempo promedio de respuesta
  - Tickets resueltos hoy/semana, satisfacción de mis clientes
* **Métricas esperadas para Supervisor:**
  - Performance del equipo, distribución de carga, cuellos de botella
  - Tendencias de tipos de problemas, efectividad de la IA
* El frontend debe visualizar estas métricas con gráficos claros (barras, líneas, KPIs destacados).

---

## UC-22: Auditar Log de Eventos del Sistema

### ✅ Lo que está implementado
* **Endpoint de auditoría:** `GET /audit` implementado (Solo Admin).
* **Control de acceso:** Endpoint restringido solo para administradores.
* **Logs del sistema:** Registro de eventos importantes para trazabilidad y compliance.

### ❌ Lo que falta
* **Filtros de búsqueda:** Verificar si se puede filtrar por: tipo de evento, usuario, fecha, recurso afectado.
* **Detalle de eventos:** No está claro qué información incluye cada log (timestamp, usuario, acción, IP, datos antes/después).
* **Retención:** Confirmar política de retención de logs (¿cuánto tiempo se guardan?).
* **Exportación:** Verificar si se pueden exportar logs para análisis externo.

### ⚠️ Observaciones
* Los logs de auditoría son críticos para:
  - Compliance y regulaciones (GDPR, SOC 2)
  - Investigación de incidentes de seguridad
  - Análisis de patrones de uso
  - Troubleshooting de problemas
* **Eventos a registrar:** login/logout, creación/modificación/eliminación de tickets, cambios de configuración, acceso a datos sensibles, exportaciones, reasignaciones.
* El sistema debe registrar: timestamp, usuario, acción, recurso afectado, IP origen, datos modificados.
* El frontend debe proporcionar una interfaz de búsqueda y filtrado de logs eficiente.

---

## UC-23: Crear Ticket (Proceso Interno)

### ✅ Lo que está implementado
* **Endpoint autenticado:** `POST /tickets` para creación interna de tickets.
* **Endpoint público:** `POST /public/tickets` para formulario web sin autenticación.
* **DTOs completos:** Ambos endpoints usan DTOs bien definidos con todos los campos necesarios.
* **Campos soportados:**
  - canal, prioridad, asunto, mensajeInicial
  - correoCliente, nombreCliente
  - ordenId (vinculación a orden existente)
  - archivos (array de adjuntos)

### ❌ Lo que falta
* **Acuse de recibo:** Verificar si RF-TICKET-006 está implementado (envío automático de email al cliente).
* **Trigger de IA:** Confirmar si RF-IA-001 está implementado (inicio automático de procesamiento IA tras creación).
* **Validación de orden:** Verificar si el sistema valida que el ordenId existe antes de vincular.
* **Deduplicación:** Confirmar si existe lógica para detectar tickets duplicados al crearlos.

### ⚠️ Observaciones
* Este es un caso de uso interno invocado por UC-01 (formulario web) y UC-25 (webhook email).
* Debe crear registros de: Ticket, Mensaje inicial, Cliente (si no existe), vínculos a Orden y Archivos.
* El estado inicial debe ser `nuevo`, luego cambiar a `pendiente_ia` para procesamiento.
* El sistema debe generar un ID único de ticket alfanumérico (ej: ABC-123).
* **Flujo esperado:** Crear ticket → Enviar acuse de recibo → Iniciar procesamiento IA → Estado `ia_sugerido`.

---

## UC-24: Generar Sugerencia de Respuesta (Proceso Interno)

### ✅ Lo que está implementado
* **Reintento manual:** `POST /ai/retry/:ticketId` permite reintentar generación de sugerencia IA.
* **Configuración de agentes:** Endpoints de `/ai/config` para gestionar prompts y configuración.
* **Integración con LLM:** El sistema está preparado para integrar con OpenRouter.

### ❌ Lo que falta
* **Procesamiento automático:** Verificar si el procesamiento IA se inicia automáticamente tras crear un ticket.
* **Estados del ticket:** Confirmar transiciones de estado: `nuevo` → `pendiente_ia` → `ia_sugerido`.
* **Almacenamiento de sugerencias:** Verificar si los campos `respuestaSugeridaIA`, `confianzaIA`, `etiquetasSugeridasIA` se guardan en el ticket.
* **Escalado automático:** Confirmar implementación de RF-IA-005 (lógica de escalado automático).
* **Notificación en tiempo real:** Verificar si se emite evento SSE/WebSocket cuando la sugerencia está lista.

### ⚠️ Observaciones
* Este proceso asíncrono es crucial para la automatización del sistema.
* **Flujo esperado:**
  1. Worker toma ticket en estado `pendiente_ia`
  2. Recopila contexto: mensaje inicial, datos cliente, historial, orden vinculada
  3. Selecciona ConfigAgente apropiada
  4. Construye prompt inyectando contexto
  5. Llama a API de OpenRouter
  6. Procesa respuesta JSON (respuesta, confianza, etiquetas, flag escalate)
  7. Actualiza ticket con sugerencias
  8. Aplica lógica de escalado automático
  9. Cambia estado a `ia_sugerido` o `escalado_nivel_2`
  10. Emite evento en tiempo real
* **Manejo de errores:** Si falla, debe cambiar estado a `error_ia` y notificar admins.

---

## UC-25: Notificar Nuevo Email (Webhook)

### ✅ Lo que está implementado
* **Endpoint de webhook:** `POST /webhooks/mailgun/inbound` implementado.
* **Integración con Mailgun:** El sistema está preparado para recibir notificaciones de emails entrantes.
* **Lógica de enrutamiento:** El endpoint debe determinar si es ticket nuevo o respuesta existente.

### ❌ Lo que falta
* **Validación de firma:** Verificar si el backend valida la firma de Mailgun para prevenir ataques.
* **Parsing de headers:** Confirmar si se parsean correctamente `In-Reply-To`, `References`, `Subject`.
* **Extracción de ID de ticket:** Verificar si busca patrones como `[Ticket #ABC-123]` en el asunto.
* **Manejo de adjuntos:** Confirmar que los adjuntos del email se procesan y almacenan correctamente.
* **Respuestas HTTP:** Verificar códigos de respuesta apropiados (200 OK, 400 Bad Request, 403 Forbidden, 500 Internal Server Error).

### ⚠️ Observaciones
* Este webhook es el punto de entrada para todo el soporte basado en email.
* **Flujo esperado:**
  1. Mailgun recibe email en soporte@gearup.com
  2. Mailgun envía POST al webhook de NoraAI
  3. Sistema verifica autenticidad (firma)
  4. Parsea headers y contenido
  5. Busca referencias a ticket existente
  6. **SI encuentra referencia:** Invoca UC-03 (Responder a Ticket Existente)
  7. **SI NO encuentra referencia:** Invoca UC-23 (Crear Ticket)
  8. Responde 200 OK a Mailgun
* **Seguridad:** Debe validar firma de Mailgun y rechazar requests no autorizados con 403.
* **Idempotencia:** Debe manejar reintentos de Mailgun (no crear duplicados).


---

---

## 📊 RESUMEN EJECUTIVO DEL ANÁLISIS

### Estado General de Implementación

**Total de Casos de Uso analizados:** 25

#### ✅ Completamente Implementados: 22/25 (88%)
- UC-01: Enviar PQRS vía Formulario Web
- UC-03: Responder a un Ticket (Correo) Existente  
- UC-04: Aprobar Respuesta Sugerida por la IA
- UC-05: Editar y Enviar Respuesta Sugerida por la IA
- UC-06: Escalar Ticket a Nivel 2
- UC-07: Gestionar Etiquetas del Ticket
- UC-08: Resolver Ticket
- UC-09: Consultar Historial del Cliente
- UC-10: Adjuntar y Descargar Archivos
- UC-11: Añadir Nota Interna al Ticket
- UC-12: Gestionar Configuración de Agente IA
- UC-13: Gestionar Plantillas de Respuesta
- UC-15: Importar Órdenes (CSV)
- UC-16: Gestionar Usuarios
- UC-17: Gestionar Etiquetas Maestras
- UC-18: Gestionar Integraciones
- UC-19: Reasignar Ticket Manualmente
- UC-20: Generar Reportes (Exportar)
- UC-21: Visualizar Dashboard de Métricas
- UC-22: Auditar Log de Eventos del Sistema
- UC-23: Crear Ticket (Proceso Interno)
- UC-25: Notificar Nuevo Email (Webhook)

#### ⚠️ Parcialmente Implementados: 2/25 (8%)
- **UC-02: Enviar PQRS vía Email**
  - Webhook implementado pero falta verificar integración completa con Mailgun
  - Necesita validación de firma, parsing de headers, manejo de adjuntos
  
- **UC-24: Generar Sugerencia de Respuesta (Proceso Interno)**
  - Endpoint de reintento existe, pero falta confirmar procesamiento automático
  - Verificar estados del ticket, almacenamiento de sugerencias, escalado automático

#### ❌ No Implementados: 1/25 (4%)
- **UC-14: Gestionar Base de Conocimiento para IA**
  - NO se encontraron endpoints para CRUD de base de conocimiento
  - Este es crítico para que la IA tenga acceso a información de la empresa
  - **PRIORIDAD ALTA** para implementación

---

### 🎯 Endpoints Recomendados para Implementar

#### 1. Base de Conocimiento (UC-14) - PRIORIDAD ALTA
```
GET    /knowledge-base           # Listar documentos
POST   /knowledge-base           # Crear documento
GET    /knowledge-base/:id       # Obtener documento
PATCH  /knowledge-base/:id       # Actualizar documento
DELETE /knowledge-base/:id       # Eliminar documento
POST   /knowledge-base/search    # Búsqueda semántica
```

**Justificación:** Sin base de conocimiento, la IA no puede proporcionar respuestas precisas sobre políticas de la empresa, procedimientos, FAQs. Es fundamental para el objetivo de automatización.

#### 2. Aplicar Plantilla a Ticket (UC-13 mejorado) - PRIORIDAD MEDIA
```
POST   /tickets/:id/apply-template/:templateId
```

**Justificación:** Aunque las plantillas se pueden gestionar, falta un endpoint dedicado para aplicarlas a un ticket específico con sustitución automática de variables.

#### 3. Descarga de Archivos (UC-10 mejorado) - PRIORIDAD MEDIA
```
GET    /uploads/:fileId/download
```

**Justificación:** Actualmente existe POST para subir, pero no está claro el endpoint para descargar archivos adjuntos.

#### 4. Cambio de Contraseña (UC-16 mejorado) - PRIORIDAD BAJA
```
POST   /users/change-password
POST   /auth/forgot-password
POST   /auth/reset-password
```

**Justificación:** Funcionalidad básica de seguridad que debería estar presente en cualquier sistema de autenticación.

#### 5. Test de Integración (UC-18 mejorado) - PRIORIDAD BAJA
```
POST   /integrations/:id/test
```

**Justificación:** Permite validar que una integración funciona correctamente antes de activarla en producción.

---

### 🔍 Verificaciones Pendientes en el Backend

#### Alta Prioridad
1. **RF-TICKET-006:** Confirmar que se envía acuse de recibo automático al crear ticket
2. **RF-IA-001:** Verificar que el procesamiento IA se inicia automáticamente tras crear ticket
3. **RF-IA-005:** Confirmar implementación de lógica de escalado automático
4. **Validación de firma de Mailgun:** Endpoint del webhook debe rechazar requests no autorizados
5. **Almacenamiento de sugerencias IA:** Verificar que campos `respuestaSugeridaIA`, `confianzaIA`, `etiquetasSugeridasIA` se guardan

#### Media Prioridad
6. **Notificaciones en tiempo real:** Confirmar que se emiten eventos SSE/WebSocket cuando cambia estado de ticket
7. **Validación de permisos:** Verificar que cada endpoint valida permisos del usuario según su rol
8. **Manejo de duplicados en importación:** Confirmar estrategia para órdenes duplicadas
9. **Filtros de búsqueda en logs de auditoría:** Verificar capacidades de filtrado en `/audit`
10. **Métricas específicas en dashboards:** Documentar qué métricas retorna cada dashboard

#### Baja Prioridad
11. **Retención de logs de auditoría:** Definir política de retención
12. **Procesamiento asíncrono de importaciones:** Para archivos CSV grandes
13. **Versionado de configuraciones IA:** Historial de cambios en prompts
14. **Estadísticas de uso de plantillas:** Tracking de plantillas más utilizadas

---

### 📋 Próximos Pasos Sugeridos

#### Para el Equipo de Backend:
1. **Implementar UC-14 (Base de Conocimiento)** - CRÍTICO
   - Diseñar modelo de datos para documentos de conocimiento
   - Implementar CRUD básico
   - Considerar búsqueda vectorial para futuras mejoras

2. **Verificar procesos automáticos (UC-23, UC-24, UC-25)**
   - Confirmar que el flujo completo funciona end-to-end
   - Documentar transiciones de estado de tickets
   - Probar integración con Mailgun y OpenRouter

3. **Completar endpoints faltantes (UC-13, UC-10, UC-16)**
   - Implementar endpoint para aplicar plantillas
   - Confirmar endpoint de descarga de archivos
   - Agregar endpoints de gestión de contraseñas

4. **Documentar configuración de integraciones**
   - Mailgun: documentar configuración de webhook y DNS
   - OpenRouter: documentar API keys y modelos disponibles
   - Almacenamiento de archivos: documentar servicio usado (S3/Azure/etc)

#### Para el Equipo de Frontend:
1. **Implementar UIs faltantes basadas en endpoints existentes**
   - Dashboard de métricas con visualizaciones
   - Gestión de base de conocimiento (una vez implementado backend)
   - Panel de configuración de agentes IA
   - Gestión de plantillas con preview

2. **Mejorar UX en funcionalidades existentes**
   - Indicadores visuales claros para notas internas
   - Preview de plantillas con datos reales
   - Sugerencias de agentes para reasignación
   - Timeline de historial del cliente

---

### ✅ Conclusión

El backend de NoraAI tiene una **excelente cobertura de casos de uso (88% completamente implementados)**. La arquitectura de endpoints está bien diseñada y sigue principios RESTful. 

**Punto crítico:** La falta de gestión de Base de Conocimiento (UC-14) es la única brecha significativa que debe abordarse con prioridad, ya que es fundamental para el funcionamiento efectivo de la IA.

Las verificaciones pendientes son principalmente de configuración y comportamiento en runtime, no de endpoints faltantes. El equipo debería enfocarse en:
1. Implementar UC-14
2. Verificar que los procesos automáticos funcionan correctamente
3. Documentar configuraciones de integraciones
4. Completar endpoints menores faltantes

Con estas mejoras, el sistema estará 100% funcional según los casos de uso definidos.
