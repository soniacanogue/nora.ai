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
    <div className="bg-primary p-6 rounded-lg border border-secondary flex flex-col h-full">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
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
              contentStyle={{
                backgroundColor: "#161B22",
                borderColor: "#21262D",
                color: "#FFFFFF",
              }}
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: "#60A5FA" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleBarChart;