## Plan de Acción Final: Asistente de Soporte al Cliente Inteligente (NoraAI) para GearUp Gadgets

Este documento consolida todas las decisiones del proyecto, estableciendo un plan de acción definitivo para un MVP (Producto Mínimo Viable) single-tenant, enfocado en funcionalidad, uso de herramientas gratuitas y entrega en un plazo académico de dos meses para un equipo de tres personas.

### 1. Resumen Ejecutivo del Proyecto
*   **Nombre del Proyecto:** Asistente de Soporte al Cliente Inteligente (NoraAI).
*   **Propósito Principal:** Construir una aplicación web para "GearUp Gadgets", una empresa ficticia de e-commerce, que automatiza el soporte al cliente. El sistema ingesta tickets vía email y un formulario web público, genera respuestas automáticas con un agente LLM configurable, y permite la supervisión y escalado a un agente humano a través de un dashboard.
*   **Público Objetivo (Problema de Negocio):** El equipo de soporte de GearUp Gadgets (compuesto por dos agentes, "Brenda" y "Carlos") está sobrecargado respondiendo las mismas cuatro preguntas repetitivas:
    1.  **"¿Dónde está mi pedido?" (WISMO):** La consulta más frecuente.
    2.  **"¿Cómo devuelvo este producto?":** Preguntas sobre el proceso de RMA.
    3.  **"¿Este accesorio es compatible con mi dispositivo?":** Consultas de pre-venta.
    4.  **"Mi producto llegó dañado":** Reclamos que requieren gestión de fotos y reemplazos.
    El objetivo del MVP es darle a Brenda y Carlos un "superpoder" para despachar el 80% de estos tickets con un solo clic, sin reemplazarlos.
*   **Alcance del MVP (Enfoque Pragmático):**
    El diseño de este proyecto es ambicioso para un equipo de tres personas en un plazo limitado. La orquestación de múltiples servicios, la creación de artefactos académicos y el desarrollo de código funcional en paralelo representa un riesgo alto. Por ello, el alcance se ha definido con un enfoque pragmático para garantizar la entrega, priorizando la evidencia reproducible sobre la complejidad de la infraestructura.
    *   **Funcionalidades Imprescindibles (En Alcance):**
        1.  **Recepción de Tickets:** Webhook de Mailgun (apoyado por modo `console-mail` para desarrollo) y un formulario web público.
        2.  **Importación de Datos:** Carga de órdenes vía archivo CSV con una interfaz de previsualización.
        3.  **Dashboard del Agente:** Flujo central de listar tickets, ver la propuesta del LLM (mock) y el ciclo de "Aprobar/Editar y Enviar".
        4.  **Integración con LLM:** Implementación de la conexión con OpenRouter para demostrar la capacidad técnica, aunque la demo principal utilice mocks locales.
        5.  **Autenticación:** Sistema de login y roles gestionado con Supabase Auth.
        6.  **Reportes Básicos:** Exportación a CSV y un reporte simple en formato HTML.
        7.  **Artefactos Académicos:** Toda la documentación requerida (BPMN, ERD, SRS, manuales) es crítica para la evaluación.
    *   **Funcionalidades Postergadas (Fuera del Alcance del MVP):**
        1.  **Integraciones Avanzadas:** La conexión con WhatsApp, n8n y conectores directos a plataformas de e-commerce (Shopify, Magento) quedan para una Fase 2.
        2.  **Generación de PDF:** Se elimina del alcance del MVP. Si se necesita un ejemplo, se generará localmente.
