# Auditoría de Estandarización y Refactorización de UI

**Fecha:** 8 de diciembre de 2024  
**Alcance:** Análisis completo del workspace `/src` buscando violaciones DRY, reinvención de componentes existentes e inconsistencias visuales.

---

## Resumen Ejecutivo

Se identificaron **28 hallazgos** clasificados en tres categorías:
- **♻️ Refactorización a Componente:** 12 casos
- **🎨 Inconsistencia de Diseño:** 8 casos
- **🧹 Limpieza DRY:** 8 casos

**Impacto estimado:**
- Reducción de ~800 líneas de código duplicado
- Mejora de consistencia visual en 11 páginas
- Mejor mantenibilidad al centralizar lógica de UI

---

## 6. src/features/admin/knowledge-base/pages/KnowledgeBaseListPage.jsx

### Hallazgo 6.1: Input de Búsqueda Manual (Líneas 162-173)

**Tipo de Mejora:** ♻️ Refactorización a Componente

**Hallazgo:**  
Mismo patrón repetido.

**Solución Propuesta:**

```jsx
// DESPUÉS
<SearchInput
  value={searchTerm}
  onChange={handleSearchChange}
  placeholder="Buscar documentos..."
  className="flex-1"
/>
```

---

### Hallazgo 6.2: Select Manual (Líneas 174-190)

**Tipo de Mejora:** ♻️ Refactorización a Componente

**Hallazgo:**  
Select de categorías manual.

**Solución Propuesta:**

```jsx
// DESPUÉS
<Select
  value={categoryFilter}
  onChange={handleCategoryChange}
  disabled={isLoadingCategories}
  placeholder="Todas las categorías"
  options={[
    { value: "", label: "Todas las categorías" },
    ...normalizedCategories.map((cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat] || cat,
    })),
  ]}
/>
```

---

## 7. src/features/admin/audit-logs/pages/AuditLogsPage.jsx

### Hallazgo 7.1: Input de Búsqueda Manual (Líneas 180-189)

**Tipo de Mejora:** ♻️ Refactorización a Componente

**Hallazgo:**  
Mismo patrón repetido de input + ícono manual.

**Solución Propuesta:**

```jsx
// DESPUÉS
<SearchInput
  value={filters.search}
  onChange={handleSearch}
  placeholder="Buscar en logs..."
/>
```

---

### Hallazgo 7.2: Selectores e Inputs de Fecha Manuales (Líneas 196-259)

**Tipo de Mejora:** 🧹 Limpieza DRY

**Hallazgo:**  
Múltiples `<select>` e `<input type="date">` con estilos idénticos repetidos. Debería usar el componente `Select` y extraer las clases comunes.

**Solución Propuesta:**

```jsx
// Crear un helper para inputs consistentes
const FilterInput = ({ type = "text", label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-dt-foreground mb-2">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-3 py-2 bg-dt-background border border-dt-border rounded-lg text-dt-foreground focus:outline-none focus:ring-2 focus:ring-dt-accent"
      {...props}
    />
  </div>
);

// DESPUÉS
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div>
    <label className="block text-sm font-medium text-dt-foreground mb-2">
      Tipo de Acción
    </label>
    <Select
      value={filters.action}
      onChange={(e) => handleFilterChange("action", e.target.value)}
      placeholder="Todas"
      options={[
        { value: "", label: "Todas" },
        { value: "CREATE", label: "Crear" },
        { value: "UPDATE", label: "Actualizar" },
        { value: "DELETE", label: "Eliminar" },
        { value: "LOGIN", label: "Inicio de sesión" },
        { value: "LOGOUT", label: "Cierre de sesión" },
      ]}
    />
  </div>
  
  <FilterInput
    type="date"
    label="Fecha Desde"
    value={filters.startDate}
    onChange={(e) => handleFilterChange("startDate", e.target.value)}
  />
  
  <FilterInput
    type="date"
    label="Fecha Hasta"
    value={filters.endDate}
    onChange={(e) => handleFilterChange("endDate", e.target.value)}
  />
  
  <div>
    <label className="block text-sm font-medium text-dt-foreground mb-2">
      Usuario
    </label>
    <Select
      value={filters.userId}
      onChange={(e) => handleFilterChange("userId", e.target.value)}
      placeholder="Todos"
      options={[
        { value: "", label: "Todos" },
        ...usersList.map((user) => ({
          value: user.id,
          label: user.nombre,
        })),
      ]}
    />
  </div>
  
  <FilterInput
    label="Recurso"
    value={filters.resource}
    onChange={(e) => handleFilterChange("resource", e.target.value)}
    placeholder="tickets, usuarios, plantillas..."
  />
</div>
```

---

## 8. src/features/customers/pages/CustomerListPage.jsx

### Hallazgo 8.1: Cards de Estadísticas Manuales (Líneas 56-74)

**Tipo de Mejora:** ♻️ Refactorización a Componente

**Hallazgo:**  
Implementa manualmente 3 tarjetas de estadísticas con `<div>` cuando existe el componente `StatCard` en `src/features/dashboard/components/StatCard.jsx` usado en `AdminDashboardPage`.

**Por qué es un problema:**
- **Inconsistencia:** Las tarjetas de estadísticas en el dashboard tienen efectos hover y estilos diferentes.
- **Mantenibilidad:** Cambiar el diseño de stats cards requiere tocar múltiples archivos.
- **DRY:** Se repite la estructura de `<div>` + título + valor en 3 lugares.

**Solución Propuesta:**

```jsx
// ANTES (Líneas 56-74) - 3 divs manuales
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
    <div className="text-dt-subtle text-sm mb-1">Total Clientes</div>
    <div className="text-2xl font-bold text-white">{customers.length}</div>
  </div>
  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
    <div className="text-dt-subtle text-sm mb-1">Resultados</div>
    <div className="text-2xl font-bold text-white">{filteredCustomers.length}</div>
  </div>
  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
    <div className="text-dt-subtle text-sm mb-1">Con Tickets</div>
    <div className="text-2xl font-bold text-white">
      {customers.filter(c => c.tickets?.length > 0 || c.ticketsCount > 0).length}
    </div>
  </div>
</div>

// DESPUÉS - Usando StatCard
import StatCard from "@/features/dashboard/components/StatCard";
import { RollingNumber } from "@/shared/components/ui/RollingNumber";

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <StatCard
    variant="card"
    title="Total Clientes"
    value={<RollingNumber value={customers.length} />}
    icon={
      <span className="material-symbols-outlined text-xl">
        group
      </span>
    }
  />
  <StatCard
    variant="card"
    title="Resultados"
    value={<RollingNumber value={filteredCustomers.length} />}
    icon={
      <span className="material-symbols-outlined text-xl">
        filter_list
      </span>
    }
  />
  <StatCard
    variant="card"
    title="Con Tickets"
    value={
      <RollingNumber
        value={customers.filter(c => c.tickets?.length > 0 || c.ticketsCount > 0).length}
      />
    }
    icon={
      <span className="material-symbols-outlined text-xl">
        confirmation_number
      </span>
    }
  />
</div>
```

---

## 9. Patrón DRY: Header con Título + Botón de Acción

### Hallazgo 9.1: Estructura Repetida de Header

**Tipo de Mejora:** 🧹 Limpieza DRY

**Hallazgo:**  
La estructura de header con título + descripción + botón de acción se repite en 8+ páginas de administración con estructura idéntica:

**Páginas afectadas:**
- `TagsListPage.jsx` (Líneas 118-133)
- `IntegrationsListPage.jsx` (Líneas 115-135)
- `AuditLogsPage.jsx` (Líneas 160-177)
- `KnowledgeBaseListPage.jsx` (Líneas 143-158)
- `AgentListPage.jsx` (Líneas 148-160)
- `TemplateListPage.jsx` (Líneas 118-126)

**Por qué es un problema:**
- **Duplicación masiva:** ~150 líneas de JSX idéntico.
- **Mantenibilidad:** Cambiar el layout del header requiere tocar 8 archivos.
- **Inconsistencia:** Pequeñas variaciones en espaciado y clases entre páginas.

**Solución Propuesta:**

```jsx
// Crear nuevo componente: src/shared/components/layout/PageHeader.jsx
import React from "react";
import Button from "@/shared/components/ui/Button";

const PageHeader = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-2xl text-dt-accent" />}
        <div>
          <h1 className="text-2xl font-bold text-dt-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-dt-subtle">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "primary"}
          icon={action.icon}
          size={action.size || "md"}
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
};

export default PageHeader;

// USO en TagsListPage.jsx
// ANTES (Líneas 118-133)
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <FiTag className="text-2xl text-dt-accent" />
    <div>
      <h1 className="text-2xl font-bold text-dt-foreground">
        Gestión de Etiquetas
      </h1>
      <p className="text-sm text-dt-subtle">
        Administra etiquetas maestras para categorizar tickets
      </p>
    </div>
  </div>
  <Button
    onClick={() => setIsCreateModalOpen(true)}
    variant="primary"
    icon={FiPlus}
  >
    Nueva Etiqueta
  </Button>
</div>

// DESPUÉS
import PageHeader from "@/shared/components/layout/PageHeader";

<PageHeader
  icon={FiTag}
  title="Gestión de Etiquetas"
  description="Administra etiquetas maestras para categorizar tickets"
  action={{
    label: "Nueva Etiqueta",
    onClick: () => setIsCreateModalOpen(true),
    icon: FiPlus,
  }}
/>
```

---

## 10. Patrón DRY: Barra de Filtros

### Hallazgo 10.1: Estructura Repetida de Filtros

**Tipo de Mejora:** 🧹 Limpieza DRY

**Hallazgo:**  
La estructura de barra de filtros con ícono `FiFilter` + texto "Filtros" + selectores se repite en:
- `TagsListPage.jsx` (Líneas 145-179)
- `UsersListPage.jsx` (Líneas 109-145)

**Solución Propuesta:**

```jsx
// Crear componente: src/shared/components/ui/FilterBar.jsx
import React from "react";
import { FiFilter } from "react-icons/fi";

const FilterBar = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      <div className="flex items-center gap-2 text-sm text-dt-subtle uppercase tracking-wide">
        <FiFilter />
        <span>Filtros</span>
      </div>
      {children}
    </div>
  );
};

export default FilterBar;

// USO
import FilterBar from "@/shared/components/ui/FilterBar";
import Select from "@/shared/components/ui/Select";

<FilterBar>
  <Select
    value={roleFilter}
    onChange={(e) => setRoleFilter(e.target.value)}
    placeholder="Todos los roles"
    options={roleOptions}
  />
  <Select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    placeholder="Todos los estados"
    options={statusOptions}
  />
</FilterBar>
```

---

## 11. Inconsistencia: Variantes de Badge

### Hallazgo 11.1: Uso Inconsistente de Variantes de Badge

**Tipo de Mejora:** 🎨 Inconsistencia de Diseño

**Hallazgo:**  
El componente `Badge` define variantes estándar (`success`, `error`, `warning`, `info`, `accent`, `neutral`, `danger`), pero algunas páginas usan `danger` mientras otras usan `error` para el mismo concepto (estado negativo).

**Páginas afectadas:**
- `UsersListPage`: usa `neutral` para inactivo
- `TagsListPage`: usa variantes custom en línea

**Por qué es un problema:**  
Un badge "rojo" (error/peligro) debe verse igual en toda la app para mantener consistencia visual.

**Solución Propuesta:**

```jsx
// Estandarizar uso:
// - `success` → Verde (éxito, activo, completado)
// - `error` → Rojo (error, eliminado, crítico)
// - `warning` → Amarillo (advertencia, pendiente)
// - `info` → Azul (información)
// - `accent` → Violeta (destacado, primario)
// - `neutral` → Gris (inactivo, deshabilitado)

// Ejemplo en UsersListPage:
<Badge
  variant={user.activo ? "success" : "neutral"}
  icon={user.activo ? FiCheckCircle : FiXCircle}
>
  {user.activo ? "Activo" : "Inactivo"}
</Badge>

// Ejemplo en TagsListPage (evitar variantes inline):
// ANTES
<Badge variant={usageCount === 0 ? "neutral" : usageCount > 50 ? "success" : "warning"}>
  {usageCount} tickets
</Badge>

// DESPUÉS (centralizar en helper)
const getUsageVariant = (count) => {
  if (count === 0) return "neutral";
  if (count > 50) return "success";
  if (count > 10) return "warning";
  return "info";
};

<Badge variant={getUsageVariant(usageCount)}>
  {usageCount} tickets
</Badge>
```

---

## 12. Inconsistencia: Clases de Tailwind para Estados de Prioridad

### Hallazgo 12.1: Implementación Inline de Badges de Prioridad

**Tipo de Mejora:** 🎨 Inconsistencia de Diseño

**Hallazgo:**  
En `TicketListPage.jsx` (Líneas 74-89), los badges de prioridad se implementan con clases inline en lugar de usar el componente `Badge`.

**Por qué es un problema:**
- **Inconsistencia:** Otros badges en la app usan el componente `Badge`.
- **Mantenibilidad:** Cambiar el estilo de un badge de prioridad requiere tocar el JSX directamente.

**Solución Propuesta:**

```jsx
// ANTES (Líneas 74-89)
<span
  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
    ticket.prioridad === "baja"
      ? "bg-green-500/10 text-green-500 border-transparent"
      : (ticket.prioridad === "media")
        ? "bg-yellow-500/10 text-yellow-500 border-transparent"
        : ticket.prioridad === "alta"
          ? "bg-orange-500/10 text-orange-500 border-transparent"
          : ticket.prioridad === "urgente"
            ? "bg-red-500/10 text-red-500 border-transparent"
            : "bg-gray-500/10 text-gray-500 border-transparent"
  }`}
>
  {ticket?.prioridad || "media"}
</span>

// DESPUÉS - Usar Badge con helper
import Badge from "@/shared/components/ui/Badge";

const getPriorityVariant = (priority) => {
  const map = {
    baja: "success",
    media: "warning",
    alta: "error",
    urgente: "error",
  };
  return map[priority] || "neutral";
};

// En render:
<Badge variant={getPriorityVariant(ticket.prioridad)}>
  {ticket?.prioridad || "media"}
</Badge>

// Nota: Si los colores predefinidos no coinciden exactamente con los deseados
// (ej: naranja para "alta"), extender Badge con una nueva variante:

// En Badge.jsx, agregar:
const variants = {
  // ...variantes existentes...
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

// Y usar:
const getPriorityVariant = (priority) => {
  const map = {
    baja: "success",
    media: "warning",
    alta: "orange",
    urgente: "error",
  };
  return map[priority] || "neutral";
};
```

---

## 13. Patrón DRY: Skeletons de Carga

### Hallazgo 13.1: Múltiples Implementaciones de Skeleton

**Tipo de Mejora:** 🧹 Limpieza DRY

**Hallazgo:**  
Los estados de carga (skeletons) se implementan manualmente en múltiples páginas con estructuras similares:
- `CustomerListPage` (Líneas 9-15)
- `TagsListPage` (Líneas 182-192)
- `IntegrationsListPage` (Líneas 153-163)
- `AuditLogsPage` (Líneas 264-274)

**Por qué es un problema:**  
La lógica de "mostrar N placeholders animados" se repite en cada página.

**Solución Propuesta:**

```jsx
// Crear componente: src/shared/components/ui/SkeletonList.jsx
import React from "react";

const SkeletonList = ({ count = 5, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-dt-card border border-dt-border rounded-lg p-4 animate-pulse"
        >
          <div className="h-4 bg-dt-border rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-dt-border rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;

// USO
import SkeletonList from "@/shared/components/ui/SkeletonList";

{isLoading ? (
  <SkeletonList count={5} />
) : (
  // ...contenido real...
)}
```

---

## 14. Inconsistencia: Uso de Material Icons vs React Icons

### Hallazgo 14.1: Mezcla de Librerías de Iconos

**Tipo de Mejora:** 🎨 Inconsistencia de Diseño

**Hallazgo:**  
Algunas páginas usan `react-icons` (`FiSearch`, `FiPlus`, etc.) mientras que `CustomerListPage` y `AdminDashboardPage` usan `<span className="material-symbols-outlined">`.

**Por qué es un problema:**
- **Bundle size:** Se cargan dos librerías de iconos cuando solo se necesita una.
- **Inconsistencia visual:** Los iconos tienen diferentes estilos y grosores.

**Solución Propuesta:**

Estandarizar en **react-icons** (ya se usa en la mayoría de la app):

```jsx
// ANTES (CustomerListPage)
<span className="material-symbols-outlined text-2xl text-dt-accent">
  person
</span>

// DESPUÉS
import { FiUser } from "react-icons/fi";

<FiUser className="text-2xl text-dt-accent" />

// Mapeo de material icons → react-icons:
// person → FiUser
// group → FiUsers
// phone → FiPhone
// confirmation_number → FiFileText
// inventory_2 → FiPackage
// arrow_forward → FiArrowRight
// trending_up → FiTrendingUp
// check_circle → FiCheckCircle
// timer → FiClock
// hourglass_bottom → FiWatch
```

---

## 15. Inconsistencia: Botones "link" vs "ghost"

### Hallazgo 15.1: Uso Inconsistente de Variantes de Botón

**Tipo de Mejora:** 🎨 Inconsistencia de Diseño

**Hallazgo:**  
El componente `Button` define variantes `ghost`, `outline`, `secondary`, pero en `TemplateListPage` y `AgentListPage` se usan variantes `link` y `danger-link` que no están definidas en el componente.

**Por qué es un problema:**  
Si las variantes no existen en el componente, los botones se renderizan con estilos por defecto (probablemente `primary`), lo cual es un error.

**Solución Propuesta:**

```jsx
// Opción 1: Extender Button.jsx para soportar variantes "link"
// En src/shared/components/ui/Button.jsx, agregar:

const variantStyles = {
  // ...variantes existentes...
  link: "bg-transparent text-dt-accent hover:text-dt-accent-hover border-none underline",
  "danger-link": "bg-transparent text-dt-error hover:text-red-400 border-none underline",
};

// Opción 2: Usar variantes existentes (RECOMENDADO)
// ANTES
<Button variant="link" onClick={...}>
  Editar
</Button>

// DESPUÉS
<Button variant="ghost" onClick={...}>
  Editar
</Button>

// ANTES
<Button variant="danger-link" onClick={...}>
  Eliminar
</Button>

// DESPUÉS
<Button variant="danger" size="sm" onClick={...}>
  Eliminar
</Button>
```

---

## 16. Patrón DRY: Lógica de Paginación en URL

### Hallazgo 16.1: Repetición de Lógica de SearchParams para Paginación

**Tipo de Mejora:** 🧹 Limpieza DRY

**Hallazgo:**  
La lógica para leer/escribir `page` y `limit` de URL search params se repite idénticamente en:
- `TicketListPage.jsx`
- `OrderListPage.jsx`

**Solución Propuesta:**

```jsx
// Crear hook: src/shared/hooks/usePaginationParams.js
import { useSearchParams } from "react-router-dom";

export const usePaginationParams = (defaultLimit = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || defaultLimit);
  
  const setPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };
  
  const setLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", String(newLimit));
    params.set("page", "1"); // reset to page 1 when changing page size
    setSearchParams(params);
  };
  
  return { page, limit, setPage, setLimit };
};

// USO en TicketListPage.jsx
// ANTES
const [searchParams, setSearchParams] = useSearchParams();
const pageParam = Number(searchParams.get("page") || 1);
const limitParam = Number(searchParams.get("limit") || 25);

// ...más tarde...
onPageChange={(newPage) => {
  const params = new URLSearchParams(searchParams);
  params.set("page", String(newPage));
  setSearchParams(params);
}}
onItemsPerPageChange={(newLimit) => {
  const params = new URLSearchParams(searchParams);
  params.set("limit", String(newLimit));
  params.set("page", "1");
  setSearchParams(params);
}}

// DESPUÉS
const { page, limit, setPage, setLimit } = usePaginationParams(25);

// ...más tarde...
onPageChange={setPage}
onItemsPerPageChange={setLimit}
```

---