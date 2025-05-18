'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { dashboardSidebar } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const MobileSidebar = () => {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className='md:hidden'>
					<Menu className='h-6 w-6' />
					<span className='sr-only'>Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='p-0 w-72'>
				<div className='flex flex-col h-full'>
					<div>
						<div className='flex items-center justify-center h-24 border-b'>
							<Link href={'/'} onClick={() => setOpen(false)}>
								<Image
									className='w-auto h-24'
									src='/logo.png'
									alt='Logo'
									width={80}
									height={80}
								/>
							</Link>
						</div>
					</div>
					<div className='p-4'>
						<div className='flex items-center gap-2 px-2'>
							<LayoutDashboard className='h-5 w-5' />
							<h1 className='font-bold text-lg'>Dashboard</h1>
						</div>
					</div>

					<Separator />

					<div className='flex-1 flex flex-col gap-1 p-3 overflow-y-auto'>
						{dashboardSidebar.map(item => (
							<Button
								key={item.route}
								asChild
								variant={pathname === item.route ? 'secondary' : 'ghost'}
								className={cn(
									'justify-start gap-3 px-3 py-5 transition-all',
									pathname === item.route
										? 'font-medium bg-secondary'
										: 'hover:bg-secondary/50'
								)}
								onClick={() => setOpen(false)}
							>
								<Link href={item.route} className='flex items-center'>
									<item.icon className='h-5 w-5 shrink-0' />
									<span>{item.name}</span>
								</Link>
							</Button>
						))}
					</div>

					<div className='mt-auto p-4 border-t'>
						<div className='flex items-center justify-between'>
							<div className='text-sm text-muted-foreground'>
								<p>© 2025 Company</p>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}

export default MobileSidebar
