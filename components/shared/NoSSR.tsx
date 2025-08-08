// components/shared/NoSSR.tsx
'use client'

import dynamic from 'next/dynamic'
interface Props {
	children: React.ReactNode
}
const NoSSR = dynamic(
	() => Promise.resolve((props: Props) => <>{props?.children}</>),
	{
		ssr: false,
	}
)

export default NoSSR
