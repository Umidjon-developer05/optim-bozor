export default function Loading() {
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='animate-pulse'>
				<div className='h-10 bg-gray-200 rounded w-full max-w-md mb-6'></div>
				<div className='h-6 bg-gray-200 rounded w-48 mb-8'></div>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{[...Array(8)].map((_, i) => (
						<div key={i} className='border rounded-lg overflow-hidden'>
							<div className='bg-gray-200 w-full aspect-square'></div>
							<div className='p-3'>
								<div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
								<div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
								<div className='h-4 bg-gray-200 rounded w-1/4'></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
