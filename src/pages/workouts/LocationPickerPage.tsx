import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";
import {workoutApi} from "../../api/workoutApi.ts";
import type {Location} from "../../types/workout.ts";
import {useToast} from "../../context/ToastContext.tsx";
import BuildingIcon from "../../components/icons/BuildingIcon.tsx";
import LocationIcon from "../../components/icons/LocationIcon.tsx";

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    )
}

function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    )
}

function LocateIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M22 12h-3M5 12H2" />
        </svg>
    )
}

const mapContainerStyle = {width: "100%", height: "100%"}
const mapLibraries: ("marker")[] = ["marker"]

function LocationPickerPage() {
    const { id } = useParams<{id: string}>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { showError, showSuccess } = useToast()

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: mapLibraries,
    })

    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
    const currentLocationMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)

    const defaultCenter = { lat: 48.1486, lng: 17.1077 } // Bratislava

    const latValue = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined
    const lngValue = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined
    const urlPosition = latValue !== undefined && lngValue !== undefined ? { lat: latValue, lng: lngValue } : null

    const [darkMap, setDarkMap] = useState(false)
    const [center, setCenter] = useState(urlPosition ?? defaultCenter)
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(urlPosition)
    const [locationName, setLocationName] = useState(searchParams.get("name") || "")
    const [address, setAddress] = useState<string | null>(null)
    const [geocoding, setGeocoding] = useState(false)
    const [saving, setSaving] = useState(false)
    const [locating, setLocating] = useState(false)

    const reverseGeocode = useCallback((lat: number, lng: number) => {
        setGeocoding(true)
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setGeocoding(false)
            if (status === "OK" && results?.[0]) {
                setAddress(results[0].formatted_address)
            } else {
                setAddress(null)
            }
        })
    }, [])

    useEffect(() => {
        if (!isLoaded) return
        if (position) {
            reverseGeocode(position.lat, position.lng)
        }
    }, [isLoaded])

    useEffect(() => {
        return () => {
            if (markerRef.current) {
                markerRef.current.map = null
                markerRef.current = null
            }
            if (currentLocationMarkerRef.current) {
                currentLocationMarkerRef.current.map = null
                currentLocationMarkerRef.current = null
            }
        }
    }, [mapInstance])

    useEffect(() => {
        if (!mapInstance || !position || markerRef.current) return
        let cancelled = false

        google.maps.importLibrary("marker").then((lib) => {
            if (cancelled) return
            const { AdvancedMarkerElement, PinElement } = lib as google.maps.MarkerLibrary

            const pin = new PinElement({
                background: "#22c55e",
                borderColor: "#0a0a0b",
                glyphColor: "#0a0a0b",
            })

            markerRef.current = new AdvancedMarkerElement({
                map: mapInstance,
                position,
                content: pin,
            })
        })

        return () => {
            cancelled = true
        }
    }, [mapInstance, position])

    useEffect(() => {
        const marker = markerRef.current
        if (!marker || !position) return
        marker.position = position

        const content = marker.children[0] as HTMLElement | null
        if (content) {
            content.classList.remove("marker-drop")
            void content.offsetWidth
            content.classList.add("marker-drop")
        }
    }, [position])

    function createCurrentLocationDot(): HTMLElement {
        const wrapper = document.createElement("div")
        wrapper.className = "current-location-wrapper"
        const pulse = document.createElement("div")
        pulse.className = "current-location-pulse"
        const dot = document.createElement("div")
        dot.className = "current-location-dot"
        wrapper.appendChild(pulse)
        wrapper.appendChild(dot)
        return wrapper
    }

    function handleLocateMe() {
        if (!navigator.geolocation) {
            showError("Geolokácia nie je v tomto prehliadači podporovaná")
            return
        }
        if (!mapInstance) return

        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setLocating(false)
                mapInstance.panTo(coords)

                if (currentLocationMarkerRef.current) {
                    currentLocationMarkerRef.current.position = coords
                    return
                }

                google.maps.importLibrary("marker").then((lib) => {
                    const { AdvancedMarkerElement } = lib as google.maps.MarkerLibrary
                    currentLocationMarkerRef.current = new AdvancedMarkerElement({
                        map: mapInstance,
                        position: coords,
                        content: createCurrentLocationDot(),
                        zIndex: 0,
                    })
                })
            },
            () => {
                showError("Nepodarilo sa zistiť polohu")
                setLocating(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    useEffect(() => {
        if (urlPosition) return
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => {},
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [])

    function onMapDblClick(event: google.maps.MapMouseEvent) {
        const lat = event.latLng?.lat()
        const lng = event.latLng?.lng()
        if (lat === undefined || lng === undefined) return
        mapInstance?.panTo({ lat, lng })
        setPosition({ lat, lng })
        reverseGeocode(lat, lng)
    }

    function confirmLocation() {
        if (!id || !address || !position) return
        const location: Location = {
            locationName: locationName || address.split(",")[0],
            address,
            latitude: position.lat,
            longitude: position.lng,
        }
        setSaving(true)
        workoutApi.updateLocation(Number(id), location)
            .then(() => {
                showSuccess("Lokácia uložená")
                navigate(-1)
            })
            .catch(() => showError("Lokáciu sa nepodarilo uložiť"))
            .finally(() => setSaving(false))
    }

    return (
        <div className="relative flex flex-col h-screen">
            <div className="flex items-center justify-between px-5 pt-1.5 pb-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-[38px] h-[38px] rounded-full bg-btn border border-white/8 flex items-center justify-center text-text-primary text-xl leading-none cursor-pointer"
                >
                    ‹
                </button>
                <div className="text-[16px] font-extrabold">Vybrať lokáciu</div>
                <div className="w-[38px] h-[38px]" />
            </div>

            <div className="flex-1 relative">
                { isLoaded ? (
                    <GoogleMap
                        key={darkMap ? "dark" : "light"}
                        mapContainerStyle={mapContainerStyle}
                        center={position ?? center}
                        zoom={15}
                        onDblClick={onMapDblClick}
                        onLoad={(map) => {setMapInstance(map)}}
                        onUnmount={() => setMapInstance(null)}
                        options={{
                            mapId: "9dead634feb1b8754067ee55",
                            colorScheme: darkMap ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT,
                            streetViewControl: false,
                            fullscreenControl: false,
                            mapTypeControlOptions: {
                                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                            },
                            cameraControlOptions: {
                                position: google.maps.ControlPosition.RIGHT_CENTER,
                            },
                            disableDoubleClickZoom: false,
                    }}
                    />
                ) : (
                    <div className="flex-1 h-full flex items-center justify-center text-text-muted text-[13px]">
                        Načítavam mapu...
                    </div>
                )}

                <button
                    onClick={() => setDarkMap((current) => !current)}
                    className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full ${darkMap ? 'bg-white/90 text-bg' : 'bg-card/90 text-text-primary'} backdrop-blur-xl border border-white/10 flex items-center justify-center  cursor-pointer`}
                >
                    { darkMap ? <SunIcon /> : <MoonIcon /> }
                </button>

                <button
                    onClick={handleLocateMe}
                    disabled={locating}
                    className={`absolute top-16 right-4 z-10 w-9 h-9 rounded-full ${darkMap ? 'bg-white/90 text-bg' : 'bg-card/90 text-text-primary'} backdrop-blur-xl border border-white/10 flex items-center justify-center cursor-pointer disabled:opacity-50`}
                >
                    <span className={locating ? "animate-spin" : ""}>
                        <LocateIcon />
                    </span>
                </button>

                <div className="absolute inset-x-4 bottom-4 z-10 bg-card/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]">
                    <div className="flex items-center gap-2.5 bg-chip border border-white/8 rounded-2xl px-4 py-3 mb-3 transition-colors focus-within:border-accent/40">
                        <span className="text-text-faint">
                            <BuildingIcon size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Napr. Fitshaker Gym"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-[14px] text-text-primary placeholder:text-text-faint"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 mb-4 px-1">
                        <span className="text-accent ml-3">
                            <LocationIcon size={16} />
                        </span>
                        <div className="text-[13px] text-text-secondary leading-snug line-clamp-2">
                            { geocoding ? "Načítavam adresu..." : (address ?? "Adresa sa nenašla") }
                        </div>
                    </div>

                    <button
                        onClick={confirmLocation}
                        disabled={!address || saving}
                        className="w-full bg-accent text-on-accent rounded-2xl py-3.5 text-[14.5px] font-extrabold transition-all duration-150 hover:brightness-110 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        { saving ? "Ukladám..." : "Potvrdiť lokáciu" }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LocationPickerPage
