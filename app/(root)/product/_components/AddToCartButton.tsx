'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/actions/user.action'
import { toast } from '@/hooks/use-toast'

interface Props {
	productId: string
	selleronId: string
}

export default function AddToCartButton({ productId, selleronId }: Props) {
	const [isLoading, setIsLoading] = useState(false)

	const handleAdd = async () => {
		setIsLoading(true)
		try {
			await addToCart({ productId, quantity: 1, selleronId })
			toast({
				title: 'Success',
				description: 'Product added to cart successfully',
			})
		} catch {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			onClick={handleAdd}
			disabled={isLoading}
			className='bg-primary text-white py-2 px-4 rounded-md'
		>
			{isLoading ? 'Qo`shilmoqda...' : "Korzinaga qo'shish"}
		</Button>
	)
}
