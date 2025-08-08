'use client'

import { clickCheckout } from '@/actions/user.action'
import { Button } from '@/components/ui/button'

import useAction from '@/hooks/use-action'
import Image from 'next/image'
import React from 'react'

const CreateOrderButton = ({
	productId,
	disabled,
}: {
	productId: string
	disabled?: boolean
}) => {
	const { isLoading, onError, setIsLoading } = useAction()

	const onClick = async () => {
		setIsLoading(true)
		const res = await clickCheckout({ id: productId })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			window.open(res.data.checkoutUrl, '_self')
		}
	}

	return (
		<div className='flex flex-col space-y-1'>
			<Button
				variant={'secondary'}
				disabled={isLoading || disabled}
				onClick={onClick}
			>
				<Image
					src={'/click.svg'}
					alt='stripe'
					width={70}
					height={50}
					className='cursor-pointer'
				/>
			</Button>
		</div>
	)
}

export default CreateOrderButton
