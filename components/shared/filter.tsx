'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { cn, formUrlQuery, removeUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { useCallback } from 'react'

const Filter = () => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		const newUrl = formUrlQuery({
			key: 'q',
			params: searchParams.toString(),
			value,
		})
		router.push(newUrl)

		if (value === '') {
			const newUrl = removeUrlQuery({
				key: 'q',
				params: searchParams.toString(),
			})
			router.push(newUrl)
		}
	}

	const handleSearchDebounce = useCallback(debounce(onInputSearch, 300), [])

	return (
		<div className={cn('gap-1 max-md:w-full grid ')}>
			<div className='flex items-center rounded-md bg-secondary  border '>
				<Input
					placeholder='Qidirish'
					className='text-xs border-none no-focus no-shadow'
					onChange={handleSearchDebounce}
				/>
				<Search className='mr-2 cursor-pointer text-muted-foreground' />
			</div>
		</div>
	)
}

export default Filter
