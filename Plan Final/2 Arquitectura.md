### 2. Arquitectura, Stack Tecnológico y Hosting
*   **Backend:** **NestJS (TypeScript)** con **Prisma** como ORM.
*   **Frontend:** **React** con **Vite** y **Tailwind CSS** para un dashboard responsive.
*   **Base de Datos:** **PostgreSQL**.
    *   **Nota de Implementación:** Para simplificar la configuración, las credenciales y la red, se utilizará una única instancia de base de datos PostgreSQL, siendo la proporcionada por Supabase la candidata ideal para unificar la DB de la aplicación con la de autenticación.
*   **Autenticación:** **Supabase Auth**. Simplifica la gestión de usuarios y seguridad, permitiendo validar tokens JWT en el backend de NestJS.
*   **Almacenamiento de Archivos:** **Supabase Storage**.
*   **Procesamiento en Segundo Plano:** **Worker simple en memoria.**
*   **Integración de LLM:** Capa de adaptación (Adapter) que soporte:
    *   **Primario (Para la Demo):** **Mocks locales deterministas.** Para garantizar una demostración fluida, predecible y sin dependencias externas, el adaptador operará leyendo respuestas predefinidas desde archivos JSON.
    *   **Secundario (Funcionalidad Requerida):** **OpenRouter.** La integración real con un proveedor de LLM a través de OpenRouter es una parte imprescindible del MVP para demostrar la capacidad técnica del sistema.
*   **Envío de Emails:**
    *   **Primario (Gratuito):** **Mailgun** (plan gratuito con ~100 emails/día).
    *   **Fallback Local:** Un modo de "fake SMTP" que imprima los emails en la consola para desarrollo y pruebas.
*   **Hosting:**
    *   **Frontend:** **Vercel** (Plan Hobby/Free).
    *   **Backend:** **Render** (ofrece horas de instancia gratuitas).
*   **Herramientas de Desarrollo:**
    *   **Webhooks locales:** **ngrok**.
    *   **Parseo de CSV:** **Papaparse** (frontend para preview) y **fast-csv** (backend).
