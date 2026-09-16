import { Link } from "@tanstack/react-router"

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.99 3.24 9.22 7.73 10.72.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.15.68-3.81-1.36-3.81-1.36-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.09 1.16.9-.25 1.86-.37 2.81-.38.95.01 1.91.13 2.81.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.66.79.55 4.48-1.5 7.72-5.73 7.72-10.72C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-head text-xl font-bold tracking-tight hover:text-cream transition-colors duration-150">
          neo<span className="text-cream">studio</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-cream transition-colors duration-150 hidden sm:inline">Home</Link>
          <Link to="/tools" className="hover:text-cream transition-colors duration-150">Tools</Link>
          <a
            href="https://github.com/Leoo-B/neostudio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream transition-colors duration-150"
            aria-label="GitHub"
          >
            <GitHubMark className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-fg">
        <p>neostudio — gratis selamanya.</p>
        <div className="flex items-center gap-5">
          <Link to="/tools" className="hover:text-cream transition-colors duration-150">Tools</Link>
          <a
            href="https://github.com/Leoo-B/neostudio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream transition-colors duration-150"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
