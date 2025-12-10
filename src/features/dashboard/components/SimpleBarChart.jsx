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
      <div className="bg-dt-background/90 backdrop-blur-md border border-dt-accent/50 rounded p-3 shadow-glow">
        <p className="text-dt-accent font-bold text-xs uppercase tracking-wider mb-1">
          {label}
        </p>
        {payload.map((entry, idx) => (
          <p key={entry.dataKey} className="text-white font-mono font-bold" style={{color: entry.color}}>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
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
  // Si se pasan barKeys, construir datos para múltiples barras
  let chartData = [];
  let barKeys = [];
  if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('Asignados')) {
    chartData = data.map((item) => ({
      name: item.name,
      Asignados: item["Asignados"],
      Resueltos: item["Resueltos"],
      Activos: item["Activos"],
    }));
    barKeys = ["Asignados", "Resueltos", "Activos"];
  } else {
    chartData = data.map((item) => ({
      name: nameFormatter(item.status || item.name || "Unknown"),
      count: item.count,
    }));
    barKeys = ["count"];
  }

  return (
    // --- CORRECCIÓN 1: Quitar la altura fija de aquí ---
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 flex flex-col h-full shadow-sharp">
      <h3 className="text-xs font-bold text-dt-subtle uppercase tracking-wider mb-6">
        {title}
      </h3>
      {/* --- CORRECCIÓN 2: Dar altura explícita al contenedor del gráfico --- */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#8B949E"
              fontSize={10}
              interval={0}
              angle={-20}
              textAnchor="end"
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke="#8B949E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <Tooltip
              cursor={{ fill: "rgba(138, 43, 226, 0.05)" }}
              content={<CustomTooltip />}
            />
            {barKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={idx === 0 ? "#8A2BE2" : idx === 1 ? "#32CD32" : "#FFA500"}
                radius={[2, 2, 0, 0]}
                minPointSize={1}
                activeBar={{
                  fill: idx === 0 ? "#9932CC" : idx === 1 ? "#228B22" : "#FF8C00",
                  filter: "drop-shadow(0 0 8px rgba(138, 43, 226, 0.5))",
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleBarChart;
