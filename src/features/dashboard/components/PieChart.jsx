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

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#14B8A6",
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
    <div className="bg-primary p-6 rounded-lg border border-secondary flex flex-col h-full">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
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
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: "#161B22",
                borderColor: "#21262D",
                color: "#FFFFFF",
              }}
            />
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