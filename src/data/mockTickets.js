// src/data/mockTickets.js
export const mockTickets = [
  {
    id: 'TKT-001',
    subject: '¿Dónde está mi pedido GUP-00123?',
    client: { name: 'Ana Pérez', email: 'ana.perez@example.com' },
    status: 'sugerido', // 'nuevo', 'sugerido', 'escalado', 'cerrado'
    aiConfidence: 0.92,
    suggestedTags: ['WISMO'],
    createdAt: '2025-10-28T10:00:00Z',
  },
  {
    id: 'TKT-002',
    subject: 'Mi producto llegó dañado, adjunto fotos',
    client: { name: 'Luis García', email: 'luis.garcia@example.com' },
    status: 'escalado',
    aiConfidence: 0.85,
    suggestedTags: ['DAMAGED', 'URGENT'],
    createdAt: '2025-10-28T09:30:00Z',
  },
  {
    id: 'TKT-003',
    subject: 'Necesito devolver un artículo',
    client: { name: 'Marta Jiménez', email: 'marta.j@example.com' },
    status: 'sugerido',
    aiConfidence: 0.88,
    suggestedTags: ['RETURN'],
    createdAt: '2025-10-28T09:15:00Z',
  },
  {
    id: 'TKT-004',
    subject: 'Consulta sobre compatibilidad de accesorio',
    client: { name: 'Carlos Rojas', email: 'carlos.rojas@example.com' },
    status: 'nuevo',
    aiConfidence: null,
    suggestedTags: [],
    createdAt: '2025-10-27T18:00:00Z',
  },
];