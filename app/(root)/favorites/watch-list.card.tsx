'use client'

import { IProduct } from '@/types'
import { FC, MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import useAction from '@/hooks/use-action'
import { deleteFavorite } from '@/actions/user.action'
import { toast } from '@/hooks/use-toast'
import NoSSR from '@/components/shared/NoSSR'
import Link from 'next/link'
import CustomImage from '@/components/shared/custom-image'

interface Props {
	product: Partial<IProduct>
}

const WatchListCard: FC<Props> = ({ product }) => {
	const { isLoading, onError, setIsLoading } = useAction()

	async function onDelete(e: MouseEvent) {
		e.preventDefault() // Link ochilishini to'xtatish
		setIsLoading(true)

		const res = await deleteFavorite({ id: product._id! })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			setIsLoading(false)
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			setIsLoading(false)
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast({ description: "Saralanganlardan o'chirildi" })

			// localStorage'dan o'chirish
			const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
			const updatedFavs = favs.filter((id: string) => id !== product._id)
			localStorage.setItem('favorites', JSON.stringify(updatedFavs))
		}
		setIsLoading(false)
	}

	return (
		<Link href={`/product/${product._id}`} className='group'>
			<div className='border relative flex flex-col w-full sm:max-w-[300px] rounded-md'>
				<div className='bg-secondary relative h-52'>
					<CustomImage
						src={product.image!}
						alt={product.title!}
						className='object-cover rounded-md'
					/>
					<div className='absolute right-0 top-0  flex items-center m-2'>
						<Button
							size='icon'
							disabled={isLoading}
							onClick={onDelete}
							variant='outline'
						>
							<Heart className='text-red-500 fill-red-500' />
						</Button>
					</div>
				</div>

				<div className='p-2'>
					<div className='flex justify-between items-center text-sm'>
						<h1 className='font-bold break-words'>
							{product.title?.slice(0, 20).concat('...')}
						</h1>
					</div>
					<p className='font-medium'>
						<NoSSR>{formatPrice(+product.price!).toString()}</NoSSR>
					</p>
				</div>
			</div>
		</Link>
	)
}

export default WatchListCard
