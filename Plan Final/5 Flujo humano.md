### 5. Flujo de Intervención Humana (UI del Agente)
La interfaz de usuario está diseñada para que Brenda y Carlos puedan procesar tickets de forma rápida y contextual, dividiendo las responsabilidades entre triaje (Nivel 1) y resolución especializada (Nivel 2).

#### 5.1. Interfaz de Triaje (Nivel 1)
1.  **Cola de Tickets:** La vista principal mostrará la lista de tickets en estado `ia_sugerido`. Cada ítem destacará la categoría, urgencia y nivel de confianza (`confianzaIA`) sugeridos por la IA.
2.  **Panel de Decisión:** Al abrir un ticket, se presenta una vista dividida:
    *   **Izquierda:** Historial de la conversación y archivos adjuntos.
    *   **Derecha:** La propuesta completa de la IA (obtenida del `Mensaje` más reciente: `respuestaSugeridaIA`, etiquetas modificables, confianza) y, si aplica, la información de la orden vinculada y un acceso rápido al historial del cliente.
3.  **Acciones Rápidas:**
    *   **Aprobar y Enviar (1-clic):** Envía la respuesta y actualiza el estado del ticket.
    *   **Editar y Enviar:** Permite modificar la respuesta antes de enviarla.
    *   **Escalar a Cola General:** Cambia el estado del ticket a `escalado_nivel_2`, moviéndolo a la cola de Nivel 2.
    *   **Reasignar a Agente:** Abre un selector para asignar el ticket directamente a otro agente de Nivel 2.

#### 5.2. Interfaz de Resolución para Especialistas (Nivel 2)
El personal de Nivel 2 tiene dos modos de visualización para trabajar con los tickets en estado `escalado_nivel_2`.
1.  **Vista de Tabla:** Una vista tradicional tipo lista o Kanban donde pueden ver todos los tickets asignados, ordenarlos por prioridad, filtrarlos y elegir en cuál trabajar.
2.  **Vista de Flujo Continuo:** Un modo de alta productividad. Al activarlo, el sistema presenta los tickets uno por uno según una lógica de prioridad. Cuando terminan y envían uno, el siguiente aparece automáticamente.

#### 5.3. Lógica de la Cola en la "Vista de Flujo Continuo"
Para asegurar que se atiendan tanto los tickets urgentes como los de menor prioridad, el sistema sigue un ciclo predefinido:
1.  **Ciclo de Prioridad:** El sistema sirve los tickets en este orden: 4 de prioridad Urgente, 3 de prioridad Alta, 2 de prioridad Media, y 1 de prioridad Baja.
2.  **Repetición del Ciclo:** Una vez completado, el ciclo vuelve a empezar.
3.  **Manejo de Colas Vacías:** Si una categoría no tiene suficientes tickets, el sistema procesa los que hay y pasa inmediatamente a la siguiente categoría.
4.  **Manejo de Nuevos Tickets Urgentes:** Si un nuevo ticket "Urgente" llega mientras un agente está trabajando, no se interrumpe el trabajo actual. El nuevo ticket será atendido en el siguiente ciclo.
5.  **Soporte de API:** Esta lógica será encapsulada en un endpoint de API dedicado (`GET /tickets/next-in-flow`) para simplificar el frontend.
