'use client'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

function ClientToast() {
	useEffect(() => {
		toast.error(
			'Assalomu alaykum! Hozirda websitemiz test rejimida ishlamoqda.......'
		)
	}, [])
	return null
}

export default ClientToast
