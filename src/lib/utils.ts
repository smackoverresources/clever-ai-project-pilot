import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, formatRelative } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to string
export function formatDate(date: Date | string, formatStr: string = 'PPP') {
  return format(new Date(date), formatStr)
}

// Get relative time
export function getRelativeTime(date: Date | string) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

// Format file size
export function formatFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// Generate initials from name
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Truncate text with ellipsis
export function truncateText(text: string, length: number) {
  return text.length > length ? `${text.substring(0, length)}...` : text
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Sort array by key
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Filter array by search query
export function filterByQuery<T extends Record<string, any>>(
  array: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  const lowercaseQuery = query.toLowerCase()
  return array.filter((item) =>
    keys.some((key) => String(item[key]).toLowerCase().includes(lowercaseQuery))
  )
}

// Generate random ID
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 11)}`
}

// Parse query string
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

// Create query string from object
export function createQueryString(params: Record<string, string>): string {
  return new URLSearchParams(params).toString()
}
