function DumbbellIcon({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="4" height="8" rx="1.5" />
            <rect x="17" y="8" width="4" height="8" rx="1.5" />
            <line x1="7" y1="12" x2="17" y2="12" strokeWidth="3" />
        </svg>
    )
}

export default DumbbellIcon;
