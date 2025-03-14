import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    // Today, show time
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInDays === 1) {
    // Yesterday
    return "Yesterday"
  } else if (diffInDays < 7) {
    // Within a week, show day name
    return date.toLocaleDateString([], { weekday: "short" })
  } else {
    // More than a week, show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

