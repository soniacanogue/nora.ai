# Análisis: Qué Falta en las Especificaciones de UI-01 a UI-05

Este documento identifica los detalles faltantes o incompletos en las especificaciones de las interfaces de usuario UI-01 a UI-05, comparando el documento del plan con lo necesario para una implementación completa.

---

## UI-01: Dashboard del Administrador

### ✅ Lo que está especificado:
- Widgets principales (KPIs, Carga de Trabajo, Rendimiento del Equipo, Distribución)
- Fuentes de datos (vista `AgregadoDiarioTicket`, queries específicas)
- Estructura básica de respuesta de API

### ❌ Lo que falta:

#### 1. **Diseño Visual y Layout**
- **Grid System**: ¿Cómo se organizan los widgets en diferentes breakpoints? (mobile, tablet, desktop)
- **Espaciado**: ¿Qué padding/margin entre widgets?
- **Colores y Temas**: ¿Cómo se diferencian visualmente los estados (ej. tickets resueltos vs pendientes)?
- **Iconografía**: ¿Qué iconos usar para cada métrica? (actualmente solo hay emojis en el código)

#### 2. **Interactividad y Comportamiento**
- **Time Range Selector**: Está implementado pero no especificado cómo debe comportarse al cambiar (¿refresco automático? ¿loading state?)
- **Tooltips**: ¿Qué información adicional mostrar al hacer hover sobre gráficos?
- **Drill-down**: ¿Los gráficos deben ser clickeables para filtrar tickets? (ej. click en "WISMO" → filtrar tickets con esa etiqueta)
- **Actualización en Tiempo Real**: ¿Debe usar SSE para actualizar métricas automáticamente?

#### 3. **Estados y Manejo de Errores**
- **Estado Vacío**: ¿Qué mostrar cuando no hay datos? (ej. "No hay tickets hoy")
- **Errores Parciales**: Si falla un widget, ¿se oculta o se muestra un mensaje de error?
- **Loading States**: ¿Skeleton loaders individuales por widget o uno global?

#### 4. **Accesibilidad**
- **ARIA Labels**: Etiquetas para lectores de pantalla
- **Navegación por Teclado**: ¿Cómo navegar entre widgets?
- **Contraste de Colores**: Especificar ratios WCAG

#### 5. **Detalles de Implementación**
- **Caché de Datos**: ¿Cuánto tiempo cachear los datos del dashboard?
- **Paginación**: Si hay muchos agentes, ¿cómo paginar la tabla de rendimiento?
- **Exportación**: ¿Debe poder exportar el dashboard a PDF/CSV?

---

## UI-02: Dashboard del Agente

### ✅ Lo que está especificado:
- Widgets principales (Mis Métricas, Mis Colas, Actividad Reciente)
- Estructura de datos y fuentes

### ❌ Lo que falta:

#### 1. **Personalización y Contexto**
- **Filtros Temporales**: ¿Debe tener selector de rango de fechas como el admin? (Hoy, Esta Semana, Este Mes)
- **Ordenamiento de Colas**: ¿Cómo ordenar las tarjetas de colas? (¿por prioridad? ¿por cantidad?)
- **Notificaciones Visuales**: ¿Cómo destacar colas con nuevos tickets? (badges, animaciones)

#### 2. **Interactividad de las Colas**
- **Click en Cola**: ¿Debe navegar directamente a la lista filtrada o mostrar un preview?
- **Acciones Rápidas**: ¿Debe haber botones de acción rápida en las tarjetas? (ej. "Tomar siguiente ticket")
- **Actualización en Tiempo Real**: ¿Cómo actualizar contadores cuando llegan nuevos tickets?

#### 3. **Actividad Reciente**
- **Límite de Items**: ¿Cuántos items mostrar? (actualmente 5 en el código)
- **Click en Actividad**: ¿Qué debe pasar al hacer click? (navegar al ticket, mostrar detalles)
- **Filtros**: ¿Debe poder filtrar por tipo de evento? (asignaciones, respuestas, etc.)
- **Marcar como Leído**: ¿Debe poder marcar notificaciones como leídas?

#### 4. **Estados Vacíos y Errores**
- **Sin Tickets Asignados**: Mensaje motivacional o guía de acción
- **Sin Actividad**: ¿Qué mostrar cuando no hay actividad reciente?

#### 5. **Responsive Design**
- **Mobile**: ¿Cómo se reorganizan los widgets en móvil? (¿stack vertical? ¿tabs?)
- **Tablet**: Layout intermedio

---

## UI-03: Vista de Triaje de Agente (Nivel 1)

### ✅ Lo que está especificado:
- Cola de tickets ordenada por confianza
- Panel de decisión con vista dividida
- Acciones rápidas (Aprobar, Editar, Escalar, Reasignar)
- Banner de sugerencia de fusión

### ❌ Lo que falta:

#### 1. **Layout y Diseño Visual**
- **Vista Dividida Responsive**: ¿Cómo se comporta en móvil? (¿stack vertical? ¿tabs?)
- **Ancho de Columnas**: ¿Qué porcentaje del ancho para cada columna? (actualmente 2/3 y 1/3)
- **Sticky Panel**: ¿El panel derecho debe ser sticky al hacer scroll? (está implementado pero no especificado)

#### 2. **Cola de Tickets - Detalles**
- **Paginación**: ¿Cuántos tickets mostrar por página? ¿Scroll infinito?
- **Filtros Adicionales**: ¿Debe poder filtrar por etiqueta, cliente, fecha?
- **Búsqueda**: ¿Debe tener barra de búsqueda para encontrar tickets específicos?
- **Ordenamiento Alternativo**: ¿Debe poder cambiar el orden? (por fecha, por prioridad, por cliente)

#### 3. **Panel de Decisión - Editor de Texto**
- **Editor Enriquecido**: ¿Debe ser un textarea simple o un editor WYSIWYG? (actualmente es textarea)
- **Variables de Plantilla**: ¿Debe soportar variables como `{{nombre_cliente}}` que se reemplacen automáticamente?
- **Historial de Ediciones**: ¿Debe guardar versiones anteriores de la respuesta editada?
- **Validación**: ¿Qué validaciones aplicar antes de enviar? (longitud mínima, caracteres especiales)

#### 4. **Panel de Metadatos de IA**
- **Visualización de `metaDatosIA`**: ¿Cómo mostrar el JSON de razonamiento? (¿expandible? ¿formateado?)
- **Etiquetas Editables**: ¿Debe poder agregar/remover etiquetas antes de enviar?
- **Confianza Visual**: ¿Cómo representar visualmente el nivel de confianza? (barra de progreso, color, icono)

#### 5. **Acciones Rápidas - Detalles**
- **Aprobar y Enviar**:
  - ¿Debe mostrar confirmación antes de enviar?
  - ¿Qué pasa si el envío falla? (retry, rollback)
  - ¿Debe mostrar un estado de "enviando..."?
- **Editar y Enviar**:
  - ¿Debe abrir un modal con editor más grande?
  - ¿Debe guardar como borrador?
- **Escalar a Nivel 2**:
  - ¿Debe requerir una nota interna obligatoria?
  - ¿Debe permitir seleccionar a qué cola escalar?
- **Reasignar**:
  - ¿Debe mostrar un selector de agentes con información (carga actual, especialidad)?
  - ¿Debe permitir reasignar a múltiples agentes?

#### 6. **Banner de Sugerencia de Fusión**
- **Diseño Visual**: ¿Cómo debe verse? (color, tamaño, posición)
- **Acciones**:
  - "Ver Ticket Original": ¿Debe abrir en nueva pestaña o navegar?
  - "Fusionar": ¿Debe mostrar confirmación con preview de qué se fusionará?
  - "Ignorar": ¿Debe guardar esta decisión para no mostrar la sugerencia de nuevo?

#### 7. **Información de Orden Vinculada**
- **Panel de Orden**: ¿Debe ser expandible/colapsable?
- **Acciones desde el Panel**: ¿Debe poder editar la orden desde aquí? ¿Ver historial completo?

#### 8. **Historial del Cliente**
- **¿Dónde se muestra?**: ¿Panel lateral? ¿Modal? ¿Tooltip?
- **¿Qué información mostrar?**: Tickets anteriores, órdenes, preferencias
- **Acciones**: ¿Debe poder abrir tickets anteriores desde aquí?

#### 9. **Estados y Feedback**
- **Loading States**: ¿Cómo mostrar que se está procesando la acción?
- **Confirmaciones**: ¿Qué acciones requieren confirmación explícita?
- **Notificaciones**: ¿Cómo notificar éxito/error de acciones?

#### 10. **Navegación**
- **Navegación entre Tickets**: ¿Debe tener botones "Anterior/Siguiente" para navegar sin volver a la lista?
- **Atajos de Teclado**: ¿Debe soportar atajos? (ej. `Ctrl+Enter` para aprobar)

---

## UI-04: Vista de Especialista de Agente (Nivel 2)

### ✅ Lo que está especificado:
- Vista de tabla para tickets escalados
- Modo "Flujo Continuo" con lógica de prioridad (4 Urgentes, 3 Altas, etc.)
- Endpoint API `/tickets/next-in-flow`

### ❌ Lo que falta:

#### 1. **Vista de Tabla - Detalles**
- **Columnas Específicas**: ¿Qué columnas mostrar exactamente? (Prioridad, Asunto, Cliente, Agente, Fecha, Estado, Acciones)
- **Ordenamiento**: ¿Por defecto cómo ordenar? ¿Permitir ordenar por cualquier columna?
- **Filtros Avanzados**: 
  - ¿Filtro por etiqueta?
  - ¿Filtro por rango de fechas?
  - ¿Filtro por agente asignado?
  - ¿Filtro por cliente?
- **Búsqueda**: ¿Barra de búsqueda global?
- **Paginación**: ¿Cuántos items por página? ¿Scroll infinito?

#### 2. **Modo "Flujo Continuo" - Detalles de UX**
- **Activación/Desactivación**: ¿Cómo activar? (toggle, botón, preferencia guardada)
- **Indicador Visual**: ¿Cómo mostrar que está en modo flujo continuo? (banner, badge)
- **Vista del Ticket**: 
  - ¿Debe usar la misma vista que UI-03 o una simplificada?
  - ¿Debe mostrar toda la información o solo lo esencial?
- **Navegación**:
  - ¿Botón "Siguiente" manual además del automático?
  - ¿Botón "Saltar" para pasar un ticket?
  - ¿Botón "Pausar" para salir temporalmente del flujo?
- **Contador de Progreso**: ¿Mostrar "Ticket 3 de 15 en esta ronda"?
- **Cola Vacía**: ¿Qué mostrar cuando no hay más tickets? (mensaje, opción de recargar)

#### 3. **Lógica de Prioridad - Detalles**
- **Visualización del Ciclo**: ¿Debe mostrar qué parte del ciclo está? (ej. "Procesando Urgentes: 2/4")
- **Interrupción del Ciclo**: ¿Qué pasa si un ticket Urgente nuevo llega mientras procesa Media?
- **Persistencia**: ¿El ciclo se guarda por sesión o se reinicia al recargar?
- **Personalización**: ¿Debe permitir al agente ajustar las proporciones? (ej. 5 Urgentes en lugar de 4)

#### 4. **Acciones Específicas de Nivel 2**
- **Tomar Ticket (Claim)**: 
  - ¿Debe mostrar confirmación?
  - ¿Qué pasa si otro agente ya lo tomó? (conflicto)
- **Responder Manualmente**:
  - ¿Debe tener el mismo editor que Nivel 1?
  - ¿Debe poder usar plantillas?
  - ¿Debe poder adjuntar archivos?
- **Cerrar Ticket**:
  - ¿Debe requerir una nota de resolución?
  - ¿Debe permitir marcar como "resuelto" vs "cerrado por inactividad"?

#### 5. **Vista de Tabla vs Flujo Continuo**
- **Cambio de Vista**: ¿Debe poder cambiar entre vistas sin perder contexto?
- **Sincronización**: ¿Si toma un ticket en tabla, debe aparecer en flujo continuo?

#### 6. **Información Contextual**
- **Historial Completo**: ¿Debe mostrar todo el historial del ticket incluyendo acciones de Nivel 1?
- **Notas Internas**: ¿Cómo distinguir notas internas de mensajes al cliente?
- **Archivos Adjuntos**: ¿Cómo mostrar y gestionar archivos? (galería, descarga, preview)

#### 7. **Estados y Feedback**
- **Auto-guardado**: ¿Debe guardar borradores automáticamente?
- **Conflictos**: ¿Cómo manejar cuando dos agentes trabajan en el mismo ticket?
- **Notificaciones**: ¿Cómo notificar asignaciones, respuestas del cliente, etc.?

---

## UI-05: Interfaz de Importación de CSV

### ✅ Lo que está especificado:
- Flujo en 3 pasos (Subida, Mapeo, Validación)
- Componentes básicos y flujo

### ❌ Lo que falta:

#### 1. **Paso 1: Subida de Archivo - Detalles**
- **Validaciones de Archivo**:
  - ¿Tamaño máximo? (ej. 10MB)
  - ¿Formatos permitidos? (solo CSV o también Excel?)
  - ¿Encoding requerido? (UTF-8, Latin-1)
- **Drag & Drop**: 
  - ¿Debe soportar arrastrar y soltar? (no está especificado)
  - ¿Feedback visual durante el drag?
- **Preview Inmediato**: ¿Debe mostrar preview del archivo antes de continuar?
- **Múltiples Archivos**: ¿Debe soportar importar múltiples archivos a la vez?

#### 2. **Paso 2: Mapeo y Previsualización - Detalles**
- **Preview de Datos**:
  - ¿Cuántas filas mostrar? (actualmente 1 en el código, debería ser 5-10)
  - ¿Debe mostrar todas las columnas o solo las mapeadas?
  - ¿Debe permitir scroll horizontal si hay muchas columnas?
- **Mapeo Inteligente**:
  - ¿Debe intentar auto-mapear columnas por nombre? (ej. "Order ID" → "id")
  - ¿Debe sugerir mapeos basados en tipos de datos?
- **Validación en Tiempo Real**:
  - ¿Debe validar mientras el usuario mapea?
  - ¿Debe mostrar errores por fila en el preview?
- **Campos Opcionales vs Requeridos**:
  - ¿Cómo distinguir visualmente?
  - ¿Debe permitir mapear campos opcionales?
- **Transformaciones**:
  - ¿Debe permitir transformar datos? (ej. convertir formato de fecha)
  - ¿Debe permitir valores por defecto para campos vacíos?

#### 3. **Paso 3: Validación e Importación - Detalles**
- **Validación Pre-importación**:
  - ¿Debe validar todo el archivo antes de importar?
  - ¿Debe mostrar un resumen de errores encontrados?
  - ¿Debe permitir corregir errores y reintentar?
- **Progreso de Importación**:
  - ¿Barra de progreso detallada? (actualmente solo porcentaje)
  - ¿Debe mostrar fila actual procesándose?
  - ¿Debe permitir cancelar la importación?
- **Manejo de Errores**:
  - **Errores por Fila**: ¿Cómo mostrar? (tabla, lista expandible)
  - **Errores Críticos**: ¿Qué errores detienen la importación vs permiten continuar?
  - **Archivo de Errores**: ¿Formato del CSV de errores? ¿Qué columnas incluir?
- **Resumen Final**:
  - **Métricas Adicionales**: ¿Tiempo de importación? ¿Velocidad (filas/segundo)?
  - **Acciones Post-importación**: 
    - ¿Botón para ver órdenes importadas?
    - ¿Botón para descargar reporte completo?
    - ¿Botón para re-importar solo los errores?

#### 4. **Estados y Feedback**
- **Loading States**: 
  - ¿Skeleton durante parsing?
  - ¿Spinner durante importación?
- **Mensajes de Error Específicos**:
  - ¿Cómo mostrar errores de formato vs errores de datos?
  - ¿Cómo mostrar errores de conexión a BD?
- **Confirmaciones**:
  - ¿Debe confirmar antes de importar si hay muchos errores?
  - ¿Debe advertir sobre duplicados potenciales?

#### 5. **Funcionalidades Avanzadas (Post-MVP pero mencionar)**
- **Plantillas de Mapeo**: ¿Guardar mapeos comunes para reutilizar?
- **Programación**: ¿Permitir programar importaciones recurrentes?
- **Validación de Duplicados**: ¿Cómo manejar órdenes que ya existen? (actualizar, saltar, error)

#### 6. **UX y Accesibilidad**
- **Navegación entre Pasos**: ¿Debe poder volver atrás? ¿Perder datos al volver?
- **Guardado de Progreso**: ¿Debe guardar el estado si el usuario cierra la página?
- **Ayuda Contextual**: ¿Tooltips explicando cada campo? ¿Link a documentación?

#### 7. **Integración con Backend**
- **Endpoint de Preview**: ¿Debe llamar a `/imports/orders/preview` para validar antes del mapeo?
- **Job Asíncrono**: 
  - ¿Cómo mostrar progreso si es un job en segundo plano?
  - ¿Debe usar SSE para actualizaciones en tiempo real?
  - ¿Qué hacer si el usuario cierra la página durante la importación?

---

## Aspectos Transversales Faltantes (Aplican a todas las UIs)

### 1. **Diseño Responsive**
- **Breakpoints Específicos**: ¿Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)?
- **Comportamiento por Breakpoint**: Especificar cómo cambia cada UI en cada tamaño

### 2. **Estados de Carga**
- **Skeleton Loaders**: ¿Diseño específico para cada componente?
- **Loading Spinners**: ¿Cuándo usar cada uno?

### 3. **Manejo de Errores**
- **Tipos de Error**: Red, validación, permisos, servidor
- **Mensajes de Error**: ¿Tono, formato, acciones sugeridas?

### 4. **Notificaciones**
- **Toast Notifications**: ¿Cuándo usar? ¿Duración? ¿Posición?
- **Notificaciones Persistentes**: ¿Cuándo usar modales vs toasts?

### 5. **Navegación**
- **Breadcrumbs**: ¿Dónde mostrar?
- **Búsqueda Global**: ¿Debe haber una barra de búsqueda global?

### 6. **Accesibilidad**
- **ARIA Labels**: Especificar para componentes interactivos
- **Navegación por Teclado**: Atajos específicos
- **Contraste**: Valores específicos de colores

### 7. **Performance**
- **Lazy Loading**: ¿Qué componentes cargar bajo demanda?
- **Virtualización**: ¿Para listas grandes?
- **Caché**: ¿Estrategia de caché para cada UI?

### 8. **Testing**
- **Casos de Prueba UI**: ¿Qué escenarios probar para cada UI?
- **Estados Edge**: ¿Qué probar? (datos vacíos, errores, timeouts)

---

## Recomendaciones de Priorización

### **Crítico para MVP:**
1. Estados de carga y error para todas las UIs
2. Responsive design básico (mobile y desktop)
3. Validaciones y confirmaciones para acciones críticas
4. Feedback visual inmediato para todas las acciones

### **Importante pero Post-MVP:**
1. Modo flujo continuo completo (UI-04)
2. Editor enriquecido de texto (UI-03)
3. Auto-mapeo inteligente en importación (UI-05)
4. Drill-down en dashboards (UI-01, UI-02)

### **Nice to Have:**
1. Atajos de teclado
2. Personalización de vistas
3. Exportación de dashboards
4. Plantillas de mapeo guardadas

---

## Conclusión

Las especificaciones actuales cubren la funcionalidad básica pero faltan detalles críticos de:
- **UX/UI**: Diseño visual, layout, interacciones
- **Estados**: Loading, error, vacío
- **Validaciones**: Reglas de negocio en el frontend
- **Responsive**: Comportamiento en diferentes dispositivos
- **Accesibilidad**: Requisitos de accesibilidad
- **Performance**: Optimizaciones y estrategias de carga

Se recomienda completar estas especificaciones antes de continuar con el desarrollo para evitar retrabajo y asegurar una experiencia de usuario consistente.

