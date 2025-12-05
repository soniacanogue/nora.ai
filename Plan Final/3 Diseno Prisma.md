### 3. Diseño de Base de Datos (Esquema Extendido - Single-Tenant)
Se presentan los modelos de datos utilizando la sintaxis de Prisma. Este diseño mejora la integridad referencial mediante el uso de enums y establece relaciones explícitas entre las entidades clave.

```prisma
// ===========================================================
//  PRISMA SCHEMA COMPLETO - SISTEMA DE TICKETS + AUTOMATIZACIÓN IA
// ===========================================================

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===========================================================
//  MODELO: USUARIO
// ===========================================================

model Usuario {
  id           String   @id @default(uuid())
  nombre       String
  correo       String   @unique
  rol          Rol      @default(AGENTE)
  activo       Boolean  @default(true)
  primeraVez   Boolean  @default(true)
  creadoEn     DateTime @default(now())
  modificadoEn DateTime @updatedAt

  tickets Ticket[] @relation("asignado")
}

// ===========================================================
//  MODELO: CLIENTE
// ===========================================================

model Cliente {
  id           String   @id @default(uuid())
  nombre       String?
  correo       String   @unique
  telefono     String?
  creadoEn     DateTime @default(now())
  modificadoEn DateTime @updatedAt

  ordenes Orden[]
  tickets Ticket[]
}

// ===========================================================
//  MODELO: ORDEN
// ===========================================================

model Orden {
  id                    String      @id @default(uuid())
  clienteId             String
  estado                EstadoOrden @default(pendiente)
  numeroSeguimiento     String?
  transportista         String?
  articulos             Json
  ultimaActualizacionEn DateTime?
  creadoEn              DateTime    @default(now())
  modificadoEn          DateTime    @updatedAt

  tickets Ticket[]

  cliente Cliente @relation(fields: [clienteId], references: [id])

  @@index([clienteId])
  @@index([creadoEn])
}

// ===========================================================
//  MODELO: TICKET
// ===========================================================

model Ticket {
  id                  String       @id @default(uuid())
  clienteId           String
  assigneeId          String?
  historialAsignacion String?
  asunto              String?
  estado              EstadoTicket @default(nuevo)
  prioridad           Prioridad?
  canal         Canal
  creadoEn            DateTime     @default(now())
  modificadoEn        DateTime     @updatedAt
  resueltoEn          DateTime?
  requiereEscalado    Boolean      @default(false)

  sugerenciaFusionId String?

  etiquetas Etiqueta[]
  ordenId   String?
  mensajes  Mensaje[]
  archivos  Archivo[]
  eventos   LogEvento[]

  orden           Orden?   @relation(fields: [ordenId], references: [id])
  usuarioAsignado Usuario? @relation("asignado", fields: [assigneeId], references: [id])
  cliente         Cliente  @relation(fields: [clienteId], references: [id])

  // Self-relation para sugerencias de fusión
  sugerenciaFusion     Ticket?  @relation("SugerenciaDeFusion", fields: [sugerenciaFusionId], references: [id])
  sugeridoParaFusionEn Ticket[] @relation("SugerenciaDeFusion")

  @@index([clienteId])
  @@index([estado])
  @@index([sugerenciaFusionId])
}

// ===========================================================
//  MODELO: ETIQUETA
// ===========================================================

model Etiqueta {
  id      String   @id @default(uuid())
  nombre  String   @unique
  tickets Ticket[]

  @@index([nombre])
}

// ===========================================================
//  MODELO: MENSAJE
// ===========================================================

model Mensaje {
  id             String    @id @default(uuid())
  ticketId       String
  usuarioId      String?
  contenidoTexto String
  esNotaInterna  Boolean   @default(false)
  esAutomatico   Boolean   @default(false)
  canal          Canal
  metaDatosEnvio Json?
  enviadoEn      DateTime?
  creadoEn       DateTime  @default(now())
  modificadoEn   DateTime  @updatedAt

  aprobadoPorUsuarioId String?

  fuenteMessageId String? @unique

  respuestaSugeridaIA String? @db.Text
  confianzaIA         Float?
  metaDatosIA         Json?

  ticket Ticket @relation(fields: [ticketId], references: [id])
}

// ===========================================================
//  MODELO: ARCHIVO
// ===========================================================

model Archivo {
  id                String   @id @default(uuid())
  ticketId          String
  mensajeId         String?
  nombreArchivo     String
  urlAlmacenamiento String
  tipoMime          String
  tamano            Int
  creadoEn          DateTime @default(now())
  modificadoEn      DateTime @updatedAt

  ticket Ticket @relation(fields: [ticketId], references: [id])
}

// ===========================================================
//  CONFIGURACIÓN IA
// ===========================================================

model ConfigAgente {
  id              String   @id @default(uuid())
  nombre          String
  descripcion     String?
  promptBase      String   @db.Text
  promptsPorCanal Json
  umbralConfianza Float    @default(0.75)
  actualizadoEn   DateTime @updatedAt
}

// ===========================================================
//  PLANTILLAS DE MENSAJE
// ===========================================================

model Plantilla {
  id              String   @id @default(uuid())
  nombre          String
  plantillaAsunto String?
  plantillaCuerpo String   @db.Text
  creadoEn        DateTime @default(now())
  modificadoEn    DateTime @updatedAt
}

// ===========================================================
//  INTEGRACIONES EXTERNAS
// ===========================================================

model Integracion {
  id           String   @id @default(uuid())
  nombre       String
  claveApiEnc  String
  endpoint     String?
  urlWebhook   String?
  configJson   Json?
  activo       Boolean  @default(true)
  creadoEn     DateTime @default(now())
  modificadoEn DateTime @updatedAt
}

// ===========================================================
//  BASE DE CONOCIMIENTO
// ===========================================================

model BaseConocimiento {
  id            String   @id @default(uuid())
  pregunta      String
  procedimiento String   @db.Text
  respuesta     String   @db.Text
  categoria     String?
  creadoEn      DateTime @default(now())
  modificadoEn  DateTime @updatedAt
}

// ===========================================================
//  LOGS DE AUDITORÍA
// ===========================================================

model LogEvento {
  id           String   @id @default(uuid())
  ticketId     String?
  usuarioId    String?
  tabla        String
  cud          String
  payload      Json?
  creadoEn     DateTime @default(now())
  modificadoEn DateTime @updatedAt

  ticket Ticket? @relation(fields: [ticketId], references: [id])
}

// ===========================================================
//  VIEW: AGREGADO DIARIO
// ===========================================================

view AgregadoDiarioTicket {
  fecha DateTime @db.Date

  ticketsTotales Int
  ticketsNuevos  Int
  ticketsActivos Int

  conteoResueltos       Int
  promedioResolucionMin Float?
  ticketsSinAsignar     Int

  conteoCorreo        Int
  conteoWhatsapp      Int
  conteoFormularioWeb Int
  conteoApi           Int

  conteoWismo        Int
  conteoDevoluciones Int
  conteoEscalados    Int

  conteoPrioridadBaja    Int
  conteoPrioridadMedia   Int
  conteoPrioridadAlta    Int
  conteoPrioridadUrgente Int

  promedioPrimerRespuestaMin Float
  porcentajeAutoResueltos    Float
  conteoReasignaciones       Int

  @@map("agregado_diario_ticket")
}

// ===========================================================
//  ENUMS
// ===========================================================

enum Rol {
  ADMINISTRADOR
  AGENTE
}

enum EstadoOrden {
  pendiente
  procesando
  en_transito
  entregado
  cancelado
  devuelto
}

enum EstadoTicket {
  nuevo
  ia_sugerido
  respuesta_cliente
  esperando_cliente
  escalado_nivel_2
  en_progreso_nivel_2
  cerrado
  reabierto
  fusionado
}

enum Prioridad {
  baja
  media
  alta
  urgente
}

enum Canal {
  correo
  whatsapp
  formulario_web
  api
}

```
