"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const dataBar = [
  { name: "Y1", tepat: 10, terlambat: 5, tidakHadir: 3 },
  { name: "Y2", tepat: 12, terlambat: 2, tidakHadir: 5 },
  { name: "Y3", tepat: 8, terlambat: 6, tidakHadir: 4 },
  { name: "Y4", tepat: 20, terlambat: 3, tidakHadir: 1 },
  { name: "Y5", tepat: 15, terlambat: 2, tidakHadir: 0 },
  { name: "Y6", tepat: 10, terlambat: 8, tidakHadir: 2 },
  { name: "Y7", tepat: 9, terlambat: 3, tidakHadir: 7 },
  { name: "Y8", tepat: 11, terlambat: 5, tidakHadir: 4 },
  { name: "Y9", tepat: 14, terlambat: 4, tidakHadir: 2 },
  { name: "Y10", tepat: 17, terlambat: 1, tidakHadir: 2 },
  { name: "Y11", tepat: 13, terlambat: 3, tidakHadir: 1 },
  { name: "Y12", tepat: 19, terlambat: 5, tidakHadir: 2 },
];

const dataPie = [
  { name: "Tepat Waktu", value: 40 },
  { name: "Terlambat", value: 30 },
  { name: "Tidak Hadir", value: 30 },
];

const COLORS = ["#34D399", "#FBBF24", "#EF4444"];

export function ChartDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 min-w-0">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataBar}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tepat" fill="#34D399" name="Tepat Waktu" />
            <Bar dataKey="terlambat" fill="#FBBF24" name="Terlambat" />
            <Bar dataKey="tidakHadir" fill="#EF4444" name="Tidak Hadir" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center items-center h-72">
        <ResponsiveContainer width="80%" height="100%">
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
