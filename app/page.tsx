"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PersonIcon, LockIcon, CalenderIcon } from "@/components/icon/login";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  function onSubmit(data: LoginFormData) {
    console.log("Data dikirim:", data);
  }

  return (
    <div className="relative h-screen w-screen items-center justify-center flex flex-col">
      <div
        className="absolute inset-0 z-10 bg-[url('https://plus.unsplash.com/premium_vector-1682303219575-c521139db33c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx2aXN1YWwtc2VhcmNofDF8fHxlbnwwfHx8fHw%3D')] 
        bg-cover bg-center h-screen brightness-40 pointer-events-none"
      ></div>

      <div className="relative z-10 flex items-center justify-center">
        <h1 className="text-xl md:text-3xl font-semibold m-4 text-center">
          SELAMAT DATANG DI APLIKASI <br />{" "}
          <span className="flex items-center justify-center">SIMKAR!!</span>
        </h1>
      </div>

      {/* Form Login */}

      <div className="relative z-10 flex items-center justify-center mt-4 mb-4">
        <div className="bg-[#0d0d0d] p-6 md:p-8 rounded-xl shadow-md w-full max-w-md md:max-w-3xl flex-col flex items-start gap-10 px-4 max-h-screen overflow-auto">
          <div className="pl-5 flex-1 flex flex-col item-start gap-6">
            <div className="flex items-center space-x-1">
              <Image
                src="/asset/logo_ahc.jpg"
                width={70}
                height={70}
                alt="logo ahc"
                className="rounded-md mix-blend-lighten"
              />

              <div className="w-px h-12 bg-white"></div>
              <div className=" text-2xl font-semibold pl-2 text-white leading-tight">
                PT. Aishy Health <br />
                Calibration
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start w-full justify-center">
            <div className="w-full max-w-sm pl-0 md:pl-5 order-2 md:order-none">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="pb-5 items-center justify-center">
                          LOGIN NOW
                        </FormLabel>

                        <div className="flex">
                          <div className="m-1 pt-1 absolute items-center justify-center flex">
                            {" "}
                            <PersonIcon />{" "}
                          </div>
                          <FormControl>
                            <Input
                              className="pl-7"
                              placeholder="Enter your username"
                              {...field}
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
                        <div className="flex">
                          <div className="m-1 pt-1 absolute">
                            <LockIcon />
                          </div>
                          <FormControl>
                            <Input
                              className="pl-7"
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#1b5deb] text-white hover:bg-[#FFD700]/80 hover:text-black active:bg-primary/60 focus:outline-none transition duration-200 cursor-pointer"
                  >
                    Login
                  </Button>
                </form>
              </Form>
            </div>
            <div className="order-1 md:order-none text-white flex flex-col justify-center items-center text-center space-y-3 p-4 pt-0 md:p-10 w-full md:w-auto">
              <p className="text-sm italic max-w-xs text-center">
                "Platform manajemen kantor terpadu dalam satu aplikasi –
                SIMKAR."
              </p>
              <div className="text-sm md:text-lg flex items-center justify-center gap-2">
                {" "}
                <CalenderIcon /> {formatDate(time)}
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-bold tracking-widest font-mono bg-gray-400 text-black px-4 py-2 md:px-6 md:py-3 rounded-md">
                {formatTime(time)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
