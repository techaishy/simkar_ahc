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
import MonthYearDropdown from "../../../components/ui/DropdownYearMonth";

const monthNameMap: Record<string, string> = {
  Januari: "Jan",
  Februari: "Feb",
  Maret: "Mar",
  April: "Apr",
  Mei: "Mei",
  Juni: "Jun",
  Juli: "Jul",
  Agustus: "Agst",
  September: "Sep",
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
  Jun: "Juni",
  Jul: "Juli",
  Agst: "Agustus",
  Sep: "September",
  Okt: "Oktober",
  Nov: "November",
  Des: "Desember",
};

export function ChartDisplay() {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = String(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [mounted, setMounted] = useState(false);

  const [dataBar, setDataBar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      try {
        const monthIndex = monthNames.indexOf(selectedMonth) + 1; 
        const url = isMobile
          ? `/api/attendance/stats?month=${monthIndex}&year=${selectedYear}`
          : `/api/attendance/stats?year=${selectedYear}`;

        setLoading(true);
        const res = await fetch(url);
        const data = await res.json();
        setDataBar(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [selectedMonth, selectedYear, isMobile]); 

  if (!mounted) return null;

  const handleFilterChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const formatXAxisLabel = (value: string) =>
    isMobile ? fullMonthMap[value] || value : value;

  return (
    <div className="w-full space-y-4">
      {/* Dropdown */}
      <MonthYearDropdown onChange={handleFilterChange} showMonth={isMobile} />

      <Card className="w-full bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
          Statistik Kehadiran{" "}
          {isMobile ? `${selectedMonth} ${selectedYear}` : `Tahun ${selectedYear}`}
        </h2>

        <div className="w-full h-[260px] sm:h-[320px] md:h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataBar}
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
                <Bar dataKey="hadir" fill="#34D399" name="Tepat Waktu" />
                <Bar dataKey="terlambat" fill="#FBBF24" name="Terlambat" />
                <Bar dataKey="tidakHadir" fill="#EF4444" name="Tidak Hadir" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
