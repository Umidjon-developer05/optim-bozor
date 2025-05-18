import { getCategories } from '@/actions/user.action'
import React from 'react'
import CatalogSiderbar from '../_components/catalog'

async function layout({ children }: { children: React.ReactNode }) {
	const category = await getCategories()
	if (!category) return null
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex flex-col md:flex-row gap-6'>
				<CatalogSiderbar categories={category?.categories} />
				<main>{children}</main>
			</div>
		</div>
	)
}

export default layout
