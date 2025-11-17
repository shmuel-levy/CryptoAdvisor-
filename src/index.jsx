import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from './store/store'
import { AuthProvider } from './contexts/AuthContext'
import { RootCmp } from './RootCmp'

import './assets/styles/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<AuthProvider>
			<Router
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true
				}}
			>
				<RootCmp />
			</Router>
		</AuthProvider>
	</Provider>
)
