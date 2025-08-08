import { getOrders } from '@/actions/user.action'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { SearchParams } from '@/types'
import { format } from 'date-fns'
import Image from 'next/image'
import type { FC } from 'react'
import { MapPin, Calendar, Clock, Package, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface Props {
	searchParams: SearchParams
}

// Helper function to format price
function formatPrice(price: number): string {
	return new Intl.NumberFormat('uz-UZ', {
		style: 'currency',
		currency: 'UZS',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price)
}

// Helper function to get status color
function getStatusColor(status: string): string {
	switch (status.toLowerCase()) {
		case 'pending confirm':
			return 'bg-yellow-100 text-yellow-800 border-yellow-200'
		case 'confirmed':
			return 'bg-blue-100 text-blue-800 border-blue-200'
		case 'shipped':
			return 'bg-purple-100 text-purple-800 border-purple-200'
		case 'delivered':
			return 'bg-green-100 text-green-800 border-green-200'
		case 'cancelled':
			return 'bg-red-100 text-red-800 border-red-200'
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200'
	}
}

// Helper function to get payment status badge
function getPaymentBadge(isPaid: boolean): JSX.Element {
	return isPaid ? (
		<Badge className='bg-green-100 text-green-800 border-green-200 hover:bg-green-200'>
			To&apos;langan
		</Badge>
	) : (
		<Badge className='bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'>
			Yetkazib berilganda to&apos;lov
		</Badge>
	)
}

const OrdersPage: FC<Props> = async props => {
	const searchParams = props.searchParams
	const res = await getOrders({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	if (!res) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<h3 className='text-lg font-medium'>
						Buyurtmalarni yuklashda xatolik yuz berdi
					</h3>
					<p className='text-muted-foreground mt-2'>
						Iltimos, keyinroq qayta urinib ko&apos;ring
					</p>
				</div>
			</div>
		)
	}

	const orders = res?.data?.orders || []
	const isNext = res?.data?.isNext || false

	return (
		<div className='container mx-auto py-6 px-4 md:px-6'>
			<div className='flex justify-between items-center w-full mb-6'>
				<h1 className='text-2xl font-bold'>Mening buyurtmalarim</h1>
			</div>

			<Separator className='my-4' />

			{orders.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-12'>
					<Package className='h-16 w-16 text-muted-foreground mb-4' />
					<h3 className='text-lg font-medium'>
						Hozircha buyurtmalar yo&apos;q
					</h3>
					<p className='text-muted-foreground mt-2'>
						Sizning buyurtmalaringiz shu yerda ko&apos;rsatiladi
					</p>
				</div>
			) : (
				<div className='grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
					{orders.map(order => (
						<Card
							key={order._id}
							className='overflow-hidden hover:shadow-md transition-shadow w-full'
						>
							<div className='relative h-48 bg-gray-100'>
								<Image
									src={order.product.image || '/'}
									alt={order.product.title}
									fill
									className='object-cover'
								/>
								<div className='absolute top-2 right-2'>
									<Badge className={`${getStatusColor(order.status)}`}>
										{order.status}
									</Badge>
								</div>
							</div>
							<CardContent className='p-4'>
								<div className='flex justify-between items-start mb-3'>
									<h3 className='font-semibold text-lg line-clamp-1'>
										{order.product.title.slice(0, 20).padEnd(10, '...')}
									</h3>
								</div>
								<div className='text-right'>
									<p className='font-bold'>
										{formatPrice(order.product.price * order.quantity)}
									</p>
									<p className='text-sm text-muted-foreground'>
										{order.quantity} dona
									</p>
								</div>

								<div className='space-y-2 text-sm'>
									<div className='flex items-center gap-2'>
										<Calendar className='h-4 w-4 text-muted-foreground' />
										<span>
											Buyurtma:{' '}
											{format(new Date(order.createdAt), 'dd-MMM yyyy')}
										</span>
									</div>

									<div className='flex items-center gap-2'>
										<Clock className='h-4 w-4 text-muted-foreground' />
										<span>
											Vaqt: {format(new Date(order.createdAt), 'HH:mm')}
										</span>
									</div>

									<div className='flex items-center gap-2'>
										<MapPin className='h-4 w-4 text-muted-foreground' />
										<span className='line-clamp-1'>
											Manzil:{' '}
											<Link
												href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
												target='_blank'
											>
												<span className='text-blue-500 hover:underline'>
													Manzilingizni ko&apos;ring
												</span>
											</Link>
										</span>
									</div>

									<div className='flex items-center gap-2'>
										<CreditCard className='h-4 w-4 text-muted-foreground' />
										<span>{getPaymentBadge(order.isPaid)}</span>
									</div>
								</div>

								<div className='mt-4 pt-3 border-t'>
									<div className='flex items-center gap-2'>
										<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
											{order.user.fullName.charAt(0)}
										</div>
										<div>
											<p className='text-sm font-medium'>
												{order.user.fullName}
											</p>
											<p className='text-xs text-muted-foreground line-clamp-1'>
												{order.user.email}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<div className='mt-8'>
				<Pagination
					isNext={isNext}
					pageNumber={searchParams?.page ? +searchParams.page : 1}
				/>
			</div>
		</div>
	)
}

export default OrdersPage
