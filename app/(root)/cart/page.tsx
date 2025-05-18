import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getCart } from '@/actions/user.action'

// Dynamically import CartPage to reduce the bundle size
const CartPage = dynamic(() => import('./CartPage'), { ssr: false })

// Fetch cart data on the server-side for better performance
const Cart = async () => {
	// Optimized fetching
	const data = await getCart()
	const cart = data?.data?.cart?.products || []

	return (
		<Suspense fallback={<div>Loading cart...</div>}>
			<CartPage products={cart} />
		</Suspense>
	)
}

export default Cart
