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
    { name: "Triaje", count: 15 },
    { name: "En Progreso", count: 8 },
    { name: "Esperando Cliente", count: 12 },
    { name: "Escalados", count: 5 },
    { name: "Reabiertos", count: 2 },
  ],
}) => {
  return (
    <div
      className="bg-primary p-6 rounded-lg border border-secondary"
      style={{ height: "320px" }}
    >
      <h3 className="text-lg font-bold text-foreground mb-4">
        Distribución de Tickets (Hoy)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
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
