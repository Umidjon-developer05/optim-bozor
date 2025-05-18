'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function Banner() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [direction, setDirection] = useState(0) // -1 for left, 1 for right

	const banners = [
		{
			title: '"Optim"dan chegirmalar',
			subtitle: 'Kafolat va servis xizmatlari',
			discount: '-20%',
			discountText: 'gacha',
			buttonText: 'Xaridlarga',
			bgColor: 'bg-gradient-to-r from-orange-200 to-orange-300',
			image: '/logo.png',
		},
		{
			title: 'Optim elektr asboblar',
			subtitle: 'Sifatli va ishonchli elektr asboblar',
			discount: '-15%',
			discountText: 'gacha',
			buttonText: "Ko'rish",
			bgColor: 'bg-gradient-to-r from-blue-200 to-blue-300',
			image: '/logo.png',
		},
		{
			title: 'Optim maishiy texnika',
			subtitle: 'Uyingiz uchun zamonaviy texnika',
			discount: '-25%',
			discountText: 'gacha',
			buttonText: 'Tanishish',
			bgColor: 'bg-gradient-to-r from-green-200 to-green-300',
			image: '/logo.png',
		},
	]

	const nextSlide = () => {
		setDirection(1)
		setCurrentSlide(prev => (prev + 1) % banners.length)
	}

	const prevSlide = () => {
		setDirection(-1)
		setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)
	}

	const goToSlide = (index: number) => {
		setDirection(index > currentSlide ? 1 : -1)
		setCurrentSlide(index)
	}

	// Auto-slide every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			nextSlide()
		}, 5000)
		return () => clearInterval(interval)
	}, [])

	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}),
	}

	const banner = banners[currentSlide]

	return (
		<div className='relative my-4 rounded-xl overflow-hidden h-[300px] sm:h-[350px] md:h-[400px]'>
			<AnimatePresence initial={false} custom={direction} mode='wait'>
				<motion.div
					key={currentSlide}
					custom={direction}
					variants={variants}
					initial='enter'
					animate='center'
					exit='exit'
					transition={{
						x: { type: 'spring', stiffness: 300, damping: 30 },
						opacity: { duration: 0.2 },
					}}
					className={`${banner.bgColor} p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between rounded-xl h-full`}
				>
					<div className='max-w-md text-white z-10'>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4'>
							{banner.title}
						</h2>
						<p className='text-sm sm:text-base md:text-xl mb-3 md:mb-6'>
							{banner.subtitle}
						</p>
						<div className='flex items-center gap-2 sm:gap-4 mb-3 md:mb-6'>
							<Button className='bg-white text-black hover:bg-gray-100 px-3 py-1 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base'>
								{banner.buttonText}
							</Button>
							<div className='bg-yellow-300 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-lg sm:text-2xl'>
								{banner.discount}{' '}
								<span className='text-xs sm:text-sm'>
									{banner.discountText}
								</span>
							</div>
						</div>
					</div>
					<motion.div
						className='relative mt-4 md:mt-0'
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<Image
							src={banner.image || '/placeholder.svg'}
							alt='Promotional product'
							className='max-h-[150px] sm:max-h-[200px] md:max-h-[300px] object-contain'
							width={300}
							height={300}
						/>
					</motion.div>
				</motion.div>
			</AnimatePresence>

			<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
				{banners.map((_, index) => (
					<button
						key={index}
						className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300`}
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					>
						<span
							className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
								index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
							}`}
						/>
					</button>
				))}
			</div>

			<Button
				variant='outline'
				size='icon'
				className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-20'
				onClick={prevSlide}
				aria-label='Previous slide'
			>
				<ChevronLeft className='h-4 w-4 sm:h-6 sm:w-6' />
			</Button>

			<Button
				variant='outline'
				size='icon'
				className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-20'
				onClick={nextSlide}
				aria-label='Next slide'
			>
				<ChevronRight className='h-4 w-4 sm:h-6 sm:w-6' />
			</Button>
		</div>
	)
}
