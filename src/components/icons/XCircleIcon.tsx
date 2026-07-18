function XCircleIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5l5 5" />
            <path d="M14.5 9.5l-5 5" />
        </svg>
    )
}

export default XCircleIcon;