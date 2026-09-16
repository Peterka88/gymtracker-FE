function BuildingIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="1" />
            <path d="M9 21v-4h6v4" />
            <path d="M8 7h1M8 11h1M8 15h1" />
            <path d="M15 7h1M15 11h1M15 15h1" />
        </svg>
    )
}

export default BuildingIcon;
