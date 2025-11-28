// src/data/mockTickets.js

// Función auxiliar para calcular fechas dinámicas
const getDateForTicket = (daysAgo, hoursOffset = 0, minutesOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hoursOffset, minutesOffset, 0, 0);
  return date.toISOString();
};

export const mockTickets = [
  // =======================================================================
  // == TICKETS PARA UI-03: VISTA DE TRIAJE (ESTADO: ia_sugerido)          ==
  // =======================================================================
  {
    // CASO 1: WISMO de alta confianza, perfecto para aprobación en 1-clic.
    id: "TICKET-001",
    clienteId: "cli-002", // David Luna
    ordenId: "ORD-2023-001",
    asunto: "¿Dónde está mi pedido?",
    estado: "ia_sugerido",
    prioridad: "media",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(0, 10, 0),
    mensajes: [
      {
        id: "MSG-001",
        contenidoTexto:
          "Hola, hice un pedido hace unos días y quisiera saber dónde está. El número es ORD-2023-001. Gracias.",
        esNotaInterna: false,
        esAutomatico: false,
        enviadoEn: getDateForTicket(0, 10, 0),
        // --- DATOS DE LA IA ---
        respuestaSugeridaIA:
          "Hola David,\n\n¡Gracias por contactarnos! Tu pedido ORD-2023-001 está actualmente en tránsito con DHL. Puedes rastrearlo con el número de seguimiento: TRK123456789.\n\nSaludos,\nEl equipo de GearUp Gadgets",
        confianzaIA: 0.98,
        metaDatosIA: {
          agente: "ac-wismo-01",
          datosUsados: [
            "orden.estado",
            "orden.numeroSeguimiento",
            "orden.transportista",
          ],
          reasoning:
            'El cliente proporcionó un ID de orden válido. Se encontró la orden en estado "en_transito".',
        },
      },
    ],
    etiquetas: [{ id: "tag-wismo", nombre: "WISMO" }],
    archivos: [],
  },
  {
    // CASO 2: Devolución. Confianza media. Requiere revisión.
    id: "TICKET-002",
    clienteId: "cli-003", // Sofia Reyes
    ordenId: "ORD-2023-002",
    asunto: "Quiero devolver mi teclado",
    estado: "ia_sugerido",
    prioridad: "baja",
    canalOrigen: "formulario_web",
    creadoEn: getDateForTicket(0, 11, 30),
    mensajes: [
      {
        id: "MSG-002",
        contenidoTexto:
          "Hola, recibí el teclado pero no es lo que esperaba. ¿Cómo puedo hacer para devolverlo?",
        esNotaInterna: false,
        esAutomatico: false,
        enviadoEn: getDateForTicket(0, 11, 30),
        // --- DATOS DE LA IA ---
        respuestaSugeridaIA:
          "Hola Sofia,\n\nLamentamos que el producto no haya cumplido tus expectativas. Para iniciar una devolución, por favor visita nuestra política de devoluciones en [enlace] y asegúrate de que el producto esté en su empaque original. Tienes 30 días desde la recepción para solicitar un RMA.\n\nAvísanos si tienes otra duda.\nEl equipo de GearUp Gadgets",
        confianzaIA: 0.85,
        metaDatosIA: {
          agente: "ac-returns-01",
          datosUsados: ["baseConocimiento.politica_devoluciones"],
          reasoning:
            "Intención de devolución detectada. No se encontraron datos conflictivos.",
        },
      },
    ],
    etiquetas: [{ id: "tag-return", nombre: "RETURN" }],
    archivos: [],
  },
  {
    // CASO 3: Producto dañado CON sugerencia de fusión.
    id: "TICKET-005",
    clienteId: "cli-001", // Ana Torres
    ordenId: "ORD-2023-003",
    asunto: "AYUDA URGENTE!!!",
    estado: "ia_sugerido",
    prioridad: "alta",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(4, 14, 0),
    sugerenciaFusionId: "TICKET-004", // <-- ¡Sugerencia de Fusión!
    mensajes: [
      {
        id: "MSG-005",
        contenidoTexto:
          "Mi mouse no funciona, llegó roto. Exijo una solución ya.",
        esNotaInterna: false,
        esAutomatico: false,
        enviadoEn: getDateForTicket(4, 14, 0),
        // --- DATOS DE LA IA ---
        respuestaSugeridaIA:
          "Hola Ana,\n\nLamentamos profundamente escuchar que tu mouse llegó dañado. Para poder ayudarte de la manera más rápida, ¿podrías por favor adjuntar una foto del producto y del empaque? Con eso, podremos iniciar el proceso de reemplazo o reembolso de inmediato.\n\nQuedamos atentos,\nEl equipo de GearUp Gadgets",
        confianzaIA: 0.9,
        metaDatosIA: {
          agente: "ac-damaged-01",
          datosUsados: [],
          reasoning:
            "Palabras clave 'roto' y 'no funciona' detectadas. Tono de urgencia.",
          escalate: false, // La IA sugiere primero pedir fotos
        },
      },
    ],
    etiquetas: [{ id: "tag-damaged", nombre: "DAMAGED" }],
    archivos: [],
  },
  // =======================================================================
  // == TICKETS PARA UI-04: VISTA DE ESPECIALISTA (ESTADOS DE NIVEL 2)    ==
  // =======================================================================
  {
    // CASO 4: Escalado. Un caso complejo que la IA no pudo resolver.
    id: "TICKET-003",
    clienteId: "cli-002", // David Luna
    asunto: "Problema de compatibilidad con Macbook",
    estado: "escalado_nivel_2",
    prioridad: "alta",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(5, 15, 0),
    assigneeId: null, // Sin asignar, en la cola general.
    mensajes: [
      {
        id: "MSG-003-A",
        contenidoTexto:
          "Compré los Auriculares Pro XT2 pero el micrófono no funciona bien en mis llamadas de Zoom en mi Macbook M2. ¿Hay algún driver o configuración especial?",
        enviadoEn: getDateForTicket(5, 15, 0),
      },
      {
        id: "MSG-003-B",
        contenidoTexto:
          "Escalado por Brenda: La IA sugirió reiniciar el equipo, pero esto parece un problema de compatibilidad específico que requiere conocimiento técnico de Nivel 2.",
        esNotaInterna: true,
        enviadoEn: getDateForTicket(5, 15, 15),
      },
    ],
    etiquetas: [{ id: "tag-compat", nombre: "COMPATIBILITY" }],
    archivos: [],
  },
  {
    // CASO 5: Reclamo por producto dañado, ya asignado a Carlos.
    id: "TICKET-004",
    clienteId: "cli-001", // Ana Torres
    ordenId: "ORD-2023-003",
    asunto: "Mi mouse gamer llegó dañado",
    estado: "en_progreso_nivel_2",
    prioridad: "urgente",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(4, 9, 0),
    assigneeId: "f4e8d9c1-b3a5-4e7d-9f2a-1c8b6e5d7f4a", // Asignado a Carlos
    mensajes: [
      {
        id: "MSG-004",
        contenidoTexto:
          "¡Hola! Recibí mi pedido ORD-2023-003 y el mouse G502 tiene la rueda de scroll rota. Adjunto una foto.",
        enviadoEn: getDateForTicket(6, 9, 0),
      },
    ],
    etiquetas: [{ id: "tag-damaged", nombre: "DAMAGED" }],
    archivos: [
      {
        id: "FILE-001",
        nombreArchivo: "mouse-roto.jpg",
        urlAlmacenamiento:
          "https://via.placeholder.com/150/FF0000/FFFFFF?Text=IMG",
        tipoMime: "image/jpeg",
        tamano: 128,
      },
    ],
  },
  // =======================================================================
  // == TICKETS ADICIONALES PARA POBLAR DASHBOARDS (UI-01 y UI-02)         ==
  // =======================================================================
  {
    id: "TICKET-006",
    clienteId: "cli-003",
    asunto: "Re: Quiero devolver mi teclado",
    estado: "respuesta_cliente", // <- Estado para la cola "Respuestas de Clientes"
    prioridad: "media",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(5, 11, 30),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Asignado a Brenda
    mensajes: [
      {
        id: "MSG-006-A",
        contenidoTexto:
          "Hola, recibí el teclado pero no es lo que esperaba. ¿Cómo puedo hacer para devolverlo?",
        enviadoEn: getDateForTicket(6, 11, 30),
      },
      {
        id: "MSG-006-B",
        contenidoTexto: "Hola Sofia, aquí tienes el procedimiento...",
        enviadoEn: getDateForTicket(6, 11, 45),
      },
      {
        id: "MSG-006-C",
        contenidoTexto:
          "Gracias. Ya leí la política, pero no encuentro dónde generar la etiqueta de envío. ¿Me ayudan?",
        enviadoEn: getDateForTicket(6, 9, 0),
      },
    ],
    etiquetas: [{ id: "tag-return", nombre: "RETURN" }],
    archivos: [],
  },
  {
    id: "TICKET-007",
    clienteId: "cli-001",
    asunto: "Pregunta sobre garantía",
    estado: "cerrado", // Ticket resuelto
    resueltoEn: getDateForTicket(4, 18, 0),
    prioridad: "baja",
    canalOrigen: "formulario_web",
    creadoEn: getDateForTicket(6, 17, 0),
    assigneeId: "f4e8d9c1-b3a5-4e7d-9f2a-1c8b6e5d7f4a", // Resuelto por Carlos
    mensajes: [],
    etiquetas: [{ id: "tag-info", nombre: "INFO" }],
    archivos: [],
  },
  // =======================================================================
  // == TICKETS ADICIONALES PARA DASHBOARD DE BRENDA (FECHA DE HOY)        ==
  // =======================================================================
  {
    id: "TICKET-008",
    clienteId: "cli-002",
    asunto: "Consulta sobre envío",
    estado: "cerrado", // Ticket resuelto hoy
    resueltoEn: getDateForTicket(0, 14, 30),
    prioridad: "media",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(0, 9, 0),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Resuelto por Brenda hoy
    mensajes: [
      {
        id: "MSG-008",
        contenidoTexto: "¿Cuándo llegará mi pedido?",
        enviadoEn: getDateForTicket(0, 9, 0),
      },
    ],
    etiquetas: [{ id: "tag-shipping", nombre: "SHIPPING" }],
    archivos: [],
  },
  {
    id: "TICKET-009",
    clienteId: "cli-003",
    asunto: "Problema con mi pedido",
    estado: "ia_sugerido", // Ticket con sugerencia de IA
    prioridad: "alta",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(0, 8, 0),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Asignado a Brenda hoy
    mensajes: [
      {
        id: "MSG-009",
        contenidoTexto: "Mi pedido no llegó completo",
        enviadoEn: getDateForTicket(0, 8, 0),
        esNotaInterna: false,
        esAutomatico: false,
        // --- DATOS DE LA IA ---
        respuestaSugeridaIA:
          "Hola,\n\nLamentamos escuchar que tu pedido no llegó completo. Para poder ayudarte de la mejor manera, ¿podrías proporcionarnos el número de pedido y una lista de los artículos que faltan?\n\nCon esta información podremos investigar el problema y resolverlo lo antes posible.\n\nSaludos,\nEl equipo de GearUp Gadgets",
        confianzaIA: 0.88,
        metaDatosIA: {
          agente: "ac-shipping-01",
          datosUsados: ["baseConocimiento.politica_envios"],
          reasoning: "Problema de envío incompleto detectado. Se requiere información adicional del cliente.",
        },
      },
    ],
    etiquetas: [{ id: "tag-issue", nombre: "ISSUE" }],
    archivos: [],
  },
  {
    id: "TICKET-010",
    clienteId: "cli-001",
    asunto: "Solicitud de reembolso",
    estado: "cerrado", // Ticket resuelto hoy
    resueltoEn: getDateForTicket(0, 16, 0),
    prioridad: "media",
    canalOrigen: "formulario_web",
    creadoEn: getDateForTicket(0, 13, 0),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Resuelto por Brenda hoy
    mensajes: [
      {
        id: "MSG-010",
        contenidoTexto: "Quiero solicitar un reembolso",
        enviadoEn: getDateForTicket(0, 13, 0),
      },
    ],
    etiquetas: [{ id: "tag-refund", nombre: "REFUND" }],
    archivos: [],
  },
  {
    id: "TICKET-011",
    clienteId: "cli-002",
    asunto: "Pregunta sobre producto",
    estado: "ia_sugerido", // Ticket con sugerencia de IA
    prioridad: "baja",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(0, 12, 0),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Asignado a Brenda hoy
    mensajes: [
      {
        id: "MSG-011",
        contenidoTexto: "¿Tienen este producto en stock?",
        enviadoEn: getDateForTicket(0, 12, 0),
        esNotaInterna: false,
        esAutomatico: false,
        // --- DATOS DE LA IA ---
        respuestaSugeridaIA:
          "Hola,\n\nGracias por tu consulta. Para poder ayudarte mejor, ¿podrías indicarnos el nombre o código del producto que te interesa?\n\nUna vez que tengamos esa información, podremos verificar la disponibilidad y proporcionarte todos los detalles que necesites.\n\nSaludos,\nEl equipo de GearUp Gadgets",
        confianzaIA: 0.75,
        metaDatosIA: {
          agente: "ac-info-01",
          datosUsados: [],
          reasoning: "Consulta general sobre disponibilidad. Se requiere información del producto específico.",
        },
      },
    ],
    etiquetas: [{ id: "tag-question", nombre: "QUESTION" }],
    archivos: [],
  },
  {
    id: "TICKET-012",
    clienteId: "cli-003",
    asunto: "Re: Problema con mi pedido",
    estado: "esperando_cliente", // Ticket esperando respuesta del cliente
    prioridad: "media",
    canalOrigen: "correo",
    creadoEn: getDateForTicket(0, 7, 0),
    assigneeId: "c7b5a2e0-f2a8-4f7a-8b1e-9d2c5e6f8a3b", // Asignado a Brenda
    mensajes: [
      {
        id: "MSG-012-A",
        contenidoTexto: "Tengo un problema con mi pedido",
        enviadoEn: getDateForTicket(0, 7, 0),
      },
      {
        id: "MSG-012-B",
        contenidoTexto: "Hola, por favor proporciona más detalles...",
        enviadoEn: getDateForTicket(0, 7, 30),
      },
    ],
    etiquetas: [{ id: "tag-issue", nombre: "ISSUE" }],
    archivos: [],
  },
];
