'use client'

import { useEffect, useRef } from 'react'
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
	useMap,
	Circle,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import L from 'leaflet'

const userIcon = new Icon({
	iconUrl: '/user-marker.png',
	shadowUrl: '/marker-shadow.png',
	iconSize: [30, 41],
	iconAnchor: [15, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
})

const selectedIcon = new Icon({
	iconUrl: '/selected-marker.png',
	shadowUrl: '/marker-shadow.png',
	iconSize: [30, 41],
	iconAnchor: [15, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
})

// Bukhara region coordinates
const BUKHARA_CENTER = [39.7747, 64.4286]
const BUKHARA_RADIUS = 100000 // 100km in meters

interface MapProps {
	center?: [number, number]
	onLocationSelect?: (location: { lat: number; lng: number }) => void
	userLocation?: { lat: number; lng: number; address?: string } | null
	selectedLocation?: { lat: number; lng: number; address?: string } | null
}

// Component to handle map clicks
function LocationMarker({
	onLocationSelect,
}: {
	onLocationSelect?: (location: { lat: number; lng: number }) => void
}) {
	useMapEvents({
		click(e) {
			if (onLocationSelect) {
				onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
			}
		},
	})

	return null
}

// Component to handle map centering on user location
function CenterMapOnUser({ position }: { position: [number, number] | null }) {
	const map = useMap()

	useEffect(() => {
		if (position) {
			map.flyTo(position, 15)
		}
	}, [map, position])

	return null
}

export default function Map({
	center = BUKHARA_CENTER as [number, number],
	onLocationSelect,
	userLocation,
	selectedLocation,
}: MapProps) {
	const mapRef = useRef<L.Map | null>(null)

	// Set map bounds to Bukhara region
	const bukharaBounds = L.latLngBounds(
		L.latLng(38.9, 63.0), // Southwest corner
		L.latLng(40.5, 65.5) // Northeast corner
	)

	return (
		<MapContainer
			center={center}
			zoom={9}
			style={{ height: '100%', width: '100%' }}
			ref={ref => {
				if (ref && !mapRef.current) {
					mapRef.current = ref
					ref.setMaxBounds(bukharaBounds)
				}
			}}
			maxBoundsViscosity={1.0}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>

			{/* Add a circle to show Bukhara region boundary */}
			<Circle
				center={BUKHARA_CENTER as [number, number]}
				radius={BUKHARA_RADIUS}
				pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
			/>

			<LocationMarker onLocationSelect={onLocationSelect} />

			{userLocation && (
				<>
					<Marker
						position={[userLocation.lat, userLocation.lng]}
						icon={userIcon}
					>
						<Popup>
							<div>
								<h3 className='font-bold'>Mening joylashuvim</h3>
								<p>Kenglik: {userLocation.lat.toFixed(6)}</p>
								<p>Uzunlik: {userLocation.lng.toFixed(6)}</p>
								{userLocation.address && (
									<p className='mt-1 text-sm'>{userLocation.address}</p>
								)}
							</div>
						</Popup>
					</Marker>
					<CenterMapOnUser
						position={
							userLocation ? [userLocation.lat, userLocation.lng] : null
						}
					/>
				</>
			)}

			{selectedLocation && (
				<Marker
					position={[selectedLocation.lat, selectedLocation.lng]}
					icon={selectedIcon}
				>
					<Popup>
						<div>
							<h3 className='font-bold'>Tanlangan joy</h3>
							<p>Kenglik: {selectedLocation.lat.toFixed(6)}</p>
							<p>Uzunlik: {selectedLocation.lng.toFixed(6)}</p>
							{selectedLocation.address && (
								<p className='mt-1 text-sm'>{selectedLocation.address}</p>
							)}
						</div>
					</Popup>
				</Marker>
			)}
		</MapContainer>
	)
}
