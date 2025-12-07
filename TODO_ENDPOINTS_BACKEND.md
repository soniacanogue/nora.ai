# TODO: Endpoints y Mejoras Recomendadas para Backend

Este documento detalla los endpoints que deben implementarse y las verificaciones que deben realizarse en el backend de NoraAI, basado en el análisis exhaustivo de los 25 casos de uso.

---

## 🔴 PRIORIDAD ALTA (Crítico para funcionalidad core)

### 1. Base de Conocimiento para IA (UC-14)

**Estado:** ❌ NO IMPLEMENTADO

**Endpoints a implementar:**

```typescript
// CRUD de documentos de conocimiento
GET    /knowledge-base?categoria=&buscar=
POST   /knowledge-base
GET    /knowledge-base/:id
PATCH  /knowledge-base/:id
DELETE /knowledge-base/:id

// Búsqueda y categorización
POST   /knowledge-base/search          // Búsqueda semántica
GET    /knowledge-base/categories      // Listar categorías
```

**DTOs sugeridos:**

```typescript
interface CreateKnowledgeBaseDto {
  titulo: string;
  contenido: string;
  categoria: string;  // 'faq' | 'politica' | 'procedimiento' | 'producto'
  etiquetas: string[];
  activo: boolean;
  prioridad: number;  // Para ordenar resultados de búsqueda
}

interface UpdateKnowledgeBaseDto {
  titulo?: string;
  contenido?: string;
  categoria?: string;
  etiquetas?: string[];
  activo?: boolean;
  prioridad?: number;
}

interface KnowledgeBaseSearchDto {
  query: string;
  categoria?: string;
  limite?: number;
  umbralSimilitud?: number;  // Para búsqueda vectorial futura
}
```

**Justificación:**
Sin base de conocimiento, la IA no puede acceder a información específica de GearUp (políticas de devolución, procedimientos, FAQs). Esto limita severamente la capacidad de la IA para proporcionar respuestas precisas y útiles.

**Modelo de datos sugerido:**

```typescript
interface DocumentoConocimiento {
  id: string;
  titulo: string;
  contenido: string;
  categoria: 'faq' | 'politica' | 'procedimiento' | 'producto' | 'general';
  etiquetas: string[];
  activo: boolean;
  prioridad: number;
  embedding?: number[];  // Para búsqueda semántica (futuro)
  creadoEn: Date;
  actualizadoEn: Date;
  creadoPor: string;  // ID del usuario
  versionHistorial?: VersionDocumento[];
}

interface VersionDocumento {
  version: number;
  contenido: string;
  modificadoEn: Date;
  modificadoPor: string;
}
```

**Integración con UC-24 (Generar Sugerencia de Respuesta):**
El sistema debe buscar en la base de conocimiento documentos relevantes y agregarlos al contexto del prompt enviado a la IA.

---

### 2. Verificar Procesos Automáticos (UC-23, UC-24, UC-25)

**Estado:** ⚠️ IMPLEMENTACIÓN PARCIAL - REQUIERE VERIFICACIÓN

#### A. UC-23: Crear Ticket (Proceso Interno)

**Verificaciones necesarias:**

- [ ] **RF-TICKET-006:** Confirmar que se envía email de acuse de recibo automáticamente
  - Verificar que existe un servicio de email configurado
  - Confirmar que se dispara tras la creación exitosa del ticket
  - Validar plantilla de email de acuse de recibo

- [ ] **RF-IA-001:** Confirmar que se inicia procesamiento IA automáticamente
  - Verificar que se agrega el ticket a una cola de procesamiento
  - Confirmar que existe un worker que procesa la cola
  - Validar transición de estado: `nuevo` → `pendiente_ia`

- [ ] **Generación de ID de ticket:** Confirmar formato alfanumérico (ej: ABC-123, TICK-001)

- [ ] **Validación de ordenId:** Verificar que el sistema valida que la orden existe antes de vincular

**Código de ejemplo para verificar:**

```typescript
// En el servicio de creación de tickets
async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
  // 1. Crear ticket
  const ticket = await this.ticketRepository.save({
    ...createTicketDto,
    estado: 'nuevo',
    ticketId: this.generateTicketId(),
  });

  // 2. VERIFICAR: ¿Se envía acuse de recibo?
  await this.emailService.sendTicketConfirmation(ticket);
  
  // 3. VERIFICAR: ¿Se dispara procesamiento IA?
  await this.aiQueue.add('process-ticket', { ticketId: ticket.id });
  
  return ticket;
}
```

#### B. UC-24: Generar Sugerencia de Respuesta (Proceso Interno)

**Verificaciones necesarias:**

- [ ] **Worker asíncrono:** Confirmar que existe un worker que procesa tickets en estado `pendiente_ia`

- [ ] **Selección de ConfigAgente:** Verificar lógica de selección (keywords en asunto/cuerpo)

- [ ] **Construcción de prompt:** Confirmar que se inyecta contexto completo:
  - Mensaje inicial del cliente
  - Datos del cliente (nombre, email)
  - Historial de tickets del cliente
  - Datos de la orden vinculada (si existe)
  - Documentos relevantes de base de conocimiento ⚠️ (requiere UC-14)

- [ ] **Llamada a OpenRouter:** Verificar configuración de API key y modelo

- [ ] **Almacenamiento de respuesta:** Confirmar que se guardan campos:
  - `respuestaSugeridaIA`
  - `confianzaIA`
  - `etiquetasSugeridasIA`
  - `metadataIA` (modelo usado, timestamp, etc.)

- [ ] **RF-IA-005: Escalado automático:** Verificar lógica de escalado:
  ```typescript
  if (
    respuestaIA.escalate === true ||
    respuestaIA.confianza < config.umbralConfianza ||
    ticket.contienePalabrasClaveSensibles() ||
    ticket.tieneAdjuntosDeImagenes()
  ) {
    ticket.estado = 'escalado_nivel_2';
  } else {
    ticket.estado = 'ia_sugerido';
  }
  ```

- [ ] **Notificación en tiempo real:** Confirmar que se emite evento SSE/WebSocket

- [ ] **Manejo de errores:** Verificar que fallos cambian estado a `error_ia`

#### C. UC-25: Notificar Nuevo Email (Webhook)

**Verificaciones necesarias:**

- [ ] **Validación de firma de Mailgun:** CRÍTICO para seguridad
  ```typescript
  @Post('/webhooks/mailgun/inbound')
  async handleInboundEmail(@Body() payload: any, @Headers() headers: any) {
    // VERIFICAR: ¿Se valida la firma?
    const isValid = this.mailgunService.verifyWebhookSignature(
      payload.timestamp,
      payload.token,
      payload.signature
    );
    
    if (!isValid) {
      throw new ForbiddenException('Invalid webhook signature');
    }
    
    // ... resto del procesamiento
  }
  ```

- [ ] **Parsing de headers:** Confirmar extracción de `In-Reply-To`, `References`, `Subject`

- [ ] **Detección de ticket existente:** Verificar búsqueda de patrón `[Ticket #ABC-123]`

- [ ] **Manejo de adjuntos de email:** Confirmar que se procesan y almacenan

- [ ] **Respuestas HTTP apropiadas:**
  - 200 OK: Procesamiento exitoso
  - 400 Bad Request: Payload malformado
  - 403 Forbidden: Firma inválida
  - 500 Internal Server Error: Error interno (Mailgun reintentará)

- [ ] **Idempotencia:** Verificar que reintentos de Mailgun no crean tickets duplicados

---

## 🟡 PRIORIDAD MEDIA (Mejora experiencia y funcionalidad)

### 3. Aplicar Plantilla a Ticket (UC-13 mejorado)

**Estado:** ⚠️ GESTIÓN DE PLANTILLAS IMPLEMENTADA, FALTA ENDPOINT DE APLICACIÓN

**Endpoint a implementar:**

```typescript
POST /tickets/:id/apply-template/:templateId

// DTO
interface ApplyTemplateDto {
  sobreescribirRespuesta?: boolean;  // Si hay ya una respuesta sugerida
}

// Respuesta
interface ApplyTemplateResponse {
  asuntoGenerado: string;
  cuerpoGenerado: string;
  variablesSustituidas: Record<string, string>;
}
```

**Lógica de implementación:**

```typescript
async applyTemplate(
  ticketId: string,
  templateId: string,
  dto: ApplyTemplateDto
): Promise<ApplyTemplateResponse> {
  const ticket = await this.findTicket(ticketId);
  const template = await this.templateService.findOne(templateId);
  
  // Construir contexto de variables
  const context = {
    ticketId: ticket.ticketId,
    nombreCliente: ticket.cliente.nombre,
    correoCliente: ticket.cliente.correo,
    ordenId: ticket.orden?.ordenId || 'N/A',
    fechaCreacion: ticket.creadoEn.toLocaleString(),
    // ... más variables según necesidad
  };
  
  // Sustituir variables en plantilla
  const asuntoGenerado = this.replaceVariables(template.plantillaAsunto, context);
  const cuerpoGenerado = this.replaceVariables(template.plantillaCuerpo, context);
  
  // Opcional: Actualizar ticket con respuesta generada
  if (dto.sobreescribirRespuesta) {
    ticket.respuestaSugeridaIA = cuerpoGenerado;
    await this.ticketRepository.save(ticket);
  }
  
  return { asuntoGenerado, cuerpoGenerado, variablesSustituidas: context };
}

private replaceVariables(template: string, context: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
    return context[variable] || match;
  });
}
```

**Justificación:**
Aunque se pueden gestionar plantillas, los agentes necesitan una forma sencilla de aplicarlas a un ticket específico con sustitución automática de variables.

---

### 4. Descarga de Archivos (UC-10 mejorado)

**Estado:** ⚠️ UPLOAD IMPLEMENTADO, FALTA CONFIRMAR DOWNLOAD

**Endpoint a verificar/implementar:**

```typescript
GET /uploads/:fileId/download
GET /uploads/:fileId/metadata
```

**Verificación:**
- Confirmar que existe endpoint para descargar archivos por ID
- Verificar que se valida permisos (usuario debe tener acceso al ticket asociado)
- Confirmar que se sirve el archivo con headers apropiados:
  - `Content-Type`: tipo MIME del archivo
  - `Content-Disposition: attachment; filename="nombre.ext"`
  - `Content-Length`: tamaño del archivo

**Ejemplo de implementación:**

```typescript
@Get('/uploads/:fileId/download')
async downloadFile(
  @Param('fileId') fileId: string,
  @CurrentUser() user: User,
  @Res() res: Response
) {
  const archivo = await this.uploadService.findOne(fileId);
  
  // Validar permisos
  const ticket = await this.ticketService.findTicketByFileId(fileId);
  if (!this.canUserAccessTicket(user, ticket)) {
    throw new ForbiddenException('No tienes permiso para descargar este archivo');
  }
  
  // Obtener archivo del almacenamiento (S3, Azure, etc.)
  const stream = await this.storageService.getFileStream(archivo.urlAlmacenamiento);
  
  // Configurar headers
  res.set({
    'Content-Type': archivo.tipoMime,
    'Content-Disposition': `attachment; filename="${archivo.nombreArchivo}"`,
    'Content-Length': archivo.tamano,
  });
  
  stream.pipe(res);
}
```

---

## 🟢 PRIORIDAD BAJA (Nice to have)

### 5. Gestión de Contraseñas (UC-16 mejorado)

**Endpoints a implementar:**

```typescript
POST /users/change-password
POST /auth/forgot-password
POST /auth/reset-password
```

**DTOs:**

```typescript
interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordDto {
  email: string;
}

interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
```

---

### 6. Test de Integración (UC-18 mejorado)

**Endpoint a implementar:**

```typescript
POST /integrations/:id/test
```

**Lógica:**
- Intenta conectar con el servicio externo usando las credenciales guardadas
- Ejecuta una operación de prueba (ej: enviar email de test a admin)
- Retorna resultado: éxito/fallo con mensaje descriptivo

---

### 7. Búsqueda de Duplicados y Fusión (Mejorado)

**Endpoints existentes:**

```typescript
POST /tickets/:id/find-duplicates  ✅ Implementado
POST /tickets/:id/merge            ✅ Implementado
```

**Verificaciones:**
- Confirmar que find-duplicates usa similitud de asunto/contenido
- Verificar que merge mueve todos los mensajes y cierra ticket origen
- Validar que se mantiene trazabilidad (ticket fusionado referencia al destino)

---

## 📋 Verificaciones de Configuración

### Integraciones a Documentar

#### Mailgun (Email)
- [ ] Configuración de dominio de envío
- [ ] Configuración de DNS (SPF, DKIM, MX records)
- [ ] URL del webhook configurada
- [ ] API key guardada en variables de entorno
- [ ] Plantillas de email (acuse de recibo, notificaciones)

#### OpenRouter (IA)
- [ ] API key configurada
- [ ] Modelos disponibles documentados
- [ ] Límites de rate y costo por modelo
- [ ] Formato de respuesta esperado (JSON schema)

#### Almacenamiento de Archivos
- [ ] Servicio usado (AWS S3 / Azure Blob / Google Cloud Storage)
- [ ] Bucket/Container configurado
- [ ] Credenciales de acceso
- [ ] Política de retención de archivos
- [ ] Límites de tamaño y tipos permitidos

---

## 🔍 Checklist de Verificación por Caso de Uso

### UC-02: Enviar PQRS vía Email
- [ ] Webhook de Mailgun configurado y respondiendo
- [ ] Validación de firma implementada
- [ ] Parsing de headers (In-Reply-To, References)
- [ ] Detección de ID de ticket en Subject
- [ ] Manejo de adjuntos de email
- [ ] Códigos de respuesta HTTP correctos

### UC-24: Generar Sugerencia de Respuesta
- [ ] Worker de procesamiento IA corriendo
- [ ] Lógica de selección de ConfigAgente
- [ ] Construcción de prompt con contexto completo
- [ ] Llamada a OpenRouter funcionando
- [ ] Almacenamiento de campos de IA en ticket
- [ ] Lógica de escalado automático
- [ ] Manejo de errores (estado error_ia)
- [ ] Notificaciones en tiempo real

### General
- [ ] Logs de auditoría capturando eventos importantes
- [ ] Validación de permisos por rol en cada endpoint
- [ ] Rate limiting configurado
- [ ] CORS configurado apropiadamente
- [ ] Variables de entorno documentadas
- [ ] Tests de integración para flujos críticos

---

## 📊 Métricas de Progreso

**Estado actual:**
- ✅ Completamente implementados: 22/25 (88%)
- ⚠️ Parcialmente implementados: 2/25 (8%)
- ❌ No implementados: 1/25 (4%)

**Con implementaciones recomendadas:**
- ✅ Completamente implementados: 25/25 (100%)

---

## 🎯 Plan de Acción Sugerido

### Sprint 1 (Alta Prioridad)
1. Implementar UC-14 (Base de Conocimiento)
2. Verificar y documentar UC-23, UC-24, UC-25
3. Probar integración end-to-end: Email → Ticket → IA → Sugerencia

### Sprint 2 (Media Prioridad)
4. Implementar endpoint de aplicar plantilla (UC-13)
5. Verificar/implementar endpoint de descarga de archivos (UC-10)
6. Documentar configuración de integraciones

### Sprint 3 (Baja Prioridad)
7. Implementar gestión de contraseñas (UC-16)
8. Implementar test de integraciones (UC-18)
9. Mejoras incrementales según feedback de usuarios

---

## ✅ Conclusión

Con la implementación de UC-14 (Base de Conocimiento) y la verificación de los procesos automáticos, el backend estará 100% funcional según los casos de uso definidos. Las mejoras de prioridad media y baja son incrementales y pueden implementarse gradualmente basándose en feedback de usuarios.

**Siguiente paso:** Revisar este documento con el equipo de backend y priorizar implementaciones según recursos y roadmap.
