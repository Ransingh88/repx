import { twMerge } from 'tailwind-merge'

/** Centered content wrapper with consistent max-width and padding */
const PageLayout = ({ children, className = '' }) => (
  <div className={twMerge('max-w-5xl mx-auto px-6 py-8', className)}>
    {children}
  </div>
)

export default PageLayout
