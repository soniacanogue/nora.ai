// src/features/dashboard/components/PieChart.jsx
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Tooltip personalizado con colores del tema
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dt-background/90 backdrop-blur-md border border-dt-accent/50 rounded p-3 shadow-glow">
        <p className="text-dt-accent font-bold text-xs uppercase tracking-wider mb-1">
          {payload[0].name}
        </p>
        <p className="text-white font-mono font-bold">
          count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const COLORS = [
  "#6B46C1", // muted purple
  "#4C51BF", // muted indigo
  "#2D3748", // muted gray
  "#38A169", // muted green
  "#3182CE", // muted blue
  "#D69E2E", // muted yellow
  "#E53E3E", // muted red
  "#805AD5", // muted purple variant
];

const PieChart = ({
  data = [],
  title = "Distribución",
  dataKey = "count",
  nameKey = "name",
  nameFormatter = (name) => name,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 flex flex-col h-full shadow-sharp">
        <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-6">
          {title}
        </h3>
        <div className="flex-grow flex items-center justify-center text-dt-subtle text-sm italic">
          No hay datos para mostrar
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: nameFormatter(item[nameKey] || "Unknown"),
    value: item[dataKey] || 0,
  }));

  return (
    // --- CORRECCIÓN 1: Quitar la altura fija de aquí ---
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 flex flex-col h-full shadow-sharp">
      <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-6">
        {title}
      </h3>
      {/* --- CORRECCIÓN 2: Dar altura explícita al contenedor del gráfico --- */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ percent }) =>
                `${(Number(percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={50}
              wrapperStyle={{
                color: "#8B949E",
                fontSize: "12px",
                bottom: 0,
                fontFamily: "monospace",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
