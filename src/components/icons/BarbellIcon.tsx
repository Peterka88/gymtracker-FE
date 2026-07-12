function BarbellIcon({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 9v6" />
            <path d="M7 7v10" />
            <path d="M17 7v10" />
            <path d="M20 9v6" />
            <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
    )
}

export default BarbellIcon;
