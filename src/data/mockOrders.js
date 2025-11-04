// src/data/mockOrders.js
export const mockOrders = [
  {
    orderId: 'GUP-00789',
    clientEmail: 'ana.perez@example.com',
    status: 'en_transito',
    trackingNumber: 'XYZ12345',
    carrier: 'FastShip',
  },
  {
    orderId: 'GUP-00790',
    clientEmail: 'luis.garcia@example.com',
    status: 'entregado',
    trackingNumber: 'ABC98765',
    carrier: 'CityExpress',
  },
  {
    orderId: 'GUP-00791',
    clientEmail: 'marta.j@example.com',
    status: 'procesando',
    trackingNumber: null,
    carrier: 'FastShip',
  },
  {
    orderId: 'GUP-00792',
    clientEmail: 'carlos.rojas@example.com',
    status: 'pendiente',
    trackingNumber: 'DEF45678',
    carrier: 'CityExpress',
  },
];