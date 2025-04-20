import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes user input to prevent XSS attacks
 * This is a basic implementation - in production, consider using a library like DOMPurify
 */
export function sanitizeInput(input: string): string {
  // Basic sanitization - escape HTML special characters
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Counts the number of words in a string
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
