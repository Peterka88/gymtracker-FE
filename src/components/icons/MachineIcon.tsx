function MachineIcon({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="3.3" r="1.6" />
            <path d="M12 5v3" />
            <rect x="7" y="8" width="10" height="12.5" rx="1.8" />
            <line x1="7" y1="12.5" x2="17" y2="12.5" />
            <line x1="7" y1="16.7" x2="17" y2="16.7" />
        </svg>
    )
}

export default MachineIcon;