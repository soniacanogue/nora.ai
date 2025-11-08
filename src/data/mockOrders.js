// src/data/mockOrdenes.js

export const mockOrdenes = [
  {
    id: "ORD-2023-001",
    clienteId: "cli-002", // David Luna
    estado: "en_transito",
    numeroSeguimiento: "TRK123456789",
    transportista: "DHL",
    articulos: [{ sku: "HEAD-XT2", qty: 1, name: "Auriculares Pro XT2" }],
  },
  {
    id: "ORD-2023-002",
    clienteId: "cli-003", // Sofia Reyes
    estado: "entregado",
    numeroSeguimiento: "TRK987654321",
    transportista: "FedEx",
    articulos: [{ sku: "KB-MECH-01", qty: 1, name: "Teclado Mecánico RGB" }],
  },
  {
    id: "ORD-2023-003",
    clienteId: "cli-001", // Ana Torres
    estado: "entregado",
    numeroSeguimiento: "TRK555555555",
    transportista: "Estafeta",
    articulos: [{ sku: "MOUSE-G502", qty: 1, name: "Mouse Gamer G502" }],
  },
];
