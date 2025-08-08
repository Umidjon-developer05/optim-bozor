import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { getProduct } from '@/actions/user.action'
import type { Params } from '@/types'
import { notFound } from 'next/navigation'
import AddToCartButton from '../_components/AddToCartButton'
import CustomImage from '@/components/shared/custom-image'
import { FC } from 'react'

import HearComponent from '../../_components/HearComponent'
interface Props {
	params: Params
}
export async function generateMetadata({ params }: Props) {
	const { productId } = params
	const res = await getProduct({ id: productId })
	const product = res?.data?.product

	return {
		title: product?.title,
		description: product?.description,
		openGraph: { images: product?.image },
	}
}
const Page: FC<Props> = async ({ params }: Props) => {
	const { productId } = await params
	const res = await getProduct({ id: productId })
	const product = res?.data?.product
	console.log('productId', product)
	if (!product) return notFound()
	console.log('product', product)

	return (
		<div className='container mx-auto px-4 py-6 max-w-7xl'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
				{/* Product Image - Full width on mobile, 2 columns on large screens */}
				<div className='bg-secondary relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-lg overflow-hidden lg:col-span-2'>
					<CustomImage
						src={product.image || '/placeholder.svg'}
						className='object-contain mx-auto p-2'
						alt={product.title}
					/>
				</div>

				{/* Product Details - Stacks vertically on mobile */}
				<div className='flex flex-col space-y-4 lg:self-start lg:sticky lg:top-20 p-2'>
					<HearComponent productId={productId} />

					<h1 className='font-bold text-xl sm:text-2xl md:text-3xl break-words'>
						{product.title}
					</h1>
					<Badge className='w-fit text-sm' variant={'secondary'}>
						# {product?.category?.name}
					</Badge>
					<p className='text-sm md:text-base break-words'>
						{product.description}
					</p>
					<p className='font-bold text-xl md:text-2xl text-wrap'>
						{formatPrice(+product.price)}
					</p>
					{/* <CreateOrderButton /> */}
					<div className='flex flex-col space-y-2 w-full sm:w-auto'>
						<AddToCartButton
							productId={product._id}
							selleronId={product?.userId?._id}
						/>
					</div>
				</div>
			</div>

			{/* Seller Information - Full width with better spacing */}
			<div className='mt-8 p-4 border rounded-lg bg-card shadow-sm'>
				<h1 className='font-bold text-lg md:text-xl mb-4'>
					Sotuvchi firma malumoti
				</h1>
				<div className='flex items-center space-x-4'>
					{product?.userId?.phone1 ? (
						<Image
							src={product.userId.phone1 ?? ''}
							width={50}
							height={50}
							className='rounded-full object-cover'
							alt={product?.userId?.fullName}
						/>
					) : (
						<div className='w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-full flex items-center justify-center font-bold text-lg'>
							{product?.userId?.fullName.slice(0, 2).toUpperCase()}
						</div>
					)}
					<div>
						<p className='font-bold text-base md:text-lg'>
							{product?.userId?.fullName}
						</p>
						<p className='text-sm md:text-base text-muted-foreground'>
							{product?.userId?.email}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
