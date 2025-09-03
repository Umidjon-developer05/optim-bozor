"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { phoneSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { register } from "@/actions/auth.action";

export default function OAuthPhonePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  useEffect(() => {
    if (status === "loading") return;
    // If user already has a backend userId in session, go home
    if ((session as any)?.currentUser?._id) {
      router.replace("/");
      return;
    }
    // If no pending OAuth data, kick off Google sign-in
    if (!(session as any)?.pendingOAuth?.email) {
      signIn("google", { callbackUrl: "/oauth/phone" });
    }
  }, [session, status, router]);

  async function onSubmit(values: z.infer<typeof phoneSchema>) {
    try {
      setIsLoading(true);
      const email = (session as any)?.pendingOAuth?.email as string | undefined;
      const fullName = (session as any)?.pendingOAuth?.fullName as
        | string
        | undefined;
      if (!email) {
        toast({
          description: "Google maʼlumoti topilmadi",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const res = await register({
        email,
        fullName: fullName || "",
        phone: values.phone,
        password: "oauth_dummy_password",
      });
      if (res?.serverError || res?.validationErrors || !res?.data) {
        toast({ description: "Xatolik yuz berdi", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (res.data.failure) {
        toast({ description: res.data.failure, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (res.data.user?._id) {
        toast({ description: "Roʻyxatdan oʻtildi" });
        // Directly sign in with credentials strategy using new user id
        signIn("credentials", { userId: res.data.user._id, callbackUrl: "/" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mt-2 max-w-md">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Telefon raqamingizni kiriting
        </h1>
        <p className="text-sm text-gray-600">
          Google orqali kirishdan soʻng, hisobni yakunlash uchun telefon raqami
          talab qilinadi
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Telefon raqam
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <Input
                        placeholder="+998"
                        type="tel"
                        disabled={isLoading}
                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-200"
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
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Tasdiqlash...
                </div>
              ) : (
                "Tasdiqlash"
              )}
            </Button>
          </form>
        </Form>

        {/* Info Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-full">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Telefon raqamingiz xavfsizlik uchun talab qilinadi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
