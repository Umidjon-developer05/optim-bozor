'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Filter from '@/components/shared/filter'

export default function SearchBar() {
	return (
		<div className='flex items-center gap-2 sm:my-4 w-full'>
			<Link href='/catalog' aria-label='Katalog sahifasiga o‘tish'>
				<Button
					variant='outline'
					className='bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 flex items-center gap-2'
				>
					<span className='hidden md:inline'>Katalog</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='h-5 w-5'
					>
						<rect width='6' height='6' x='3' y='3' rx='1' />
						<rect width='6' height='6' x='15' y='3' rx='1' />
						<rect width='6' height='6' x='3' y='15' rx='1' />
						<rect width='6' height='6' x='15' y='15' rx='1' />
					</svg>
				</Button>
			</Link>

			<div className='relative flex-1'>
				<Filter />
			</div>
		</div>
	)
}
