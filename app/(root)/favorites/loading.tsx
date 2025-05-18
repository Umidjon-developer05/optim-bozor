import { Separator } from '@/components/ui/separator'

const Loading = () => {
	return (
		<div className='container mx-auto'>
			<h1 className='text-xl font-bold'>Saralangan mahsulotlar</h1>
			<Separator className='my-3' />
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'></div>
		</div>
	)
}

export default Loading
