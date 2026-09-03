import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import {BrowserRouter} from "react-router-dom";
import ThemeProvider from "./app/providers/theme/ThemeProvider.tsx";
import AuthProvider from "./app/providers/auth/AuthProvider.tsx";
import ErrorBoundary from "./app/providers/error/ErrorBoundary.tsx";
import './style/input.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <BrowserRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    </StrictMode>,
)
