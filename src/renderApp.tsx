import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

export function renderApp(): Promise<void> {
    return new Promise(resolve => {
        function ReadyApp() {
            useEffect(() => { resolve() }, [])
            return <App />
        }
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <React.StrictMode><ReadyApp /></React.StrictMode>,
        )
    })
}
