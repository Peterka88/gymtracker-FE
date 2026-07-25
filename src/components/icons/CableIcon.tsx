function CableIcon({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4.5" r="2.5" />
            <path d="M12 7v9" strokeDasharray="1.5 2.2" />
            <path d="M8.5 20a3.5 3.5 0 0 0 7 0" />
        </svg>
    )
}

export default CableIcon;