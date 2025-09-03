"use client";

import { register, sendOtp, verifyOtp } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import useAction from "@/hooks/use-action";
import { toast } from "@/hooks/use-toast";
import { otpSchema, registerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import GoogleButton from "./google-button";

const SignUpPage = () => {
  const [isResend, setIsResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { isLoading, onError, setIsLoading } = useAction();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", fullName: "", phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    const res = await sendOtp({ email: values.email });
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError("Something went wrong");
    }
    console.log(res);
    if (res.data.failure) {
      return onError(res.data.failure);
    }
    if (res.data.status === 200) {
      toast({ description: "OTP sent successfully" });
      setIsVerifying(true);
      setIsLoading(false);
      setIsResend(false);
    }
  }

  async function onVerify(values: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    const res = await verifyOtp({
      otp: values.otp,
      email: form.getValues("email"),
    });
    if (res?.serverError || res?.validationErrors || !res?.data) {
      return onError("Something went wrong");
    }
    if (res.data.failure) {
      return onError(res.data.failure);
    }
    if (res.data.status === 301) {
      setIsResend(true);
      setIsLoading(false);
      toast({ description: "OTP was expired. Please resend OTP" });
    }
    if (res.data.status === 200) {
      const response = await register(form.getValues());
      if (
        response?.serverError ||
        response?.validationErrors ||
        !response?.data
      ) {
        return onError("Something went wrong");
      }
      if (response.data.failure) {
        return onError(response.data.failure);
      }
      if (response.data.user._id) {
        toast({ description: "User created successfully" });
        signIn("credentials", {
          userId: response.data.user._id,
          callbackUrl: "/",
        });
      }
    }
  }

  return (
    <div className="w-full ">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Ro&apos;yxatdan o&apos;tish
        </h1>
        <p className="text-sm text-gray-600">
          Optim bozorda hisob yarating va xizmatlardan foydalaning
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80  backdrop-blur-xl  rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <div className="flex flex-col lg:flex-row lg:gap-10 items-center justify-center">
              <div>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        To&apos;liq ism
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <Input
                            placeholder="Osman Ali"
                            disabled={isLoading || isVerifying}
                            className="pl-10 w-full sm:w-[350px] h-12 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-200"
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
                            disabled={isLoading || isVerifying}
                            className="pl-10  w-full sm:w-[350px] h-12 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
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
                            disabled={isLoading || isVerifying}
                            className="pl-10  w-full sm:w-[350px] h-12 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-200"
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
                            disabled={isLoading || isVerifying}
                            className="pl-10  w-full sm:w-[350px] h-12 bg-white/50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!isVerifying && (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Yuborilmoqda...
                  </div>
                ) : (
                  <>Ro&apos;yxatdan o&apos;tish</>
                )}
              </Button>
            )}
          </form>
        </Form>
        <GoogleButton variant="signup" route={"/sign-up"} />
        {/* OTP Verification Section */}
        {isVerifying && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Tasdiqlash kodi
              </h3>
              <p className="text-sm text-gray-600">
                Email manzilingizga yuborilgan kodni kiriting
              </p>
            </div>

            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onVerify)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        OTP kod
                      </Label>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field} className="gap-2">
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot
                                index={0}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                              <InputOTPSlot
                                index={1}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                              <InputOTPSlot
                                index={2}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator className="mx-2" />
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot
                                index={3}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                              <InputOTPSlot
                                index={4}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                              <InputOTPSlot
                                index={5}
                                className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 text-center" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading || isResend}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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

                  {isResend && (
                    <Button
                      type="button"
                      onClick={() => onSubmit(form.getValues())}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600 font-semibold rounded-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="mr-2 h-5 w-5 animate-spin" />
                          Yuborilmoqda...
                        </div>
                      ) : (
                        "Qayta yuborish"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Allaqachon ro&apos;yxatdan o&apos;tganmisiz?{" "}
            <Button
              asChild
              variant="link"
              className="p-0 h-auto text-green-600 hover:text-green-700 font-semibold"
            >
              <Link href="/sign-in">Kirish</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
