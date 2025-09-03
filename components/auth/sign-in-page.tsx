"use client";

import { login } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import GoogleButton from "./google-button";

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onError(message: string) {
    setIsLoading(false);
    toast({ description: message, variant: "destructive" });
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const res = await login(values);
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError("Something went wrong");
    }
    if (res.data.failure) {
      return onError(res.data.failure);
    }
    if (res.data.user) {
      toast({ description: "Logged in successfully" });
      signIn("credentials", { userId: res.data.user._id, callbackUrl: "/" });
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Xush kelibsiz
        </h1>
        <p className="text-sm text-gray-600">
          Optim bozor hisobingizga kirish uchun ma&apos;lumotlaringizni kiriting
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email manzil
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <Input
                        placeholder="example@gmail.com"
                        disabled={isLoading}
                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all duration-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Parol
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        disabled={isLoading}
                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all duration-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Kirish...
                </div>
              ) : (
                "Kirish"
              )}
            </Button>
          </form>
        </Form>
        <GoogleButton variant="signin" route={"/sign-in"} />
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-gray-500">yoki</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Siz hali ro&apos;yxatdan o&apos;tmaganmisiz?{" "}
            <Button
              asChild
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700 font-semibold"
            >
              <Link href="/sign-up">Ro&apos;yxatdan o&apos;tish</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
