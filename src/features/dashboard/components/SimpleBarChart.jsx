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
  data = [
    { status: "ia_sugerido", count: 15 },
    { status: "en_progreso", count: 8 },
    { status: "esperando_cliente", count: 12 },
    { status: "escalado_nivel_2", count: 5 },
    { status: "reabierto", count: 2 },
  ],
  title = "Distribución de Tickets por Estado",
}) => {
  // Transform the data to have a readable name
  const chartData = data.map((item) => ({
    name: item.status || item.name || "Unknown",
    count: item.count,
  }));

  return (
    <div
      className="bg-primary p-6 rounded-lg border border-secondary"
      style={{ height: "320px" }}
    >
      <h3 className="text-lg font-bold text-foreground mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
          <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
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
            fill="#3B82F6" // Color azul primario
            radius={[4, 4, 0, 0]} // Bordes redondeados en la parte superior
            activeBar={{ fill: "#60A5FA" }} // Color más claro al hacer hover
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
