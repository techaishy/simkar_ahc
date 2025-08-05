"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { useMediaQuery } from "usehooks-ts";
import MonthYearDropdown from "./DropdownYearMonth";

const dataBar = [
  { name: "Jan", tepat: 10, terlambat: 5, tidakHadir: 3 },
  { name: "Feb", tepat: 12, terlambat: 2, tidakHadir: 5 },
  { name: "Mar", tepat: 8, terlambat: 6, tidakHadir: 4 },
  { name: "Apr", tepat: 20, terlambat: 3, tidakHadir: 1 },
  { name: "Mei", tepat: 15, terlambat: 2, tidakHadir: 0 },
  { name: "Juni", tepat: 10, terlambat: 8, tidakHadir: 2 },
  { name: "Juli", tepat: 9, terlambat: 3, tidakHadir: 7 },
  { name: "Agst", tepat: 11, terlambat: 5, tidakHadir: 4 },
  { name: "Sept", tepat: 14, terlambat: 4, tidakHadir: 2 },
  { name: "Okt", tepat: 17, terlambat: 1, tidakHadir: 2 },
  { name: "Nov", tepat: 13, terlambat: 3, tidakHadir: 1 },
  { name: "Des", tepat: 19, terlambat: 5, tidakHadir: 2 },
];

const monthNameMap: Record<string, string> = {
  Januari: "Jan",
  Februari: "Feb",
  Maret: "Mar",
  April: "Apr",
  Mei: "Mei",
  Juni: "Juni",
  Juli: "Juli",
  Agustus: "Agst",
  September: "Sept",
  Oktober: "Okt",
  November: "Nov",
  Desember: "Des",
};

const fullMonthMap: Record<string, string> = {
  Jan: "Januari",
  Feb: "Februari",
  Mar: "Maret",
  Apr: "April",
  Mei: "Mei",
  Juni: "Juni",
  Juli: "Juli",
  Agst: "Agustus",
  Sept: "September",
  Okt: "Oktober",
  Nov: "November",
  Des: "Desember",
};

export function ChartDisplay() {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

  const handleFilterChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const selectedMonthShort = monthNameMap[selectedMonth];

  const filteredData = isMobile
    ? dataBar.filter((d) => d.name === selectedMonthShort)
    : dataBar;

  const formatXAxisLabel = (value: string) =>
    isMobile ? fullMonthMap[value] || value : value;

  return (
    <div className="w-full space-y-4">
      {isMobile && <MonthYearDropdown onChange={handleFilterChange} />}

      <Card className="w-full bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
          Statistik Kehadiran{" "}
          {isMobile ? `${selectedMonth} ${selectedYear}` : "Tahunan"}
        </h2>

        <div className="w-full h-[260px] sm:h-[320px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={formatXAxisLabel}
                angle={isMobile ? 0 : -30}
                textAnchor={isMobile ? "middle" : "end"}
                dy={10}
                tick={{ fontSize: isMobile ? 12 : 14 }}
              />
              <YAxis tick={{ fontSize: isMobile ? 12 : 14 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  fontSize: 12,
                  marginTop: -10,
                  display: "flex",
                  justifyContent: "center",
                }}
              />
              <Bar dataKey="tepat" fill="#34D399" name="Tepat Waktu" />
              <Bar dataKey="terlambat" fill="#FBBF24" name="Terlambat" />
              <Bar dataKey="tidakHadir" fill="#EF4444" name="Tidak Hadir" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
