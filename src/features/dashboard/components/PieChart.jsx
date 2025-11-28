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
        style={{
          backgroundColor: "#161B22",
          border: "1px solid #8A2BE2",
          borderRadius: "4px",
          padding: "8px 12px",
        }}
      >
        <p style={{ color: "#8A2BE2", fontWeight: "bold", marginBottom: "4px" }}>
          {payload[0].name}
        </p>
        <p style={{ color: "#8A2BE2", fontWeight: "bold" }}>
          count: <span style={{ color: "#FFFFFF" }}>{payload[0].value}</span>
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
    // ... (código del estado vacío sin cambios)
  }

  const chartData = data.map((item) => ({
    name: nameFormatter(item[nameKey] || "Unknown"),
    value: item[dataKey] || 0,
  }));

  return (
    // --- CORRECCIÓN 1: Quitar la altura fija de aquí ---
    <div className="bg-dt-primary p-6 rounded-lg border border-secondary flex flex-col h-full">
      <h3 className="text-lg font-bold text-dt-foreground mb-4">{title}</h3>
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
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
