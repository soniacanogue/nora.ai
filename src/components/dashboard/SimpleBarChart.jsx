// src/components/dashboard/SimpleBarChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Datos falsos para el gráfico
const data = [
  { name: 'WISMO', count: 12 },
  { name: 'Devolución', count: 8 },
  { name: 'Dañado', count: 4 },
  { name: 'Compatibilidad', count: 2 },
  { name: 'Otro', count: 5 },
];

const SimpleBarChart = () => {
  return (
    <div className="bg-primary p-6 rounded-lg border border-secondary h-80">
      <h3 className="text-lg font-bold text-foreground mb-4">Tickets por Categoría (Hoy)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
          <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
          <YAxis stroke="#8B949E" fontSize={12} />
          <Tooltip 
            cursor={{ fill: 'rgba(138, 43, 226, 0.1)' }}
            contentStyle={{ 
              backgroundColor: '#161B22', 
              borderColor: '#21262D',
              color: '#FFFFFF'
            }}
          />
          <Bar dataKey="count" fill="#8A2BE2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;