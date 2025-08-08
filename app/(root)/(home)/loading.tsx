import React from 'react'

const Loading = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			{/* Header and Navigation Skeleton */}
			<div className='animate-pulse mb-6'>
				<div className='flex overflow-x-auto space-x-4 mb-4'>
					{[...Array(8)].map((_, i) => (
						<div
							key={`nav-${i}`}
							className='h-6 bg-gray-200 rounded w-24 flex-shrink-0'
						></div>
					))}
				</div>
				<div className='h-10 bg-gray-200 rounded w-full mb-6'></div>
			</div>

			{/* Banner Skeleton */}
			<div className='animate-pulse mb-8'>
				<div className='bg-orange-100 rounded-lg p-6 flex flex-col md:flex-row items-center'>
					<div className='w-full md:w-1/2 space-y-4 mb-4 md:mb-0'>
						<div className='h-8 bg-gray-200 rounded w-3/4'></div>
						<div className='h-6 bg-gray-200 rounded w-full max-w-md'></div>
						<div className='h-6 bg-gray-200 rounded w-full max-w-sm'></div>
						<div className='flex space-x-2'>
							<div className='h-8 bg-gray-200 rounded-full w-24'></div>
							<div className='h-8 bg-gray-200 rounded-full w-24'></div>
						</div>
					</div>
					<div className='w-full md:w-1/2 flex justify-center'>
						<div className='bg-gray-200 rounded-lg w-64 h-64'></div>
					</div>
				</div>
			</div>

			{/* Category Icons Skeleton */}
			<div className='animate-pulse mb-8'>
				<div className='grid grid-cols-4 gap-4'>
					{[...Array(4)].map((_, i) => (
						<div key={`cat-${i}`} className='flex flex-col items-center'>
							<div className='bg-gray-200 rounded-lg w-16 h-16 mb-2'></div>
							<div className='h-4 bg-gray-200 rounded w-20'></div>
						</div>
					))}
				</div>
			</div>

			{/* Products Section Skeleton */}
			<div className='animate-pulse'>
				<div className='h-8 bg-gray-200 rounded w-48 mb-6'></div>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
					{[...Array(10)].map((_, i) => (
						<div
							key={`prod-${i}`}
							className='border rounded-lg overflow-hidden'
						>
							<div className='bg-gray-200 w-full aspect-square'></div>
							<div className='p-3'>
								<div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
								<div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
								<div className='h-5 bg-gray-200 rounded w-1/3 font-bold'></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Loading
