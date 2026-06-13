import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'

const STORAGE_KEY = 'lexicon-theme'

const getInitialTheme = () => {
	const saved = window.localStorage.getItem(STORAGE_KEY)

	if (saved === 'dark' || saved === 'light') {
		return saved
	}

	// always start in light mode; dark is an explicit user choice
	return 'light'
}

const SunIcon = () => (
	<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
		<circle cx="12" cy="12" r="4.5" fill="currentColor" />
		<g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
			<path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
		</g>
	</svg>
)

const MoonIcon = () => (
	<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
		<path
			d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"
			fill="currentColor"
		/>
	</svg>
)

// Applies the stored Lexicon theme without rendering a button — for pages
// (like the Lexicon landing) that should follow the theme but host no toggle
export function LexiconThemeScope() {
	useEffect(() => {
		document.documentElement.setAttribute(
			'data-lexicon-theme',
			getInitialTheme(),
		)

		return () => {
			document.documentElement.removeAttribute('data-lexicon-theme')
		}
	}, [])

	return null
}

export default function LexiconThemeToggle() {
	const [theme, setTheme] = useState(null)

	useEffect(() => {
		const initial = getInitialTheme()
		setTheme(initial)
		document.documentElement.setAttribute('data-lexicon-theme', initial)

		// don't leak the Lexicon theme (scrollbars, tokens) into other sections
		return () => {
			document.documentElement.removeAttribute('data-lexicon-theme')
		}
	}, [])

	const toggle = () => {
		const next = theme === 'dark' ? 'light' : 'dark'
		setTheme(next)
		document.documentElement.setAttribute('data-lexicon-theme', next)
		window.localStorage.setItem(STORAGE_KEY, next)
	}

	// avoid a wrong-icon flash before hydration resolves the stored theme
	if (theme === null) {
		return <button className={styles.toggle} aria-hidden="true" />
	}

	return (
		<button
			className={styles.toggle}
			onClick={toggle}
			aria-label={
				theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
			}
			title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
		>
			{theme === 'dark' ? <SunIcon /> : <MoonIcon />}
		</button>
	)
}
