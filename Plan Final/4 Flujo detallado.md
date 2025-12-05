### 4. Flujo de Trabajo Detallado
Este flujo optimiza el tiempo de respuesta y la eficiencia del equipo de soporte, utilizando agentes de IA para el trabajo preliminar y personal humano para la validación y resolución de casos complejos.

#### 4.1. Fase 1: Recepción y Acuse de Recibo (100% Automático)
1.  **Entrada del Cliente:** El usuario envía su solicitud a través de un formulario web o por correo electrónico (ej. `soporte@gearup.com`).
2.  **Procesamiento de Entrada:** El sistema recibe la solicitud (vía webhook de Mailgun o endpoint del formulario). Para los emails, el sistema primero determina si es una respuesta a una conversación existente (analizando `In-Reply-To` o un ID de ticket en el asunto) o un email completamente nuevo.
    *   **Si es una respuesta:** Agrega el contenido como un nuevo `mensaje` al `ticket` existente.
    *   **Si es nuevo:** Identifica o crea un `cliente`, genera un nuevo `ticket` con `estado = 'nuevo'`, y dispara el acuse de recibo.
3.  **Respuesta Automática Inmediata (para tickets nuevos):** Inmediatamente después de la creación de un nuevo ticket, se envía una plantilla de correo al cliente confirmando la recepción y estableciendo una expectativa de tiempo de respuesta (ej. "Hemos recibido tu solicitud y te daremos una respuesta en menos de 2 horas"). Este mensaje se registra en la tabla `Mensaje`.

#### 4.2. Fase 2: Procesamiento y Enriquecimiento con IA (100% Automático)
Una vez creado el ticket, se encola un job para ser procesado por el **Motor de Inteligencia Artificial**, compuesto por varios agentes especializados.
1.  **Análisis Inicial:**
    *   **Agente de Análisis:** Lee el mensaje inicial del cliente para identificar la intención, el sentimiento, las palabras clave y la posible urgencia.
    *   **Agente de Categorización:** Asigna una categoría preliminar al ticket (ej. `etiqueta` "WISMO", "RETURN").
2.  **Generación de Solución:**
    *   **Agente de Conocimiento:** Basado en la categoría, busca en la `BaseConocimiento` y la información de la `Orden` (si está vinculada) para formular una respuesta sugerida.
    *   **Agente de Confianza:** Evalúa la respuesta sugerida y le asigna un nivel de confiabilidad (ej. 95%).
3.  **Consolidación y Actualización del Ticket:**
    *   **Agente Orquestador:** Recopila la información de los agentes anteriores y actualiza el **registro del `Mensaje` original del cliente** con la propuesta de respuesta y sus metadatos (`respuestaSugeridaIA`, `confianzaIA`, `metaDatosIA`), creando un historial de auditoría claro.
    *   Finalmente, actualiza el estado del ticket a `ia_sugerido` y notifica al frontend para que aparezca en la cola de triaje.

#### 4.3. Fase 3: Triaje y Validación Humana (Nivel 1)
Aquí interviene una persona (ej. Brenda) para garantizar la calidad antes de que la respuesta llegue al cliente.
1.  **Cola de Triaje:** El agente de Nivel 1 ve una cola de tickets en estado `ia_sugerido`.
2.  **Punto de Decisión Rápida:** Al seleccionar un ticket, el agente tiene tres opciones principales:
    *   **Aprobar y Enviar:** Si la respuesta sugerida por la IA (asociada al último mensaje del cliente) es correcta, la aprueba con un solo clic. El sistema crea un nuevo `mensaje` de salida, guarda el ID del agente en `aprobadoPorUsuarioId` y cambia el estado del ticket a `esperando_cliente` o `cerrado`.
    *   **Escalar a Cola General:** Si la respuesta es incorrecta o el caso es complejo, el agente escala el ticket. Esto cambia el estado del ticket a `escalado_nivel_2`, enviándolo a la cola de especialistas de Nivel 2.
    *   **Reasignar a Agente Específico:** Si el agente de triaje sabe quién es la persona ideal para resolver el caso, puede asignarlo directamente a un agente específico de Nivel 2, registrando la asignación en el historial del ticket.

#### 4.4. Fase 4: Resolución por Especialistas (Nivel 2)
Los tickets en estado `escalado_nivel_2` llegan al personal especializado (ej. Carlos).
1.  **Asignación de Tickets:** La asignación puede ser por especialidad o carga de trabajo. Cuando un especialista toma un ticket (acción de "Reclamar" o "Tomar"), su estado cambia a `en_progreso_nivel_2` para indicar que está siendo trabajado activamente.
2.  **Resolución:** El especialista de Nivel 2 trabaja en el ticket utilizando herramientas más avanzadas y su conocimiento experto para resolver el problema del cliente, enviando una respuesta manual.

#### 4.5. Estrategia de Integración con Órdenes
Para que el agente pueda responder preguntas de tipo WISMO, necesita acceso a la información de los pedidos. Se implementarán las siguientes opciones en orden de prioridad:
*   **MVP Rápido (Importación CSV):**
    *   **UI/UX:** Se implementará una interfaz que permita subir un archivo CSV, previsualizar el mapeo de columnas (ej. `columna X` → `campo Y`), validar los datos mostrando errores por fila y finalmente iniciar la importación. Al finalizar, se mostrará un reporte con `registros_importados`, `registros_omitidos` y un enlace para descargar un `errores.csv`.
    *   **Backend:** Se adoptará una política de **"procesamiento por fila con tolerancia a fallos"**. El job de importación procesará cada fila de forma independiente; si una fila falla la validación o inserción, se registrará el error para el reporte final sin detener la importación del resto de filas válidas.
*   **Mejorado (Post-MVP):** Un conector vía API a plataformas como Shopify o Magento (usando OAuth o una API Key) que pueble y actualice la tabla `ordenes` automáticamente.
*   **Futuro (Post-MVP):** Implementación de webhooks desde la plataforma de e-commerce para recibir actualizaciones en tiempo real sobre el estado de los pedidos y el tracking.

#### 4.6. Lógica del Motor de IA y Reglas Automáticas

##### 4.6.1. Configuraciones de Agente Especializadas (Seeds)

En lugar de un único prompt genérico, el sistema utilizará configuraciones de agente especializadas que actúan como el "Agente de Conocimiento" para cada tipo de consulta, permitiendo respuestas más precisas. A continuación se detallan los cuatro perfiles iniciales, listos para ser insertados como seeds en la tabla `ConfigAgente`.

*   **1. WISMO - ¿Dónde está mi pedido? (`id: ac-wismo-01`)**
    *   **Prompt Base:** `Eres un asistente de soporte de GearUp Gadgets. El cliente pregunta por el estado de su pedido. Si tienes número de orden o tracking, incluye carrier, número de tracking y fecha estimada de entrega. Si no hay tracking, pide información mínima (número de orden). Responde en español, tono amable y conciso, máximo 5 frases. Devuelve JSON: {"reply_text":"...","escalate":false,"confidence":0.0,"suggested_tags":["WISMO"]}. Si el pedido parece perdido o tracking failed, marca escalate=true y explica por qué.`
    *   **Umbral de Confianza:** 0.9

*   **2. Devoluciones - Proceso y RMA (`id: ac-returns-01`)**
    *   **Prompt Base:** `Eres un asistente de soporte de GearUp Gadgets. El cliente pregunta cómo devolver un artículo. Explica brevemente el paso a paso para iniciar la devolución (plazo, condiciones, enlace a política), cuándo se emitirá el RMA y tiempos estimados de reembolso o reenvío. Si falta información crítica (número de orden, motivo), pídela. Responde en español y en formato JSON: {"reply_text":"...","escalate":false,"confidence":0.0,"suggested_tags":["RETURN"]}. Si el cliente exige reembolso inmediato o hay señales de fraude, sugiere escalate=true.`
    *   **Umbral de Confianza:** 0.8

*   **3. Compatibilidad de producto (`id: ac-compat-01`)**
    *   **Prompt Base:** `Eres un asistente de soporte técnico de GearUp Gadgets. El cliente pregunta si un accesorio es compatible con su dispositivo. Si el cliente menciona modelo exacto, compara con la base de datos de productos (si está disponible) y responde sí/no con una breve explicación técnica. Si no menciona el modelo, solicita el modelo exacto y ofrece preguntas de aclaración. Responde en español y devuelve JSON: {"reply_text":"...","escalate":false,"confidence":0.0,"suggested_tags":["COMPATIBILITY"]}. Si la compatibilidad es incierta o riesgo alto, sugiere escalate=true.`
    *   **Umbral de Confianza:** 0.75

*   **4. Producto dañado (`id: ac-damaged-01`)**
    *   **Prompt Base:** `Eres un asistente de soporte de GearUp Gadgets. El cliente reporta producto dañado. Pide fotos y detalles (número de orden, fecha de recepción). Ofrece opciones: reenvío o reembolso, y explica pasos para RMA. Si hay foto adjunta o lenguaje urgente ("no funciona", "dañado"), marca escalate=true y explica razón. Responde en español y devuelve JSON: {"reply_text":"...","escalate":true_or_false,"confidence":0.0,"suggested_tags":["DAMAGED"]}. Prioriza escalado si hay evidencia visual.`
    *   **Umbral de Confianza:** 0.85
##### 4.6.2. Heurística de Escalado Automático
El sistema aplicará estas reglas para decidir si un ticket requiere atención humana inmediata:
*   **Auto-escalado si:**
    *   La respuesta del LLM indica explícitamente que se debe escalar (`llmResponse.escalate === true`).
    *   La confianza del LLM (`llmResponse.confidence`) es menor al umbral configurado (`config_agente.umbralConfianza`).
    *   El texto del mensaje contiene palabras clave de alta sensibilidad como "dañado", "no funciona", "reembolso", "legal" o "no enciende".
    *   El ticket contiene adjuntos que son identificados como imágenes (`tipoMime` `image/*`). Al detectar fotos, el sistema debe escalar el ticket y puede sugerir un checklist de acciones al agente humano.
*   **Modo de Operación:**
    *   `always_manual` (**Requerido para el MVP**): Todas las propuestas del agente LLM requerirán aprobación humana antes de ser enviadas. Este enfoque garantiza el control total y minimiza los riesgos durante la fase inicial.
