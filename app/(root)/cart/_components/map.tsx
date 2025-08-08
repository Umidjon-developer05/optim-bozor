'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Share2, MapPin, Navigation } from 'lucide-react'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('@/components/map'), {
	ssr: false,
	loading: () => (
		<div className='h-[500px] w-full bg-muted flex items-center justify-center'>
			Xarita yuklanmoqda...
		</div>
	),
})

// Bukhara region coordinates

export default function MapUser({
	onLocationSelect,
}: {
	onLocationSelect?: (
		location: {
			lat: number
			lng: number
			address?: string
			isInBukhara: boolean
		} | null
	) => void
}) {
	const [selectedLocation, setSelectedLocation] = useState<{
		lat: number
		lng: number
		address?: string
	} | null>(null)

	const [userLocation, setUserLocation] = useState<{
		lat: number
		lng: number
		address?: string
	} | null>(null)

	const [isLocating, setIsLocating] = useState(false)
	const { toast } = useToast()

	// Bukhara region coordinates
	const BUKHARA_CENTER: [number, number] = [39.7747, 64.4286]

	// Function to check if coordinates are within Bukhara region (approximate)
	const isInBukharaRegion = (lat: number, lng: number): boolean => {
		// Define approximate boundaries for Bukhara region
		const latDiff = Math.abs(lat - BUKHARA_CENTER[0])
		const lngDiff = Math.abs(lng - BUKHARA_CENTER[1])

		// Within approximately 100km of Bukhara center (rough approximation)
		return latDiff < 0.9 && lngDiff < 1.2
	}

	const handleLocationSelect = (location: { lat: number; lng: number }) => {
		const isInBukhara = isInBukharaRegion(location.lat, location.lng)
		const updatedLocation = {
			...location,
			isInBukhara,
		}

		setSelectedLocation(updatedLocation)

		fetchAddress(location.lat, location.lng).then(address => {
			const locationWithAddress = { ...updatedLocation, address }
			setSelectedLocation(locationWithAddress)

			// Pass the selected location back to the parent component
			if (onLocationSelect) {
				onLocationSelect(locationWithAddress)
			}
		})

		if (!isInBukhara) {
			toast({
				variant: 'destructive',
				title: 'Xatolik!',
				description:
					'Tanlangan joy Buxoro viloyati chegarasidan tashqarida. Iltimos, Buxoro viloyati ichidan joy tanlang.',
			})
		}
	}

	// Modify getUserLocation to check if user is in Bukhara
	const getUserLocation = () => {
		setIsLocating(true)

		if (!navigator.geolocation) {
			toast({
				variant: 'destructive',
				title: 'Xatolik!',
				description:
					"Sizning brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.",
			})
			setIsLocating(false)
			return
		}

		navigator.geolocation.getCurrentPosition(
			position => {
				const userLoc = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}

				const isInBukhara = isInBukharaRegion(userLoc.lat, userLoc.lng)
				const updatedLocation = { ...userLoc, isInBukhara }

				setUserLocation(updatedLocation)

				fetchAddress(userLoc.lat, userLoc.lng).then(address => {
					const locationWithAddress = { ...updatedLocation, address }
					setUserLocation(locationWithAddress)

					// Pass the user location back to the parent component
					if (onLocationSelect) {
						onLocationSelect(locationWithAddress)
					}
				})

				setIsLocating(false)

				toast({
					title: 'Joylashuv aniqlandi!',
					description: "Sizning joriy joylashuvingiz xaritada ko'rsatildi.",
					variant: isInBukhara ? 'default' : 'destructive',
				})

				if (!isInBukhara) {
					toast({
						variant: 'destructive',
						title: 'Xatolik!',
						description:
							'Sizning joylashuvingiz Buxoro viloyati chegarasidan tashqarida. Iltimos, Buxoro viloyati ichidan joy tanlang.',
					})
				}
			},
			error => {
				console.error('Geolokatsiya xatosi:', error)
				toast({
					variant: 'destructive',
					title: 'Xatolik!',
					description:
						"Joylashuvni aniqlab bo'lmadi. Iltimos, brauzeringizda joylashuv xizmatlarini yoqing.",
				})
				setIsLocating(false)
			},
			{ enableHighAccuracy: true }
		)
	}

	// Function to fetch address from coordinates using Nominatim OpenStreetMap API
	const fetchAddress = async (lat: number, lng: number): Promise<string> => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
			)
			const data = await response.json()
			return data.display_name || "Noma'lum manzil"
		} catch (error) {
			console.error('Manzilni olishda xatolik:', error)
			return 'Manzil topilmadi'
		}
	}

	return (
		<main className='container mx-auto py-6 px-4'>
			<h1 className='text-3xl font-bold '>Buxoro viloyati xaritasi</h1>

			<Tabs defaultValue='map' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 mb-6'>
					<TabsTrigger value='map'>Xarita</TabsTrigger>
					<TabsTrigger value='info'>Ma&apos;lumot</TabsTrigger>
				</TabsList>

				<TabsContent value='map' className='mt-0'>
					<div className='grid grid-cols-1 gap-6'>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle>Interaktiv xarita</CardTitle>
								<CardDescription>
									Xaritadan istalgan joyni tanlang yoki o&apos;z
									joylashuvingizni aniqlang
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='h-[300px] w-full rounded-md overflow-hidden mb-4'>
									<MapWithNoSSR
										center={BUKHARA_CENTER}
										onLocationSelect={handleLocationSelect}
										userLocation={userLocation}
										selectedLocation={selectedLocation}
									/>
								</div>

								<div className='flex flex-wrap gap-3'>
									<Button
										onClick={getUserLocation}
										disabled={isLocating}
										className='flex items-center gap-2'
									>
										<Navigation className='h-4 w-4' />
										{isLocating ? 'Aniqlanmoqda...' : 'Mening joylashuvim'}
									</Button>

									{selectedLocation && (
										<Button
											variant='outline'
											className='flex items-center gap-2'
										>
											<Share2 className='h-4 w-4' />
											Tanlangan joyni ulashish
										</Button>
									)}

									{userLocation && (
										<Button
											variant='outline'
											className='flex items-center gap-2'
										>
											<Share2 className='h-4 w-4' />
											Mening joylashuvimni ulashish
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value='info' className='mt-0'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{selectedLocation && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<MapPin className='h-5 w-5' />
										Tanlangan joy
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='grid grid-cols-2 gap-2'>
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Kenglik</p>
												<p className='font-medium'>
													{selectedLocation.lat.toFixed(6)}
												</p>
											</div>
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Uzunlik</p>
												<p className='font-medium'>
													{selectedLocation.lng.toFixed(6)}
												</p>
											</div>
										</div>

										{selectedLocation.address && (
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Manzil</p>
												<p className='font-medium break-words'>
													{selectedLocation.address}
												</p>
											</div>
										)}

										<Button
											variant='outline'
											className='w-full flex items-center justify-center gap-2'
										>
											<Share2 className='h-4 w-4' />
											Ulashish
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{userLocation && (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center gap-2'>
										<Navigation className='h-5 w-5' />
										Mening joylashuvim
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='grid grid-cols-2 gap-2'>
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Kenglik</p>
												<p className='font-medium'>
													{userLocation.lat.toFixed(6)}
												</p>
											</div>
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Uzunlik</p>
												<p className='font-medium'>
													{userLocation.lng.toFixed(6)}
												</p>
											</div>
										</div>

										{userLocation.address && (
											<div className='bg-muted p-3 rounded-md'>
												<p className='text-sm text-muted-foreground'>Manzil</p>
												<p className='font-medium break-words'>
													{userLocation.address}
												</p>
											</div>
										)}

										<Button
											variant='outline'
											className='w-full flex items-center justify-center gap-2'
										>
											<Share2 className='h-4 w-4' />
											Ulashish
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{!selectedLocation && !userLocation && (
							<Card className='md:col-span-2'>
								<CardHeader>
									<CardTitle>Ma&apos;lumot mavjud emas</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-muted-foreground text-center py-6'>
										Xaritadan joyni tanlang yoki o&apos;z joylashuvingizni
										aniqlang
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>
			</Tabs>

			<Toaster />
		</main>
	)
}
