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
      <div
        className="bg-dt-background/90 backdrop-blur-md border border-dt-accent/50 rounded p-3 shadow-glow"
      >
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
  "#8A2BE2", // dt-accent (morado principal)
  "#9932CC", // dt-accent-hover (morado más oscuro)
  "#9370DB", // MediumSlateBlue (variación morada)
  "#BA55D3", // MediumOrchid (variación morada)
  "#DA70D6", // Orchid (variación morada)
  "#DDA0DD", // Plum (variación morada clara)
  "#EE82EE", // Violet (variación morada)
  "#FF69B4", // HotPink (variación rosa-morada)
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
        <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-6">{title}</h3>
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
      <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-6">{title}</h3>
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
                fontFamily: "monospace"
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
