import React, { useEffect, useState } from 'react'
import { eventBus, SHOW_MSG } from '../services/event-bus.service'

export function UserMsg() {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        const unsubscribe = eventBus.on(SHOW_MSG, (msg) => {
            setMsg(msg)
            setTimeout(() => setMsg(null), 3000)
        })
        return unsubscribe
    }, [])

    if (!msg) return null

    return (
        <div className={`user-msg ${msg.type || 'info'}`}>
            {msg.txt}
        </div>
    )
}


