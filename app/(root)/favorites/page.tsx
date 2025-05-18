import { getFavourites } from '@/actions/user.action'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from '@/types'
import React, { FC, Suspense } from 'react'
import WatchListCard from './watch-list.card'

interface Props {
	searchParams: SearchParams
}
const Page: FC<Props> = async props => {
	const searchParams = props.searchParams
	const res = await getFavourites({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		page: `${searchParams.page || '1'}`,
		category: `${searchParams.category || ''}`,
	})

	const products = res?.data?.products
	const isNext = res?.data?.isNext || false

	return (
		<div className='container mx-auto'>
			<h1 className='text-xl font-bold mt-2'>Saralangan mahsulotlar</h1>

			<Separator className='my-3' />

			<Suspense></Suspense>

			{products && products.length === 0 && (
				<div className='text-center mt-3 '>
					Hozircha hech qanday mahsulot yoq.{' '}
				</div>
			)}

			<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-3'>
				{products &&
					products.map(item => (
						<Suspense key={item._id}>
							<WatchListCard product={item} />
						</Suspense>
					))}
			</div>

			<Pagination
				isNext={isNext}
				pageNumber={
					searchParams?.page?.toString() ? +searchParams.page.toString() : 1
				}
			/>
		</div>
	)
}

export default Page
