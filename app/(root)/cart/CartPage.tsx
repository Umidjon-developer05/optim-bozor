'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import {
	Minus,
	Plus,
	Trash2,
	Check,
	AlertCircle,
	Map,
	Loader,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import CreateOrderButton from '../product/_components/create-order.btn'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import dynamic from 'next/dynamic'
const MapUser = dynamic(() => import('./_components/map'), { ssr: false })
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
	addOrdersZakaz,
	addToCart,
	removeFromCart,
} from '@/actions/user.action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Seller = {
	_id: string
	fullName: string
	email: string
	phone?: string
}

type Product = {
	productId: {
		_id: string
		userId: object // Assuming userId is an object, you can define this more precisely if needed.
		title: string
		price: number
		description: string
		category: string
		image: string
		imageKey: string
		createdAt: string
		updatedAt: string
	}
	quantity: number
	selleronId: Seller
	_id: string
}

type CartProps = {
	products: Product[] // This would be the array of products in the cart.
}

type LocationData = {
	lat: string
	lng: string
	address?: string
	isInBukhara: boolean
	totalPrice: number
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat('uz-UZ', {
		style: 'currency',
		currency: 'UZS',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price)
}

function groupBySeller(products: Product[]) {
	if (!Array.isArray(products)) return {}

	const grouped: Record<string, { seller: Seller; items: Product[] }> = {}

	products.forEach(item => {
		const seller = item.selleronId
		const sellerId = seller._id

		if (!grouped[sellerId]) {
			grouped[sellerId] = {
				seller: seller,
				items: [],
			}
		}
		grouped[sellerId].items.push(item)
	})

	return grouped
}

const CartPage: React.FC<CartProps> = ({ products: initialProducts }) => {
	const [products, setProducts] = useState<Product[]>(initialProducts)
	const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
		null
	)
	const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
	const [checked, setChecked] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleLocationSelect = (location: LocationData | null) => {
		if (location) {
			setSelectedLocation(location)
		}
	}

	if (!products || products.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center  h-full mt-20'>
				<Image
					src='/savat.png'
					alt='Empty Cart'
					width={450}
					height={450}
					className='mb-4'
				/>

				<Link href={'/'}>
					<Button>Do&apos;konga qaytish</Button>
				</Link>
			</div>
		)
	}

	async function updateQuantity(productId: string, newQuantity: number) {
		if (newQuantity < 1) return

		// Find the product in the cart to get the correct productId and selleronId
		const product = products.find(product => product._id === productId)

		if (!product) return

		try {
			setProducts(prevProducts =>
				prevProducts.map(product =>
					product._id === productId
						? { ...product, quantity: newQuantity }
						: product
				)
			)

			// Then send the update to the server
			const updatedCart = await addToCart({
				productId: product.productId._id, // Use the actual product ID from the database
				quantity: newQuantity,
				selleronId: product.selleronId._id,
			})

			if (updatedCart?.serverError) {
				// Revert the UI change if there was an error
				setProducts(initialProducts)
			}
		} catch (error) {
			console.error('Error updating cart quantity:', error)
			// Revert the UI change if there was an error
			setProducts(initialProducts)
		}
	}

	const removeProduct = (productId: string) => {
		setProducts(prevProducts =>
			prevProducts.filter(product => product._id !== productId)
		)
	}

	const calculateTotalPrice = (items: Product[]) => {
		return items.reduce(
			(total, item) => total + item.productId.price * item.quantity,
			0
		)
	}

	const handleInputChange = (e: boolean) => {
		setChecked(e)
	}

	const groupedBySeller = groupBySeller(products)

	async function handleOrderZakaz() {
		try {
			setIsLoading(true)

			if (products === null || products.length === 0) {
				setIsLoading(false)
				return console.error('No products in cart')
			}

			const response = await addOrdersZakaz({
				totalPrice: formatPrice(calculateTotalPrice(products)),
				products: products.map(product => ({
					productId: product.productId._id,
					selleronId: product.selleronId._id,
					quantity: product.quantity,
				})),
				latitude: selectedLocation?.lat,
				longitude: selectedLocation?.lng,
				isPaid: checked ? false : true,
			})

			if (response?.serverError) {
				console.error('Error creating order:', response.serverError)
				setIsLoading(false)
				return
			}

			const removeResponse = await removeFromCart()

			if (removeResponse?.success === 'Product removed from cart') {
				router.push('/success') // ✅ sahifaga o'tkazadi
			} else {
				setIsLoading(false)
			}
		} catch (error) {
			console.error('Error creating order:', error)
			setIsLoading(false)
		}
	}

	return (
		<div className='container mx-auto py-8 px-4'>
			<h1 className='text-3xl font-bold mb-6'>Savat</h1>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2 space-y-6'>
					{Object.entries(groupedBySeller).map(([sellerId, group]) => (
						<Card key={sellerId} className='overflow-hidden'>
							<div className='bg-gray-50 p-4'>
								<h2 className='text-xl font-semibold'>
									Sotuvchi: {group.seller.fullName}
								</h2>
								<p className='text-sm text-gray-600'>{group.seller.email} </p>
							</div>

							<CardContent className='p-0'>
								{group.items.map(item => (
									<div key={item._id} className='p-4 border-b last:border-b-0'>
										<div className='flex flex-col sm:flex-row gap-4'>
											<div className='relative w-full sm:w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'>
												<Image
													src={item.productId.image || '/placeholder.svg'}
													alt={item.productId.title}
													fill
													className='object-cover'
												/>
											</div>

											<div className='flex-1 flex flex-col'>
												<div className='flex justify-between'>
													<h3 className='font-medium text-lg'>
														{item.productId.title?.slice(0, 20)}...
													</h3>
													<p className='font-semibold'>
														{formatPrice(item.productId.price * item.quantity)}
													</p>
												</div>

												<p className='text-sm text-gray-500 line-clamp-2 mb-2'>
													{item.productId?.description?.slice(0, 30)}...
												</p>
												<span className='font-bold text-lg'>
													{formatPrice(
														group.items.reduce(
															(total, item) =>
																total + item.productId?.price * item.quantity,
															0
														)
													)}
												</span>

												<div className='mt-auto flex justify-between items-center'>
													<div className='flex items-center border rounded-md'>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 rounded-none'
															onClick={() =>
																updateQuantity(item._id, item.quantity - 1)
															}
														>
															<Minus className='h-4 w-4' />
														</Button>
														<span className='w-10 text-center'>
															{item.quantity}
														</span>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 rounded-none'
															onClick={() =>
																updateQuantity(item._id, item.quantity + 1)
															}
														>
															<Plus className='h-4 w-4' />
														</Button>
													</div>

													<Button
														variant='ghost'
														size='icon'
														className='text-red-500 hover:text-red-700 hover:bg-red-50'
														onClick={() => removeProduct(item._id)}
													>
														<Trash2 className='h-4 w-4' />
													</Button>
												</div>
											</div>
										</div>
									</div>
								))}
							</CardContent>

							<div className='bg-gray-50 p-4 flex justify-between items-center'>
								<span className='font-medium'>
									Sotuvchi bo&apos;yicha jami:
								</span>
								<span className='font-bold text-lg'>{}</span>
							</div>
						</Card>
					))}
				</div>

				<div className='lg:col-span-1'>
					<Card>
						<CardContent className='p-6'>
							<h2 className='text-xl font-bold mb-4'>
								Buyurtma ma&apos;lumotlari
							</h2>

							<div className='space-y-4'>
								<div className='flex justify-between'>
									<span className='text-gray-600'>
										Mahsulotlar ({products.length})
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-gray-600'>Yetkazib berish</span>
									<span>Bepul</span>
								</div>

								<Separator />

								<div className='flex justify-between font-bold text-lg'>
									<span>Jami</span>
									<span>{formatPrice(calculateTotalPrice(products))}</span>
								</div>
								<div className='flex items-center space-x-2 cursor-pointer'>
									<Checkbox
										id='terms'
										checked={checked}
										onCheckedChange={handleInputChange}
									/>
									<Label
										htmlFor='terms'
										className='text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									>
										Yetqazib berilgandan keyin to&apos;lov qilish
									</Label>
								</div>

								<AlertDialog
									open={isLocationDialogOpen}
									onOpenChange={setIsLocationDialogOpen}
								>
									<AlertDialogTrigger asChild>
										<Button variant='outline' className='w-full'>
											{selectedLocation ? (
												<Map className='mr-2 h-4 w-4' />
											) : (
												<Map className='mr-2 h-4 w-4' />
											)}
											{selectedLocation
												? "Manzilni o'zgartirish"
												: 'Turgan joyizni tanlang'}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className='w-[90vw] max-w-[1200px]'>
										<AlertDialogHeader>
											<MapUser
												onLocationSelect={location =>
													location &&
													handleLocationSelect({
														...location,
														lat: location.lat.toString(),
														lng: location.lng.toString(),
														totalPrice: calculateTotalPrice(products),
													})
												}
											/>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Bekor qilish</AlertDialogCancel>
											<AlertDialogAction
												disabled={
													!selectedLocation || !selectedLocation.isInBukhara
												}
												onClick={() => setIsLocationDialogOpen(false)}
											>
												Tasdiqlash
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								{selectedLocation && (
									<div className='mt-4'>
										{selectedLocation.isInBukhara ? (
											<Alert
												variant='default'
												className='bg-green-50 border-green-200'
											>
												<Check className='h-4 w-4 text-green-600' />
												<AlertTitle>Manzil tasdiqlandi</AlertTitle>
												<AlertDescription className='text-sm'>
													{selectedLocation.address ||
														`${Number.parseFloat(selectedLocation?.lat).toFixed(
															6
														)}, ${Number.parseFloat(
															selectedLocation?.lng
														).toFixed(6)}`}
												</AlertDescription>
											</Alert>
										) : (
											<Alert variant='destructive'>
												<AlertCircle className='h-4 w-4' />
												<AlertTitle>Noto&apos;g&apos;ri manzil</AlertTitle>
												<AlertDescription className='text-sm'>
													Tanlangan manzil Buxoro viloyati chegarasidan
													tashqarida. Iltimos, boshqa manzil tanlang.
												</AlertDescription>
											</Alert>
										)}
									</div>
								)}
								<CreateOrderButton
									productId={''}
									disabled={
										!selectedLocation ||
										!selectedLocation.isInBukhara ||
										checked
									}
								/>

								<Button
									className='w-full mt-4'
									size='lg'
									disabled={
										!selectedLocation ||
										!selectedLocation.isInBukhara ||
										!checked ||
										isLoading
									}
									onClick={handleOrderZakaz}
								>
									{isLoading ? (
										<Loader className='animate-spin' />
									) : (
										'Buyurtma berish'
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default CartPage
