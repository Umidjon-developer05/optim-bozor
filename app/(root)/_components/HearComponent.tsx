'use client'
import React, { MouseEvent, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAction from '@/hooks/use-action'
import { toast } from 'react-toastify'
import { addFavorite } from '@/actions/user.action'
function HearComponent({ productId }: { productId: string }) {
	const { isLoading, onError, setIsLoading } = useAction()
	const [isFavorite, setIsFavorite] = useState<boolean>(false)

	useEffect(() => {
		const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
		if (favs.includes(productId)) {
			setIsFavorite(true)
		}
	}, [productId])

	const onFavourite = async (e: MouseEvent) => {
		e.preventDefault()
		setIsLoading(true)
		const res = await addFavorite({ id: productId })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			setIsLoading(false)
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			setIsLoading(false)
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast.success("Siz mahsulot saralanganlarga qo'shdingiz")
			setIsFavorite(true)
			const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
			if (!favs.includes(productId)) {
				localStorage.setItem('favorites', JSON.stringify([...favs, productId]))
			}
		}
		setIsLoading(false)
	}
	return (
		<div className='flex justify-end'>
			<Button
				size='icon'
				disabled={isLoading}
				onClick={onFavourite}
				asChild
				className={
					isFavorite ? 'bg-red-500 hover:bg-red-600 p-1' : 'cursor-pointer p-1'
				}
				aria-label='Add to favorites'
			>
				<Heart color='white' />
			</Button>
		</div>
	)
}

export default HearComponent
