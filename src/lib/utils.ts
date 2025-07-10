import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to prevent browser locking issues with overlays
export function preventOverlayLock() {
  // Remove any stuck overlays
  const overlays = document.querySelectorAll('[data-radix-overlay]');
  overlays.forEach(overlay => {
    if (overlay instanceof HTMLElement) {
      overlay.style.pointerEvents = 'auto';
    }
  });
  
  // Ensure body is not locked
  document.body.style.overflow = '';
  document.body.style.pointerEvents = 'auto';
}

// Utility to safely handle dropdown interactions
export function safeDropdownInteraction(callback: () => void) {
  try {
    // Prevent any existing overlays from interfering
    preventOverlayLock();
    
    // Execute the callback
    callback();
  } catch (error) {
    console.error('Dropdown interaction error:', error);
    // Fallback cleanup
    preventOverlayLock();
  }
}
