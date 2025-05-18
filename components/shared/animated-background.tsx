'use client'

import { useEffect, useRef } from 'react'

interface Particle {
	x: number
	y: number
	size: number
	speedX: number
	speedY: number
	color: string
}

export default function AnimatedBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set canvas to full window size
		const handleResize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}

		window.addEventListener('resize', handleResize)
		handleResize()

		// Create particles
		const particles: Particle[] = []
		const colors = ['#0070f3', '#00a1f3', '#0091d3', '#007ac3']

		for (let i = 0; i < 50; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 5 + 1,
				speedX: (Math.random() - 0.5) * 1,
				speedY: (Math.random() - 0.5) * 1,
				color: colors[Math.floor(Math.random() * colors.length)],
			})
		}

		// Animation function
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// Draw particles
			particles.forEach((particle, index) => {
				ctx.fillStyle = particle.color
				ctx.beginPath()
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
				ctx.fill()

				// Update position
				particle.x += particle.speedX
				particle.y += particle.speedY

				// Bounce off edges
				if (particle.x > canvas.width || particle.x < 0) {
					particle.speedX = -particle.speedX
				}

				if (particle.y > canvas.height || particle.y < 0) {
					particle.speedY = -particle.speedY
				}

				// Connect particles with lines if they are close enough
				particles.slice(index + 1).forEach(otherParticle => {
					const dx = particle.x - otherParticle.x
					const dy = particle.y - otherParticle.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance < 150) {
						ctx.beginPath()
						ctx.strokeStyle = `rgba(0, 112, 243, ${0.2 - distance / 750})`
						ctx.lineWidth = 0.5
						ctx.moveTo(particle.x, particle.y)
						ctx.lineTo(otherParticle.x, otherParticle.y)
						ctx.stroke()
					}
				})
			})

			requestAnimationFrame(animate)
		}

		animate()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			className='fixed top-0 left-0 w-full h-full -z-10'
		/>
	)
}
