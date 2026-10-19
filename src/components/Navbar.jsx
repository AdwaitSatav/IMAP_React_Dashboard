import { NavLink } from 'react-router-dom'
import useTheme from '../hooks/useTheme.js'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.logo}>☀</span> GoOut Score
        </NavLink>
        <nav className={styles.links}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              {link.label}
            </NavLink>
          ))}
          {/* Part 4: dark mode toggle */}
          <button type="button" className={styles.theme} onClick={toggleTheme} aria-pressed={dark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
