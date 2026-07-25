function BodyweightIcon({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6v7" />
            <path d="M12 8.5l-5.5 -3" />
            <path d="M12 8.5l5.5 -3" />
            <path d="M12 13l-4.5 7" />
            <path d="M12 13l4.5 7" />
        </svg>
    )
}

export default BodyweightIcon;