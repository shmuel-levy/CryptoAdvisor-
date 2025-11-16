import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { LoginSignup } from './pages/LoginSignup.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Onboarding } from './pages/Onboarding.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'

export function RootCmp() {
    return (
        <>
            <UserMsg />
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </>
    )
}


