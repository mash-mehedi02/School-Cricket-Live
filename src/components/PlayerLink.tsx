import React from 'react'
import { Link } from 'react-router-dom'

interface PlayerLinkProps {
    playerId: string
    playerName: string
    className?: string
    title?: string
    children?: React.ReactNode
}

export default function PlayerLink({ playerId, playerName, className = '', title, children }: PlayerLinkProps) {
    if (!playerId) {
        return <span className={className} title={title}>{children || playerName}</span>
    }

    return (
        <Link
            to={`/players/${playerId}`}
            className={`hover:text-blue-600 hover:underline transition-colors cursor-pointer ${className}`}
            onClick={(e) => e.stopPropagation()}
            title={title}
        >
            {children || playerName}
        </Link>
    )
}
