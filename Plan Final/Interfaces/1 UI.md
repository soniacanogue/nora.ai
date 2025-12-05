## 1. Interfaces de Usuario (UI)

Las interfaces de usuario son el corazón de la experiencia para Brenda y Carlos. Deben ser diseñadas para la máxima eficiencia y claridad.

**Enfoque de Dashboards por Rol (Decisión MVP):**
Para el MVP, se ha decidido implementar **Paneles Fijos por Rol (Role-Based Dashboards)**. Esto significa que el sistema presentará un conjunto de gráficas y métricas predefinidas y optimizadas para cada rol (Administrador y Agente), sin ofrecer personalización por parte del usuario final. Este enfoque (Nivel 1) ofrece el máximo valor para la demo con una complejidad técnica baja, evitando el riesgo de implementar paneles configurables por el usuario (Nivel 2), que exceden el alcance de este proyecto.

### UI-01: Dashboard del Administrador (Vista Estratégica)
*   **Estado:** Aprobado y Detallado.
*   **Propósito Principal:** Monitorear la salud general del sistema de soporte, identificar cuellos de botella y medir el rendimiento del equipo desde una vista de alto nivel.
*   **Componentes Clave:**
    *   **Widget 1: KPIs Generales (Hoy/Últimos 7 días):**
        *   Tickets Creados
        *   Tickets Resueltos
        *   Tiempo Medio de Primera Respuesta
        *   Tiempo Medio de Resolución
        *   *Fuente de datos: Vista `AgregadoDiarioTicket`.*
    *   **Widget 2: Carga de Trabajo Actual:**
        *   Gráfico de barras mostrando el número de tickets en cada estado (`nuevo`, `ia_sugerido`, `escalado_nivel_2`, `cerrado`).
        *   *Fuente de datos: Query `count` y `groupBy` sobre la tabla `Ticket`.*
    *   **Widget 3: Rendimiento del Equipo:**
        *   Tabla simple mostrando: `Agente`, `Tickets Asignados`, `Tickets Resueltos Hoy`.
        *   *Fuente de datos: Query `count` y `groupBy` sobre la tabla `Ticket` por `assigneeId`.*
    *   **Widget 4: Distribución de Tickets:**
        *   Gráfico de pastel por `Canal` (Email, Web, etc.).
        *   Gráfico de pastel por `Etiqueta` (WISMO, Devolución, etc.).
        *   *Fuente de datos: Query `count` y `groupBy` sobre la tabla `Ticket`.*

### UI-02: Dashboard del Agente (Vista Táctica y Operativa)
*   **Estado:** Aprobado y Detallado.
*   **Propósito Principal:** Permitir al agente entender su carga de trabajo personal de un vistazo, medir su propio rendimiento y acceder rápidamente a sus colas de trabajo.
*   **Componentes Clave:**
    *   **Widget 1: Mis Métricas (Hoy):**
        *   Mis Tickets Resueltos
        *   Mis Tickets Asignados
        *   Mi Tiempo Promedio de Respuesta
        *   *Fuente de datos: Query filtrada por `assigneeId` en la tabla `Ticket`.*
    *   **Widget 2: Mis Colas de Trabajo:**
        *   Tarjetas de acceso rápido con contadores, mostrando las colas más importantes:
            *   `[X] Tickets Reabiertos` (Máxima prioridad)
            *   `[Y] Respuestas de Clientes`
            *   `[Z] Tickets para Triaje (Nivel 1)`
            *   `[A] Mis Tickets Escalados (Nivel 2)`
            *   `[B] Esperando Respuesta del Cliente`
        *   *Fuente de datos: Queries `count` específicas por estado (`reabierto`, `respuesta_cliente`, etc.).*
    *   **Widget 3: Actividad Reciente en Mis Tickets:**
        *   Una lista simple de notificaciones: "El cliente de Ticket #123 ha respondido", "Se te ha asignado el Ticket #456".
        *   *Fuente de datos: Tabla `LogEvento` filtrada por tickets asignados al agente.*

### UI-03: Vista de Triaje de Agente (Nivel 1)
*   **Estado:** Aprobada y Detallada.
*   **Propósito Principal:** Permitir al agente de Nivel 1 (Brenda) procesar las sugerencias de la IA a la máxima velocidad posible, actuando como un validador humano.
*   **Componentes Clave:**
    1.  **Cola de Tickets (`ia_sugerido`):**
        *   Una lista de tickets. Cada fila debe mostrar: `Asunto`, `Cliente`, `ConfianzaIA` (ej. "95%"), `Etiquetas Sugeridas` ("WISMO") y un indicador visual de urgencia.
        *   La lista debe estar **ordenada por defecto por `confianzaIA` descendente**, para que el agente revise primero las sugerencias más seguras.
    2.  **Panel de Decisión (Vista Dividida):**
        *   **Izquierda (Contexto):** Historial completo de la conversación, archivos adjuntos visibles y un panel con la información clave de la `Orden` vinculada (estado, tracking, artículos).
        *   **Derecha (Acción):**
            *   **Banner de Sugerencia de Fusión:** Si `sugerenciaFusionId` existe, mostrar una alerta prominente con acciones para fusionar o ignorar.
            *   **Editor de Texto:** Pre-cargado con el contenido de `respuestaSugeridaIA` (del último mensaje del cliente).
            *   **Panel de Metadatos de IA:** Muestra `confianzaIA`, `metaDatosIA` (el "porqué" de la IA) y las etiquetas sugeridas.
            *   **Botones de Acción Rápida:**
                *   `[✅ Aprobar y Enviar]`
                *   `[✏️ Editar y Enviar]`
                *   `[➡️ Escalar a Nivel 2]`
                *   `[👤 Reasignar a...]` (con un selector de agentes)

### UI-04: Vista de Especialista de Agente (Nivel 2)
*   **Estado:** Aprobada y Detallada.
*   **Propósito Principal:** Proveer a los agentes de Nivel 2 (Carlos) una vista clara de los casos complejos que requieren intervención manual, con herramientas para una resolución eficiente.
*   **Componentes Clave:**
    1.  **Vista de Cola (Tabla):**
        *   Muestra tickets con estado `escalado_nivel_2` y `en_progreso_nivel_2`.
        *   Columnas: `Prioridad`, `Asunto`, `Cliente`, `Agente Asignado`, `Fecha de Creación`.
        *   Funcionalidades: Filtrado por etiqueta, búsqueda y ordenamiento.
    2.  **Modo "Flujo Continuo" (Opcional pero recomendado):**
        *   Un botón para activar/desactivar este modo.
        *   Al activarse, la UI presenta un ticket a la vez, siguiendo la **lógica de la cola de prioridad** definida en la sección `5.3` del plan (4 Urgentes, 3 Altas, etc.).
        *   Tras resolver un ticket (enviar mensaje o cerrar), el siguiente aparece automáticamente.

### UI-05: Interfaz de Importación de CSV
*   **Estado:** Aprobada y Detallada.
*   **Propósito Principal:** Permitir la carga masiva de datos de `Ordenes` de forma sencilla y a prueba de errores, un requisito clave para que el agente de IA pueda responder a consultas "WISMO".
*   **Componentes Clave (Flujo en 3 pasos):**
    1.  **Paso 1: Subida de Archivo:**
        *   Un componente de "arrastrar y soltar" o un selector de archivos para el CSV.
    2.  **Paso 2: Mapeo y Previsualización:**
        *   El sistema lee las cabeceras del CSV y muestra una tabla con las primeras 5-10 filas.
        *   Para cada columna de la base de datos (`estado`, `numeroSeguimiento`, etc.), se muestra un menú desplegable para que el usuario seleccione la columna correspondiente del CSV.
    3.  **Paso 3: Validación e Importación:**
        *   Al hacer clic en "Importar", se realiza una validación en el frontend (con `Papaparse`) para errores de formato básicos.
        *   Se envía el archivo al backend. La UI muestra una barra de progreso.
        *   Al finalizar, se muestra un resumen: `Registros importados`, `Registros omitidos` y un enlace para descargar un `errores.csv` si los hubo.

### A. Interfaces de Configuración y Administración del Sistema

Estas son las palancas y diales que el administrador usará para ajustar el comportamiento del sistema, especialmente el del motor de IA. Son el "panel de control del superpoder".

#### UI-06: Gestión del Agente de IA (`ConfigAgente`)
*   **Estado:** **Crítica para la Flexibilidad.**
*   **Propósito Principal:** Permitir a un administrador (o a un desarrollador en la fase inicial) **ajustar y mejorar los prompts y las reglas del agente de IA** sin necesidad de redesplegar el código. La calidad de las respuestas de la IA dependerá 100% de esta configuración.
*   **Componentes Clave:**
    1.  **Lista de Configuraciones de Agente:** Una tabla que muestre los agentes existentes (ej. "Agente WISMO", "Agente Devoluciones").
    2.  **Formulario de Edición:**
        *   `Nombre`: Un nombre descriptivo.
        *   `Descripción`: Para explicar qué hace este agente.
        *   `Prompt Base`: Un área de texto grande (`<textarea>`) para editar el prompt principal. Idealmente, debería soportar variables como `{{nombre_cliente}}` o `{{numero_orden}}` para que el backend las reemplace.
        *   `Umbral de Confianza`: Un campo numérico (de 0 a 1) para ajustar el umbral a partir del cual se considera una respuesta como de alta confianza.
        *   `Prompts por canal`: Un editor JSON para definir prompts específicos por canal.

#### UI-07: Gestión de Plantillas (`Plantilla`)
*   **Estado:** **Recomendada para Eficiencia.**
*   **Propósito Principal:** Permitir a los agentes crear y gestionar respuestas predefinidas (canned responses) para situaciones que no maneja la IA o para cuando editan una sugerencia. Esto ahorra tiempo en la resolución manual de tickets de Nivel 2.
*   **Componentes Clave:**
    *   Una interfaz CRUD (Crear, Leer, Actualizar, Borrar) para las plantillas.
    *   Cada plantilla tendría: `Nombre`, `Asunto` y `Cuerpo` (con un editor de texto enriquecido básico).
    *   **Integración:** En la vista de resolución de tickets (UI-04), debería haber un botón "Insertar Plantilla" que abra un buscador de estas respuestas.

#### UI-08: Gestión de Usuarios y Roles (`Usuario`)
*   **Estado:** **Crítica para la Administración.**
*   **Propósito Principal:** Administrar quién tiene acceso al sistema y con qué nivel de permisos.
*   **Componentes Clave:**
    *   Una tabla de usuarios que muestre `Nombre`, `Correo`, `Rol` (`AGENTE`, `ADMINISTRADOR`).
    *   Funcionalidad para invitar nuevos usuarios (que se registrarían vía Supabase Auth).
    *   Funcionalidad para cambiar el rol de un usuario existente.

#### UI-09: Gestión de Etiquetas (`Etiqueta`)
*   **Estado:** Recomendada.
*   **Propósito Principal:** Permitir a los administradores mantener una lista limpia y consistente de etiquetas para la categorización de tickets.
*   **Componentes Clave:**
    *   Interfaz CRUD simple para crear, renombrar o eliminar etiquetas.
    *   Opcional: Funcionalidad para fusionar etiquetas duplicadas (ej. "devolucion" y "devoluciones").

---

### B. Interfaces de Gestión de Datos Maestros

El sistema necesita una forma de ver y gestionar los datos centrales del negocio más allá de la importación inicial.

#### UI-10: Vista de Clientes (CRM Ligero)
*   **Estado:** **Altamente Recomendada.**
*   **Propósito Principal:** Dar a los agentes una visión de 360 grados del cliente. Cuando un agente abre un ticket, necesita ver el historial completo de esa persona para dar un soporte contextualizado y de calidad.
*   **Componentes Clave:**
    1.  **Página de Perfil del Cliente:**
        *   Información de contacto (`Nombre`, `Correo`, `Teléfono`).
        *   Una lista de **todas las órdenes** asociadas a ese cliente.
        *   Un historial de **todos los tickets** previos del cliente, con su estado final.

#### UI-11: Vista de Órdenes
*   **Estado:** Recomendada.
*   **Propósito Principal:** Complementar la importación CSV. Permite a un agente buscar una orden específica por su ID o por el correo del cliente, y ver o editar sus detalles (ej. añadir manualmente un número de seguimiento).
*   **Componentes Clave:**
    *   Una tabla de órdenes con capacidad de búsqueda y filtrado.
    *   Una vista de detalle de la orden que muestre su estado, artículos, tracking y el ticket asociado.

---

### C. Interfaces Públicas (Orientadas al Cliente)

Has diseñado excelentemente la experiencia del agente. Ahora debemos definir formalmente lo que el cliente final ve.

#### UI-12: Formulario Web Público para Creación de Tickets
*   **Estado:** **Crítica.**
*   **Propósito Principal:** Proporcionar un canal de entrada de tickets, alternativo al correo electrónico, directamente desde el sitio web de la empresa.
*   **Componentes Clave:**
    *   Un formulario simple embebible.
    *   Campos: `Nombre`, `Correo electrónico`, `Número de orden (opcional)`, `Asunto`, `Mensaje`.
    *   Un campo para adjuntar archivos.
    *   Al enviarse, crea un ticket con `Canal.web`.

#### UI-13: Plantillas de Correo Electrónico al Cliente (Transaccionales)
*   **Estado:** **Crítica.**
*   **Propósito Principal:** Son la "voz" del sistema hacia el cliente. No son interfaces gráficas, pero su diseño (contenido y branding) es fundamental.
*   **Componentes Clave (Templates a diseñar en HTML):**
    1.  **Email de Acuse de Recibo:** "Hemos recibido tu ticket (#{{ticket.id}}). Nuestro equipo lo está revisando."
    2.  **Email de Respuesta del Agente:** El contenedor para las respuestas enviadas desde la plataforma.
    3.  **Email de Cierre de Ticket:** "Tu solicitud #{{ticket.id}} ha sido resuelta. Si tienes más preguntas, responde a este correo para reabrirlo."

### Priorización para el MVP

No es necesario que construyan todas estas interfaces con un CRUD completo para la primera entrega. Aquí tienes un enfoque pragmático:

1.  **Críticas (Deben existir de alguna forma):**
    *   **UI-12 (Formulario Público) y UI-13 (Plantillas de Email):** Son la cara visible del sistema. Son indispensables.
    *   **UI-08 (Gestión de Usuarios):** Puede ser simplificado. En lugar de una UI completa, pueden manejarlo con un **script de `seed`** que cree los usuarios iniciales (Brenda, Carlos, Admin). Esto es suficiente para la demo.
    *   **UI-06 (Gestión del Agente IA):** Al igual que con los usuarios, para el MVP basta con que los prompts estén **sembrados en la base de datos a través del script de `seed`**. La capacidad de editarlos en una UI es una mejora para el futuro, pero para la demo, tenerlos fijos es aceptable.

2.  **Altamente Recomendadas (Aportan gran valor a la demo):**
    *   **UI-10 (Vista de Clientes):** Tener un enlace en la vista del ticket que lleve a un historial simple del cliente hará que la demo sea mucho más impactante. Muestra que han pensado en el contexto del agente.

3.  **Recomendadas y Postergables:**
    *   **UI-07 (Plantillas), UI-09 (Etiquetas), UI-11 (Órdenes):** El CRUD completo para estos elementos puede ser implementado post-MVP. Para la demo, los datos iniciales pueden ser cargados vía `seed`.

---
