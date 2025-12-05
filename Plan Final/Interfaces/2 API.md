## 2. Interfaces de Software (API)

Esta sección define el contrato **RESTful API** entre el frontend de React y el backend de NestJS. Todos los endpoints estarán prefijados con `/api/v1` y requerirán un token JWT de Supabase Auth en la cabecera `Authorization`, a menos que se indique lo contrario.

### A0. Autenticación

#### API-00: Login (Temporal)
*   **Endpoint:** `POST /auth/login`
*   **Autenticación:** Ninguna (Público).
*   **Propósito:** Autenticar usuario con correo y contraseña contra Supabase Auth y obtener un token de acceso.
*   **Payload:** `loginDto`
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "password123"
    }
    ```
*   **Respuesta Exitosa (201 Created):**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Respuesta Error (400/401):**
    ```json
    {
      "error": "Invalid login credentials"
    }
    ```

### A. Endpoints de Dashboards y Vistas Agregadas

Estos endpoints están diseñados para la eficiencia, proporcionando datos pre-agregados para las vistas de dashboard y evitando múltiples peticiones desde el frontend.

#### API-01: Datos para Dashboard del Administrador (Ref: UI-01)
*   **Endpoint:** `GET /dashboards/admin`
*   **Rol Requerido:** `ADMINISTRADOR`
*   **Propósito:** Provee todos los datos necesarios para renderizar la UI-01 en una sola petición.
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "resumen": {
        "total": 100,
        "abiertos": 30,
        "cerrados": 70
      },
      "distribucion": {
        "porEstado": [
          { "estado": "nuevo", "_count": { "id": 10 } },
          { "estado": "cerrado", "_count": { "id": 70 } }
        ],
        "porPrioridad": [
          { "prioridad": "alta", "_count": { "id": 5 } },
          { "prioridad": "media", "_count": { "id": 25 } }
        ]
      },
      "actividadReciente": [
        {
          "id": "uuid-ticket",
          "asunto": "Problema con pedido",
          "creadoEn": "2023-10-27T10:00:00Z",
          "cliente": { "nombre": "Juan Perez", "correo": "juan@example.com" }
        }
      ]
    }
    ```

#### API-02: Datos para Dashboard del Agente (Ref: UI-02)
*   **Endpoint:** `GET /dashboards/agent`
*   **Rol Requerido:** `AGENTE` (o cualquier usuario autenticado)
*   **Propósito:** Provee los datos personalizados para el agente que realiza la petición. El backend identificará al agente a través del JWT.
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "metricasPersonales": {
        "asignadosActivos": 5,
        "resueltosHoy": 12,
        "atencionInmediata": 3
      }
    }
    ```

#### API-02.1: Siguiente Ticket para "Flujo Continuo" (Ref: UI-04)
// TODO: Pendiente de implementación en backend
*   **Endpoint:** `GET /tickets/next-in-flow`
*   **Rol Requerido:** `AGENTE`
*   **Propósito:** Encapsula la lógica de la cola de "Flujo Continuo" (4 Urgentes, 3 Altas, etc.) en el servidor, devolviendo el siguiente ticket más apropiado para el agente que realiza la llamada.
*   **Respuesta Exitosa (200 OK):** El objeto completo del ticket o `204 No Content` si no hay tickets en la cola.

### B. Endpoints del Flujo de Tickets

Estos son los endpoints operativos que los agentes usarán constantemente a través de las UIs de gestión de tickets.

#### API-03: Gestión de Tickets (Ref: UI-03, UI-04)
*   **Listar Tickets:** `GET /tickets`
    *   **Propósito:** Obtener listas de tickets. Es la base para todas las colas.
    *   **Parámetros de Query:**
        *   `estado`: Filtra por estado (ej. `ia_sugerido`, `escalado_nivel_2`).
        *   `assigneeId`: Filtra por ID de agente.
        *   `clienteId`: Filtra por ID de cliente.
        *   `ordenId`: Filtra por ID de orden.
        *   `prioridad`: Filtra por prioridad.
        *   `canal`: Filtra por canal.
*   **Obtener un Ticket:** `GET /tickets/:id`
    *   **Propósito:** Obtener el detalle completo de un ticket, incluyendo mensajes, cliente, orden asociada y archivos.
*   **Crear un Ticket (Interno):** `POST /tickets`
    *   **Propósito:** Crear un ticket manualmente desde el panel de administración.
    *   **Payload:** `CreateTicketDto` (asunto, mensajeInicial, correoCliente, canal, prioridad, ordenId, archivos).
*   **Actualizar un Ticket:** `PATCH /tickets/:id`
    *   **Propósito:** Actualizar campos del ticket como estado, prioridad o asignación.
    *   **Payload:** `UpdateTicketDto` (estado, prioridad, assigneeId).
*   **Eliminar un Ticket:** `DELETE /tickets/:id`
    *   **Propósito:** Eliminar un ticket del sistema.
*   **Acciones sobre un Ticket:**
    *   `POST /tickets/:id/reply`: **Responder Ticket.**
        *   **Payload:** `ReplyTicketDto` (contenidoTexto, nuevoEstado).
    *   `POST /tickets/:id/escalate`: **Escalar a Nivel 2.**
        *   **Payload:** `EscalateTicketDto` (note).
    *   `POST /tickets/:id/messages`: **Crear Mensaje (Agente o Nota Interna).**
        *   **Payload:** `CreateMessageDto` (contenidoTexto, esNotaInterna, archivos).
    *   `GET /tickets/:id/merge-candidates`: **Buscar candidatos para fusión.**
        *   **Propósito:** Buscar posibles tickets duplicados para sugerir fusión.
    *   `POST /tickets/:id/merge`: **Fusionar Ticket.**
        *   **Payload:** `MergeTicketDto` (targetTicketId).
    *   `POST /tickets/:id/tags/:tagName`: **Agregar Etiqueta.**
    *   `DELETE /tickets/:id/tags/:tagName`: **Quitar Etiqueta.**

#### API-10: Creación de Ticket desde Formulario Web (Ref: UI-12)
*   **Endpoint:** `POST /public/tickets`
*   **Autenticación:** Ninguna (Público).
*   **Payload:** `CreateTicketDto` (asunto, mensajeInicial, correoCliente, nombreCliente, canal='formulario_web', ordenId, archivos).

### C. Gestión de Usuarios (Internos)

#### API-04: Gestión de Usuarios (Ref: UI-10)
*   **Endpoint Base:** `/users`
*   **Autenticación:** Requerida (`JwtAuthGuard`, `RolesGuard`).
*   **Listar Usuarios:** `GET /users`
    *   **Rol Requerido:** `ADMINISTRADOR`, `AGENTE`
    *   **Propósito:** Obtener lista de usuarios internos (agentes/admins).
    *   **Parámetros de Query:** Filtros por campos de usuario (nombre, correo, rol, activo).
*   **Obtener Perfil Propio:** `GET /users/profile`
    *   **Propósito:** Obtener los datos del usuario autenticado actual.
*   **Obtener un Usuario:** `GET /users/:id`
    *   **Rol Requerido:** `ADMINISTRADOR`
    *   **Propósito:** Obtener detalle de un usuario específico.
*   **Crear Usuario:** `POST /users`
    *   **Rol Requerido:** `ADMINISTRADOR`
    *   **Propósito:** Registrar un nuevo usuario en la base de datos (vinculado a Supabase Auth).
    *   **Payload:** `CreateUserDto`
        ```json
        {
          "id": "uuid-supabase",
          "nombre": "Nombre Apellido",
          "correo": "email@dominio.com",
          "rol": "AGENTE",
          "activo": true
        }
        ```
*   **Actualizar Usuario:** `PATCH /users/:id`
    *   **Rol Requerido:** `ADMINISTRADOR`
    *   **Propósito:** Actualizar datos de un usuario.
    *   **Payload:** `UpdateUserDto` (Parcial de `CreateUserDto`)
*   **Eliminar Usuario:** `DELETE /users/:id`
    *   **Rol Requerido:** `ADMINISTRADOR`
    *   **Propósito:** Eliminar un usuario del sistema.

#### API-05: Gestión de Plantillas (Ref: UI-07)
*   **Endpoint Base:** `/templates`
*   **Autenticación:** Requerida (`JwtAuthGuard`).
*   **Listar Plantillas:** `GET /templates`
    *   **Propósito:** Obtener todas las plantillas disponibles.
*   **Obtener una Plantilla:** `GET /templates/:id`
    *   **Propósito:** Obtener el detalle de una plantilla específica.
*   **Crear una Plantilla:** `POST /templates`
    *   **Propósito:** Crear una nueva plantilla de respuesta.
    *   **Payload:** `CreateTemplateDto`
        *   `nombre`: string
        *   `plantillaCuerpo`: string
        *   `plantillaAsunto`: string (Opcional)
*   **Actualizar una Plantilla:** `PATCH /templates/:id`
    *   **Propósito:** Actualizar una plantilla existente.
    *   **Payload:** `UpdateTemplateDto` (Parcial de `CreateTemplateDto`)
*   **Eliminar una Plantilla:** `DELETE /templates/:id`
    *   **Propósito:** Eliminar una plantilla.
//TODO: lógica para variables dentro del string de las plantillas, algo como "Buenas {{nombre_cliente}}"

#### API-09: Gestión de Etiquetas (Ref: UI-09)
*   **Endpoint Base:** `/tags`
*   **Autenticación:** Requerida (`JwtAuthGuard`).
*   **Listar Etiquetas:** `GET /tags`
    *   **Propósito:** Obtener todas las etiquetas disponibles.
*   **Obtener una Etiqueta:** `GET /tags/:id`
    *   **Propósito:** Obtener el detalle de una etiqueta.
*   **Crear una Etiqueta:** `POST /tags`
    *   **Propósito:** Crear una nueva etiqueta.
    *   **Payload:** `CreateTagDto`
        ```json
        {
          "nombre": "string"
        }
        ```
*   **Actualizar una Etiqueta:** `PATCH /tags/:id`
    *   **Propósito:** Actualizar una etiqueta existente.
    *   **Payload:** `UpdateTagDto` (Parcial de `CreateTagDto`)
        ```json
        {
          "nombre": "string"
        }
        ```
*   **Eliminar una Etiqueta:** `DELETE /tags/:id`
    *   **Propósito:** Eliminar una etiqueta.

#### API-08: Gestión de Clientes (Ref: UI-06)
*   **Endpoint Base:** `/customers`
*   **Autenticación:** Requerida (`JwtAuthGuard`).
*   **Buscar Clientes:** `GET /customers`
    *   **Propósito:** Buscar clientes por nombre o correo.
    *   **Parámetros de Query:** `q` (término de búsqueda).
    *   **Respuesta Exitosa:** Array de clientes con conteo de tickets y órdenes.
        ```json
        [
          {
            "id": "uuid",
            "nombre": "Cliente Ejemplo",
            "correo": "cliente@ejemplo.com",
            "_count": { "tickets": 5, "ordenes": 2 }
          }
        ]
        ```
*   **Obtener Perfil de Cliente:** `GET /customers/:id`
    *   **Propósito:** Obtener perfil 360 del cliente (Tickets + Órdenes).
    *   **Respuesta Exitosa:** Objeto cliente con tickets y órdenes recientes.
        ```json
        {
          "id": "uuid",
          "nombre": "Cliente Ejemplo",
          "tickets": [
            { "id": "uuid", "asunto": "...", "estado": "...", "prioridad": "...", "creadoEn": "..." }
          ],
          "ordenes": [
            { "id": "uuid", "creadoEn": "..." }
          ]
        }
        ```

#### API-12: Gestión de Órdenes (Ref: UI-11)
*   **Endpoint Base:** `/orders`
*   **Autenticación:** Requerida (`JwtAuthGuard`).
*   **Listar Órdenes:** `GET /orders`
    *   **Propósito:** Obtener lista de órdenes (últimas 50).
    *   **Respuesta:** Array de órdenes con relación `cliente` incluida.
*   **Obtener una Orden:** `GET /orders/:id`
    *   **Propósito:** Obtener detalle de una orden específica.
    *   **Respuesta:** Objeto orden con relación `cliente` incluida.
*   **Importar Órdenes (CSV):** `POST /orders/import`
    *   **Propósito:** Importar órdenes masivamente desde un archivo CSV.
    *   **Tipo de Contenido:** `multipart/form-data`
    *   **Payload:** Campo `file` con el archivo CSV (validado: max 5MB, tipos csv/text/excel).
        *   **Columnas Requeridas:** `order_id`, `email`.
        *   **Columnas Opcionales:** `customer_name`, `status`, `tracking_number`, `carrier`, `items` (JSON).
    *   **Respuesta:** Objeto con estadísticas (`totalProcesados`, `insertados`, `errores`, `logErrores`).

### F. Endpoints de Utilidades

#### API-11: Subida de Archivos
*   **Endpoint:** `POST /uploads`
*   **Autenticación:** Requerida (`JwtAuthGuard`).
*   **Tipo de Contenido:** `multipart/form-data`
*   **Propósito:** Sube un archivo a Supabase Storage (bucket `adjuntos`) y devuelve su URL pública y metadatos. No crea el registro en la base de datos `Archivo` todavía; eso ocurre al crear el ticket o mensaje.
*   **Payload:** Form-data con campo `file`.
*   **Respuesta Exitosa:**
    ```json
    {
      "nombreOriginal": "foto.png",
      "nombreAlmacenado": "169877777_foto.png",
      "tipoMime": "image/png",
      "tamano": 1024,
      "url": "https://.../adjuntos/169877777_foto.png"
    }
    ```
*   **Endpoint Público:** `POST /public/uploads` //TODO: Implementar endpoint público con validaciones estrictas (rate limit, tipos de archivo) para el formulario web.

### G. Endpoints de Inteligencia Artificial

#### API-13: Procesamiento de Tickets con IA
*   **Endpoint Base:** `/ai`
*   **Autenticación:** Requerida.
*   **Reintentar Procesamiento:** `POST /ai/retry/:ticketId`
    *   **Propósito:** Fuerza el re-procesamiento de un ticket específico por el motor de IA (OpenRouter). Útil en caso de fallos o para regenerar sugerencias.
    *   **Parámetros de Ruta:** `ticketId` (UUID del ticket).
    *   **Respuesta Exitosa (201 Created):**
        ```json
        {
          "message": "AI processing triggered for ticket",
          "ticketId": "uuid-del-ticket"
        }
        ```

// TODO: Endpoints para gestión de Configuración de Agentes (ConfigAgente) - CRUD para prompts y umbrales.

---
