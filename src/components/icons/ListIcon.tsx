function ListIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
            <path d="M9 6h11" />
            <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
            <path d="M9 12h11" />
            <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
            <path d="M9 18h11" />
        </svg>
    )
}

export default ListIcon;