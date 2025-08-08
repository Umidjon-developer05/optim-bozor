import { getCategorieSlug } from '@/actions/user.action'
import React from 'react'
import SlugClient from './_components/SlugClient'
import { Category } from '@/types'
interface PageProps {
	params: { slug: string }
}
export async function generateMetadata({ params }: PageProps) {
	const { slug } = params
	return {
		title: slug.toUpperCase(),
		description: 'Catalog',
	}
}
async function CatalogSlug({ params }: PageProps) {
	const { slug } = params
	const subcategories: Category = await getCategorieSlug(slug)
	return (
		<div>
			<SlugClient subcategories={subcategories?.subcategories} slug={slug} />
		</div>
	)
}

export default CatalogSlug
