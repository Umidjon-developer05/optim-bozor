import { getCategorieSlug, getProductCategorySlug } from '@/actions/user.action'
import React from 'react'
import ProductGrid from '../../_components/product-grid'
import { Subcategory } from '@/types'
export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}) {
	const { slug } = params

	const lastDashIndex = slug.lastIndexOf('-')

	const slu = slug.substring(0, lastDashIndex)
	const id = slug.substring(lastDashIndex + 1)
	const categoryProduct = await getProductCategorySlug({
		parsedInput: { id },
	})
	const res = await getCategorieSlug(slu)

	const keywords =
		res.subcategories?.map((subcategory: Subcategory) => subcategory.name) || []
	console.log(categoryProduct)
	return {
		title: slu.toLowerCase(),
		description: 'Catalog',
		keywords,
		openGraph: {
			title: slug.toLowerCase(),
			description: slug.toLowerCase(),
			url: `https://optim-bozor.uz/${slug}`,
			images: [
				{
					url: categoryProduct?.products[0]?.image,
					width: 800,
					height: 600,
				},
			],
		},
	}
}

async function page({ params }: { params: { slug: string } }) {
	const { slug } = params
	const id = slug.split('-').pop()
	if (!id) {
		return <div className='container mx-auto'>Invalid slug</div>
	}
	const categoryProduct = await getProductCategorySlug({
		parsedInput: { id },
	})
	if (!categoryProduct) {
		return <div className='container mx-auto'>No products found</div>
	}

	return (
		<div className='container mx-auto'>
			{categoryProduct && <ProductGrid products={categoryProduct?.products} />}
		</div>
	)
}

export default page
