## 4. Lógica de Negocio Detallada

Esta sección describe la lógica de estado y los flujos de trabajo complejos que gobiernan el comportamiento del sistema.

### 4.1. El Ciclo de Vida del Ticket: Flujo Detallado de Estados

Este es el corazón lógico del sistema. Cada transición está gatillada por un evento específico.

*   **(Evento: Cliente crea comunicación)** → **`nuevo`**
    *   **Descripción:** Un ticket virgen.
    *   **Lógica:** Creado por el webhook de email, formulario web, etc.
    *   **Siguiente Paso:** Entra automáticamente en la cola de procesamiento del worker de IA.

*   **`nuevo`** → **(Acción del Sistema: Worker IA)** → **`ia_sugerido`**
    *   **Descripción:** La IA ha analizado el ticket y generado una sugerencia.
    *   **Lógica:** El worker de IA puebla los campos `respuestaSugeridaIA`, etc. en el `Mensaje` original.
    *   **Siguiente Paso:** Aparece en la cola principal de "Triaje" para los agentes de Nivel 1.

*   **`ia_sugerido`** → **(Acción del Agente: Envía respuesta)** → **`esperando_cliente`**
    *   **Descripción:** Se ha dado una respuesta y ahora la pelota está en el tejado del cliente.
    *   **Lógica:** El agente aprueba, edita o escribe una respuesta. Se crea un `Mensaje` saliente.
    *   **Siguiente Paso:** El ticket sale de las colas activas. Se inicia un temporizador de inactividad (ej. 72 horas).

*   **`ia_sugerido`** → **(Acción del Agente: Escala)** → **`escalado_nivel_2`**
    *   **Descripción:** El agente de Nivel 1 determina que la sugerencia de la IA es incorrecta o el caso es demasiado complejo.
    *   **Lógica:** El agente hace clic en "Escalar". El estado del ticket cambia.
    *   **Siguiente Paso:** El ticket aparece en la cola de Nivel 2 (UI-04) para ser tomado por un especialista.

*   **`escalado_nivel_2`** → **(Acción del Agente N2: Toma el ticket)** → **`en_progreso_nivel_2`**
    *   **Descripción:** Un especialista ha reclamado el ticket y lo está trabajando activamente.
    *   **Lógica:** El agente de Nivel 2 usa la acción "Tomar Ticket". El ticket se le asigna.
    *   **Siguiente Paso:** El ticket permanece en este estado hasta que el especialista envíe una respuesta.

*   **`esperando_cliente`** → **(Evento: Cliente responde)** → **`respuesta_cliente`**
    *   **Descripción:** El cliente ha continuado la conversación.
    *   **Lógica:** El webhook de correo detecta una respuesta en un hilo existente (vía `In-Reply-To`).
    *   **Siguiente Paso:** El ticket aparece en una cola de alta prioridad para el `assigneeId`. **NO pasa por la IA de nuevo.**

*   **`esperando_cliente`** → **(Acción del Sistema: Inactividad)** → **`cerrado`**
    *   **Descripción:** El problema se considera resuelto por silencio del cliente.
    *   **Lógica:** Un cron job periódico busca tickets en `esperando_cliente` cuya `modificadoEn` sea mayor al umbral (ej. 72h). Para evitar condiciones de carrera (race conditions), esta transición debe ser atómica, usando una consulta condicional (ej. `UPDATE Ticket SET estado = 'cerrado' WHERE id = ? AND estado = 'esperando_cliente'`).
    *   **Siguiente Paso:** El ticket se archiva.

*   **`cerrado`** → **(Evento: Cliente responde - "Ticket Zombie")** → **`reabierto`**
    *   **Descripción:** Una alerta. Un problema que se creía resuelto no lo está.
    *   **Lógica:** El webhook de correo detecta una respuesta en un hilo de un ticket `cerrado`.
    *   **Siguiente Paso:** El ticket aparece en una cola especial de "Tickets Reabiertos" de alta visibilidad.

### 4.2. La Lógica de Fusión de Tickets: Manejo de Hilos Rotos

Este enfoque es de **asistencia inteligente**, no de automatización arriesgada.

#### Fase 1: El Algoritmo de Ingesta de Mensajes
Cuando el backend recibe un nuevo mensaje (ej. vía un webhook de email), ejecuta este flujo:
1.  **¿Es una Respuesta Directa?**
    *   Se analizan las cabeceras `In-Reply-To` / `References`.
    *   **SÍ:** Se encuentra el `ticketId` asociado. Se crea el `Mensaje` dentro de ese ticket y se actualiza su estado. Proceso finalizado.
    *   **NO:** Continuar.
2.  **¿Asunto Contiene un ID de Ticket (`#[0-9]+`)?**
    *   Se usa una expresión regular para buscar este patrón.
    *   **SÍ:** Se extrae el `ticketId`. Se crea el `Mensaje` y se actualiza el estado. Proceso finalizado.
    *   **NO:** Se asume que es un hilo nuevo. Se crea un `Ticket` con estado `nuevo` y se asocia el primer `Mensaje`. Continuar.
3.  **Disparar Job de Sugerencia de Fusión (Asíncrono)**
    *   Inmediatamente después de crear el nuevo ticket, se encola un job en segundo plano.
    *   El job ejecuta la siguiente heurística: *"Para este `clienteId`, busca otros tickets actualizados en las últimas 72 horas, cuyo estado NO sea `fusionado`."*
    *   **Si encuentra EXACTAMENTE 1 otro ticket:** Actualiza el ticket recién creado estableciendo su campo `sugerenciaFusionId` al ID del ticket encontrado y dispara el evento SSE `merge_suggestion_available`.
    *   **Si encuentra 0 o más de 1:** No hace nada.

#### Fase 2: La Experiencia del Agente (UI/UX y API)
1.  **Detección en el Frontend:**
    *   Al cargar un ticket (o al recibir el evento SSE), la app comprueba si `sugerenciaFusionId` tiene un valor.
    *   Si lo tiene, renderiza un componente de alerta:
        > 💡 **Sugerencia de Fusión:** Este ticket podría ser una continuación del **[Ticket #{sugerenciaFusionId}]**.
        > `[Ver Ticket Original]` `[Fusionar en Ticket Original]` `[Ignorar Sugerencia]`
2.  **Las Acciones del Agente y sus APIs:**
    *   **Botón `[Fusionar en Ticket Original]`:**
        *   **API Call:** `POST /api/tickets/{sugerenciaFusionId}/actions/merge` con `{ "sourceTicketId": "ID_DEL_TICKET_ACTUAL" }`
        *   **Lógica del Backend:**
            1.  Inicia una transacción de base de datos.
            2.  Reasigna todos los `Mensajes` del `sourceTicketId` al `targetTicketId`.
            3.  Cambia el estado del `sourceTicketId` a `fusionado`.
            4.  Actualiza el estado del `targetTicketId` (a `reabierto` o `respuesta_cliente` según corresponda).
            5.  **Crea un `LogEvento`** en el ticket objetivo para auditar la fusión.
            6.  Finaliza la transacción.
        *   **Resultado en Frontend:** Redirige al agente al ticket original, ahora actualizado.
    *   **Botón `[Ignorar Sugerencia]`:**
        *   **API Call:** `POST /api/tickets/{ID_DEL_TICKET_ACTUAL}/actions/dismiss-merge`
        *   **Lógica del Backend:** Pone `sugerenciaFusionId = NULL` en el ticket.
        *   **Resultado en Frontend:** El banner de alerta desaparece.
### 4.3. Caso de Uso Crítico: Gestión de Hilos Rotos y Tickets Reabiertos (Ejemplo End-to-End)

Este escenario práctico demuestra la resiliencia del sistema frente a un comportamiento común del cliente, validando la interacción entre el modelo de datos, la lógica de negocio, la API y la interfaz de usuario.

**Escenario:** Un cliente continúa una conversación creando un nuevo correo en lugar de responder al hilo existente.

1.  **Lunes, 10:00 AM:** Un cliente (`id: cli_abc`) envía un email con el asunto "Mi app no funciona". El sistema crea el **Ticket #123** con estado `nuevo`.
2.  **10:01 AM:** El worker de IA procesa el ticket, que pasa a estado `ia_sugerido`. La sugerencia de la IA se guarda en el primer mensaje del ticket.
3.  **10:05 AM:** La Agente Ana (Nivel 1) revisa la sugerencia, la edita y envía una respuesta solicitando más detalles. El ticket transita a estado `esperando_cliente`.
4.  **Jueves, 11:00 AM:** Transcurren más de 72 horas sin respuesta del cliente. Un cron job periódico detecta la inactividad y cambia automáticamente el estado del **Ticket #123** a `cerrado`.
5.  **Viernes, 9:00 AM:** El cliente, en lugar de responder al correo original, crea un **nuevo email** con el asunto "Sigue sin funcionar!!".

#### El Sistema en Acción: Lógica de Detección y Fusión

6.  **Recepción y Creación:**
    *   El webhook de Mailgun recibe el nuevo mensaje. El análisis de cabeceras no encuentra un `In-Reply-To` y el asunto no contiene el patrón `#[123]`.
    *   El sistema concluye que es un hilo nuevo y crea el **Ticket #124** para el cliente `cli_abc` en estado `nuevo`.
7.  **Job de Sugerencia Asíncrona:**
    *   Inmediatamente tras la creación del Ticket #124, se encola un job con la tarea: `suggestMerge('ticket_124', 'cli_abc')`.
    *   El job ejecuta la **heurística de fusión mejorada**: "Para el cliente `cli_abc`, buscar tickets actualizados en los últimos 7 días, excluyendo aquellos con estado `fusionado`".
    *   La búsqueda encuentra un único resultado: el **Ticket #123** (estado `cerrado`).
    *   El job actualiza el **Ticket #124** estableciendo su campo `sugerenciaFusionId = 'ticket_123'` y emite un evento `merge_suggestion_available` por SSE.
8.  **Intervención Humana Guiada (Triaje Nivel 1):**
    *   **9:15 AM:** El Agente Bruno, que está de turno, ve el **Ticket #124** aparecer en su cola de triaje (`ia_sugerido`).
    *   En la parte superior de la vista del ticket, la UI renderiza el banner de alerta:
        > 💡 **Sugerencia de Fusión:** Este ticket podría ser una continuación del **[Ticket #123]**. `[Ver Ticket Original]` `[Fusionar]` `[Ignorar]`
9.  **Ejecución de la Fusión:**
    *   Bruno hace clic en el botón `[Fusionar]`.
    *   El frontend ejecuta la llamada a la API: `POST /api/v1/tickets/123/actions/merge` con el payload `{ "sourceTicketId": "124" }`.
10. **Resultado y Consolidación del Contexto:**
    *   El backend ejecuta la lógica de fusión en una transacción:
        1.  Mueve los mensajes y archivos del Ticket #124 al Ticket #123.
        2.  Cambia el estado del Ticket #124 a `fusionado`.
        3.  Cambia el estado del Ticket #123 de `cerrado` a `reabierto`.
        4.  Asegura que la asignación del Ticket #123 se mantenga con la dueña original (Ana).
    *   Bruno es redirigido automáticamente a la vista del **Ticket #123**, que ahora:
        *   Contiene la conversación completa y cronológica.
        *   Aparece en la cola de "Reabiertos", señalando alta prioridad.
        *   Permanece asignado a la Agente Ana, que tiene todo el contexto para continuar.

**Conclusión del Caso de Uso:** El sistema ha gestionado con éxito un hilo roto y un ticket zombie, evitando la creación de información duplicada y proveyendo todo el contexto histórico al agente correcto de forma eficiente.

#### Impacto en la Arquitectura y el Plan de Pruebas

Este caso de uso valida directamente la necesidad y el diseño de:

*   **Schema de BD:** Los campos `sugerenciaFusionId` en `Ticket` y los estados `fusionado` y `reabierto` en `EstadoTicket` son indispensables.
*   **API:** El endpoint `POST /.../actions/merge` es la implementación técnica de esta lógica de negocio.
*   **UI:** El banner de sugerencia en la **UI-03** es la pieza clave que permite la intervención humana informada.
*   **Testing:** Este flujo exacto debe ser replicado en una prueba End-to-End (`Test E: Fusión de Hilos Rotos`) para garantizar su correcto funcionamiento de forma continua.