import { cn } from "../../lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-primary border-r-transparent",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Yuklanyapti...</span>
    </div>
  )
}

export function SpinnerOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <Spinner size="lg" />
    </div>
  )
}
