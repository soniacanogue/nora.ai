## 3. Interfaces de Comunicación (COM)

Estas interfaces definen cómo nuestro sistema se comunica con servicios externos (webhooks, emails) y cómo sus componentes internos se comunican entre sí en tiempo real.

### A. Comunicaciones Externas (Hacia/Desde el Mundo)

#### COM-01: Webhook de Email Entrante (Mailgun)
*   **Tipo:** Entrada (Inbound).
*   **Proveedor:** Mailgun.
*   **Endpoint en nuestro sistema:** `POST /webhooks/mailgun/inbound`
*   **Contrato de Payload (Esperado de Mailgun):**
    *   El backend debe estar preparado para parsear un `multipart/form-data` que contiene:
        *   `from`: Correo del remitente.
        *   `recipient`: Correo al que se envió (ej. `soporte@gearup.com`).
        *   `subject`: Asunto del correo.
        *   `body-plain`: Cuerpo del texto plano.
        *   `stripped-html`: Cuerpo del HTML sin las respuestas anteriores.
        *   `attachment-count`: Número de adjuntos.
        *   `attachment-x`: Archivos adjuntos (donde x es un número).
        *   `In-Reply-To`, `References`: Cabeceras clave para identificar si es una respuesta a un hilo existente.
        *   `Message-ID`: Identificador único del mensaje, provisto por el servidor de correo.
*   **Lógica Crítica:** Para garantizar la idempotencia y evitar la creación de mensajes duplicados por reintentos del webhook, el handler extraerá la cabecera `Message-ID` única de Mailgun y la guardará en el campo `fuenteMessageId` del nuevo registro de `Mensaje`. Una violación de la restricción de unicidad en la base de datos indicará que el mensaje ya fue procesado, permitiendo al sistema ignorar el duplicado de forma segura.

#### COM-02: Emails Transaccionales Salientes (Ref: UI-13)
*   **Tipo:** Salida (Outbound).
*   **Proveedor:** Mailgun (o similar).
*   **Disparadores:** Acciones dentro del sistema.
*   **Plantillas Clave y Variables Requeridas:**
    1.  **Acuse de Recibo:**
        *   **Disparador:** Creación de un nuevo ticket desde cualquier canal.
        *   **Variables:** `{{ticket.id}}`, `{{cliente.nombre}}`.
    2.  **Respuesta del Agente:**
        *   **Disparador:** `POST /tickets/:id/actions/approve` o `POST /tickets/:id/messages`.
        *   **Variables:** `{{ticket.id}}`, `{{agente.nombre}}`, `{{mensaje.cuerpo}}`.
    3.  **Notificación de Cierre:**
        *   **Disparador:** Cambio de estado del ticket a `cerrado`.
        *   **Variables:** `{{ticket.id}}`, `{{cliente.nombre}}`.
    4.  **Notificación de Reapertura:**
        *   **Disparador:** El cliente responde a un ticket cerrado.
        *   **Variables:** `{{ticket.id}}`, `{{cliente.nombre}}`.

### B. Comunicaciones Internas (Dentro del Sistema)

#### COM-03: Eventos en Tiempo Real al Frontend (Server-Sent Events)
*   **Tipo:** Comunicación Servidor -> Cliente.
*   **Tecnología:** Server-Sent Events (SSE) es ideal por su simplicidad para notificaciones unidireccionales.
*   **Propósito:** Notificar a las UIs de los agentes sobre cambios relevantes sin necesidad de que el usuario refresque la página, mejorando drásticamente la experiencia operativa.
*   **Canales/Eventos Clave:**
    *   `event: new_ticket_for_triage`
        *   **Datos:** `{ "ticketId": "...", "subject": "...", "confidence": 0.95 }`
        *   **UI Afectada:** UI-03 (para añadir el ticket a la cola).
    *   `event: ticket_assigned_to_me`
        *   **Datos:** `{ "ticketId": "...", "subject": "...", "priority": "alta" }`
        *   **UI Afectada:** UI-02 (para mostrar una notificación emergente y actualizar el contador de la cola).
    *   `event: customer_replied`
        *   **Datos:** `{ "ticketId": "...", "subject": "..." }`
        *   **UI Afectada:** UI-02 (para actualizar la actividad reciente y notificar al agente).
    *   `event: import_job_update`
        *   **Datos:** `{ "jobId": "...", "status": "processing", "progress": 75 }`
        *   **UI Afectada:** UI-05 (para actualizar la barra de progreso).
    *   `event: ticket_reopened`
        *   **Datos:** `{ "ticketId": "...", "assigneeId": "..." }`
        *   **UI Afectada:** UI-02 (Notificación y actualización del contador de la cola "Reabiertos").
    *   `event: merge_suggestion_available`
        *   **Datos:** `{ "ticketId": "...", "suggestedMergeWith": "..." }`
        *   **UI Afectada:** UI-03/04 (Para renderizar el banner de sugerencia de fusión).

---
