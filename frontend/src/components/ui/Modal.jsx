import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative bg-white dark:bg-gray-900 w-full sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] border border-transparent dark:border-gray-800 ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          {title && <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>}
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5 ml-auto">
            <X size={16} />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
