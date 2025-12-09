# NoraAI Support Platform - Frontend

React + Vite frontend for the NoraAI intelligent customer support system.

---

## 🔍 API Audit Report

**Status: ✅ AUDIT COMPLETE** | **Dec 7, 2025**

Comprehensive audit of frontend → backend API endpoint compliance with Swagger specification.

**Quick Summary:**
- ✅ 97.9% compliance (47/48 endpoints match)
- ✅ No critical issues blocking MVP launch
- ⚠️ 1 confirmation needed from backend team
- 🎯 **Go-Live Ready: 4/5 stars** ⭐⭐⭐⭐

### 📂 Audit Documents

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| [API_AUDIT_README.md](./API_AUDIT_README.md) | Overview & quick start | Everyone | 5 min |
| [API_AUDIT_EXECUTIVE_SUMMARY.md](./API_AUDIT_EXECUTIVE_SUMMARY.md) | Risk assessment & timeline | Managers | 5 min |
| [FRONTEND_API_AUDIT.md](./FRONTEND_API_AUDIT.md) | Endpoint inventory & details | QA/Backend | 45 min |
| [BACKEND_ALIGNMENT_NOTES.md](./BACKEND_ALIGNMENT_NOTES.md) | Technical analysis & recommendations | Backend/Tech Lead | 35 min |
| [HOW_TO_USE_AUDIT_REPORT.md](./HOW_TO_USE_AUDIT_REPORT.md) | Role-based reading guide | All | 15 min |

**→ [Start with API_AUDIT_README.md](./API_AUDIT_README.md)**

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase Magic Link (Passwordless) - Quick Setup

Sigue estos pasos para habilitar el flujo de magic link descrito en la documentación del proyecto.

- **Paso 1 — Configuración en Supabase (Dashboard)**
	- Ve a `Authentication` → `URL Configuration`.
	- `Site URL`: Pon la URL de producción del frontend: `https://nora-ai-flame.vercel.app`.
	- `Redirect URLs`: añade explícitamente:
		- `https://nora-ai-flame.vercel.app/auth/callback`
		- `http://localhost:3000/auth/callback` (para desarrollo local)
	- Ve a `Email Templates` → `Magic Link` y asegúrate de que el HTML tenga `{{ .ConfirmationURL }}`.

- **Paso 2 — Backend (ejemplo conceptual, NestJS en Render)**
	- Instala el cliente en tu backend: `npm install @supabase/supabase-js`.
	- Variables de entorno en Render (secretas):
		- `SUPABASE_URL` = tu proyecto Supabase URL
		- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (NO usar anon)
	- Endpoint ejemplo (Node/NestJS):

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sendMagicLink(email: string) {
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: { emailRedirectTo: 'https://nora-ai-flame.vercel.app/auth/callback' },
	});
	if (error) throw new Error(error.message);
	return { success: true };
}
```

- **Paso 3 — Frontend (Vite + React)**
	- Añade variables de entorno en `.env` / `.env.local` (Vite usa `VITE_`):
		- `VITE_SUPABASE_URL`
		- `VITE_SUPABASE_ANON_KEY`
		- `VITE_API_BASE_URL` (la URL pública de tu backend en Render)
	- Instala cliente: `npm install @supabase/supabase-js`.
	- Crea la página de callback en `src/features/auth/pages/AuthCallback.jsx` (ya incluida en este repo).
	- Flujo recomendado:
		1. Frontend pide al backend `POST /auth/magic-link` con `{ email, redirectTo }`.
		2. Backend usa `signInWithOtp` con `service_role` y `emailRedirectTo` apuntando a `/auth/callback`.
		3. Usuario recibe el correo y hace clic. Supabase valida el link y redirige al `redirectTo` con un código.
		4. En `AuthCallback`, el frontend intercambia el código por la sesión usando la clave ANON y `supabase.auth.getSessionFromUrl()`.

### Notas de seguridad
- Nunca expongas la `service_role` en el frontend. Úsala solo desde tu backend.
- Asegúrate de que las `Redirect URLs` en Supabase coincidan exactamente con las rutas que uses en el frontend.

Si quieres, puedo:
- Añadir un ejemplo de endpoint backend en NestJS (controlador + servicio).
- Configurar un ejemplo de llamada desde el UI (formulario de login que llame a `/auth/magic-link`).
