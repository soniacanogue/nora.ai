import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Tooltip personalizado con colores del tema
const CustomTooltip = ({ active, payload, label }) => {
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
          {label}
        </p>
        <p style={{ color: "#8A2BE2", fontWeight: "bold" }}>
          count: <span style={{ color: "#FFFFFF" }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SimpleBarChart = ({
  data = [],
  title = "Distribución de Tickets por Estado",
  nameFormatter = (name) => name,
}) => {
  const chartData = data.map((item) => ({
    name: nameFormatter(item.status || item.name || "Unknown"),
    count: item.count,
  }));

  return (
    // --- CORRECCIÓN 1: Quitar la altura fija de aquí ---
    <div className="bg-dt-primary p-6 rounded-lg border border-secondary flex flex-col h-full">
      <h3 className="text-lg font-bold text-dt-foreground mb-4">{title}</h3>
      {/* --- CORRECCIÓN 2: Dar altura explícita al contenedor del gráfico --- */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
            <XAxis
              dataKey="name"
              stroke="#8B949E"
              fontSize={12}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis stroke="#8B949E" fontSize={12} />
            <Tooltip
              cursor={{ fill: "rgba(138, 43, 226, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="count"
              fill="#8A2BE2"
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: "#9932CC" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleBarChart;
