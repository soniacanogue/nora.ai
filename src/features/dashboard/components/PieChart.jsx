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
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#6366F1", // indigo
  "#14B8A6", // teal
];

const PieChart = ({
  data = [],
  title = "Distribución",
  dataKey = "value",
  nameKey = "name",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-primary p-6 rounded-lg border border-secondary">
        <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
        <p className="text-subtle">No hay datos disponibles.</p>
      </div>
    );
  }

  // Transform data to ensure it has the correct keys
  const chartData = data.map((item) => ({
    name: item[nameKey] || item.channel || item.tag || "Unknown",
    value: item[dataKey] || item.count || 0,
  }));

  return (
    <div
      className="bg-primary p-6 rounded-lg border border-secondary"
      style={{ height: "320px" }}
    >
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(Number(percent || 0) * 100).toFixed(0)}%`
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
            contentStyle={{
              backgroundColor: "#161B22",
              borderColor: "#21262D",
              color: "#FFFFFF",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: "#8B949E", fontSize: "12px" }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
