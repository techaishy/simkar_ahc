"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PersonIcon, LockIcon, CalenderIcon } from "@/components/icon/login";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

type LoginFormData = {
  username: string;
  password: string;
};

export default function Login() {
  const form = useForm<LoginFormData>({
    defaultValues: { username: "", password: "" },
  });

  const router = useRouter();
  const { login, user, isAuthenticated, isLoading } = useAuth();

  const [isClient, setIsClient] = useState(false);
  const [time, setTime] = useState(new Date());

  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "ADMIN" || user.role === "OWNER" || user.role === "MANAJER") {
        router.replace("/dashboard");
      } else if (user.role === "TEKNISI" ) {  
        router.replace("/absen");
      }else if (user.role === "KEUANGAN") {
        router.replace("/surat_keluar/approval_surat");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
    } catch (err: any) {
      alert(err.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-700 via-gray-900 to-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.08),transparent_60%)]"></div>

      <div className="relative flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl z-10">
        {/* Panel Kiri */}
        <div className="md:w-1/2 bg-gradient-to-br from-black via-gray-950 to-gray-800 flex flex-col items-start md:items-center justify-start md:justify-center p-8 text-left md:text-center text-white">
          <div className="flex-1 flex flex-col gap-4 mb-8 sm:mb-0 items-start justify-start sm:justify-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/asset/logo_ahc.png"
                width={50}
                height={50}
                alt="logo ahc"
                className="rounded-md shadow-lg object-contain sm:w-[60px] sm:h-[60px]"
              />
              <div className="w-px h-10 sm:h-12 bg-white"></div>
              <div className="text-xl sm:text-2xl font-semibold items-start flex flex-col text-white leading-tight">
                <span className="font-semibold">PT. Aishy Health</span>
                <span className="font-semibold">Calibration</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            Hello, <span className="text-[#d2e67a]">Welcome!</span>
          </h1>
          <p className="mt-2 mb-8 sm:mb-12 text-sm max-w-full md:max-w-xs">
            Platform manajemen kantor terpadu dalam satu aplikasi – SIMKAR.
          </p>
        </div>

        {/* Panel Kanan */}
        <div className="md:w-1/2 bg-white p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-center">
              Login Now
            </h2>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }}
                noValidate
                action={undefined}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center border border-gray-950 rounded-lg px-3">
                        <PersonIcon />
                        <FormControl>
                          <Input
                            {...field}
                            className="border-0 focus:ring-0 text-black placeholder:text-gray-500"
                            placeholder="Enter your email"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center border border-gray-950 rounded-lg px-3">
                        <LockIcon />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="border-0 focus:ring-0 text-black placeholder:text-gray-500"
                            placeholder= "Masukkan Password" 
                          />
                        </FormControl>
                      </div>
                      <div className=" flex items-center gap-2">
                        <input
                          id="togglePassword"
                          type="checkbox"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="togglePassword" className="text-sm text-gray-600">
                          Tampilkan password
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] text-black font-semibold py-2 rounded-lg shadow hover:bg-black hover:text-white hover:opacity-90 transition"
                >
                  Login
                </Button>
              </form>
            </Form>

            {/* Waktu & Tanggal */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <CalenderIcon /> {isClient && formatDate(time)}
              </div>
              <div className="text-lg font-bold mt-1 text-gray-800">
                {isClient && formatTime(time)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
