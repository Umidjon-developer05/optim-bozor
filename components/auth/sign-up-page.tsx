'use client'

import { register, sendOtp, verifyOtp } from '@/actions/auth.action'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { toast } from '@/hooks/use-toast'
import { otpSchema, registerSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

const SignUpPage = () => {
	const [isResend, setIsResend] = useState(false)
	const [isVerifying, setIsVerifying] = useState(false)

	const { isLoading, onError, setIsLoading } = useAction()

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: { email: '', password: '', fullName: '', phone: '' },
	})

	const otpForm = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: '' },
	})

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setIsLoading(true)
		const res = await sendOtp({ email: values.email })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		console.log(res)
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast({ description: 'OTP sent successfully' })
			setIsVerifying(true)
			setIsLoading(false)
			setIsResend(false)
		}
	}

	async function onVerify(values: z.infer<typeof otpSchema>) {
		setIsLoading(true)
		const res = await verifyOtp({
			otp: values.otp,
			email: form.getValues('email'),
		})
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 301) {
			setIsResend(true)
			setIsLoading(false)
			toast({ description: 'OTP was expired. Please resend OTP' })
		}
		if (res.data.status === 200) {
			const response = await register(form.getValues())
			if (
				response?.serverError ||
				response?.validationErrors ||
				!response?.data
			) {
				return onError('Something went wrong')
			}
			if (response.data.failure) {
				return onError(response.data.failure)
			}
			if (response.data.user._id) {
				toast({ description: 'User created successfully' })
				signIn('credentials', {
					userId: response.data.user._id,
					callbackUrl: '/',
				})
			}
		}
	}

	return (
		<Card className='w-full max-w-md p-4 shadow-lg bg-white/90 backdrop-blur-sm'>
			<h1 className='text-xl font-bold'>Ro&apos;yxatdan O&apos;tish</h1>
			<p className='text-sm text-muted-foreground'>
				Siz ro&apos;yxatdan o&apos;tganingizdan so&apos;ng, sizga
				ro&apos;yxatdan o&apos;tish uchun tasdiqlovchi kod yuboriladi.
				Malumotlaringizni to&apos;g&apos;ri kiritganingizga ishonch hosil
				qiling.
			</p>
			<Separator className='my-3' />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
					<FormField
						control={form.control}
						name='fullName'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<Label>Full Name</Label>
								<FormControl>
									<Input
										placeholder='Osman Ali'
										disabled={isLoading || isVerifying}
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-500' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<Label>Email</Label>
								<FormControl>
									<Input
										placeholder='example@gmail.com'
										disabled={isLoading || isVerifying}
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-500' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<Label>Password</Label>
								<FormControl>
									<Input
										placeholder='****'
										type='password'
										disabled={isLoading || isVerifying}
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-500' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<Label>Phone</Label>
								<FormControl>
									<Input
										placeholder='+998'
										type='tel'
										disabled={isLoading || isVerifying}
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-500' />
							</FormItem>
						)}
					/>

					{!isVerifying && (
						<Button type='submit' disabled={isLoading} className='w-full'>
							Kirish{' '}
							{isLoading && <Loader className='ml-2 h-4 w-4 animate-spin' />}
						</Button>
					)}
				</form>
			</Form>
			{isVerifying && (
				<Form {...otpForm}>
					<form
						onSubmit={otpForm.handleSubmit(onVerify)}
						className='space-y-2 mt-2'
					>
						<FormField
							control={otpForm.control}
							name='otp'
							render={({ field }) => (
								<FormItem className='space-y-0 w-full'>
									<Label>Enter OTP</Label>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage className='text-xs text-red-500' />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-1'>
							<Button
								type='submit'
								disabled={isLoading || isResend}
								className='flex-1'
							>
								Tasdiqlash{' '}
								{isLoading && <Loader className='ml-2 h-4 w-4 animate-spin' />}
							</Button>
							{isResend && (
								<Button
									type='button'
									onClick={() => onSubmit(form.getValues())}
									disabled={isLoading}
									className='flex-1'
								>
									Resend OTP{' '}
									{isLoading && (
										<Loader className='ml-2 h-4 w-4 animate-spin' />
									)}
								</Button>
							)}
						</div>
					</form>
				</Form>
			)}
			<div className='mt-4'>
				<div className='text-sm text-muted-foreground'>
					Allaqachon ro&apos;yxatdan o&apos;tganmisiz?{' '}
					<Button asChild variant={'link'} className='p-0'>
						<Link href='/sign-in'>Sign in</Link>
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default SignUpPage
