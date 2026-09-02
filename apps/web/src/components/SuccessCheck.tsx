export function SuccessCheck({ show }: { show: boolean }) {
  return (
    <span className="t-success-check" data-state={show ? "in" : "out"} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <circle cx="24" cy="24" r="20" stroke="#F5DEB3" strokeWidth="3" />
        <path
          d="M14 25 L21 32 L34 18"
          stroke="#F5DEB3"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
