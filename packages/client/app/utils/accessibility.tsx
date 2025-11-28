import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Hook to trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(
   isActive: boolean
): RefObject<HTMLDivElement | null> {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!isActive) return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element when trap activates
      firstElement?.focus();

      const handleTabKey = (e: KeyboardEvent) => {
         if (e.key !== 'Tab') return;

         if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
               e.preventDefault();
               lastElement?.focus();
            }
         } else {
            // Tab
            if (document.activeElement === lastElement) {
               e.preventDefault();
               firstElement?.focus();
            }
         }
      };

      container.addEventListener('keydown', handleTabKey);

      return () => {
         container.removeEventListener('keydown', handleTabKey);
      };
   }, [isActive]);

   return containerRef;
}

/**
 * Hook to return focus to the previously focused element
 */
export function useReturnFocus(isActive: boolean) {
   const previouslyFocusedElement = useRef<HTMLElement | null>(null);

   useEffect(() => {
      if (isActive) {
         previouslyFocusedElement.current =
            document.activeElement as HTMLElement;
      } else if (previouslyFocusedElement.current) {
         previouslyFocusedElement.current.focus();
         previouslyFocusedElement.current = null;
      }
   }, [isActive]);
}

/**
 * Hook to focus an element when a condition is met
 */
export function useAutoFocus<T extends HTMLElement>(
   shouldFocus: boolean,
   delay: number = 0
): RefObject<T | null> {
   const elementRef = useRef<T>(null);

   useEffect(() => {
      if (shouldFocus && elementRef.current) {
         if (delay > 0) {
            const timeoutId = setTimeout(() => {
               elementRef.current?.focus();
            }, delay);
            return () => clearTimeout(timeoutId);
         } else {
            elementRef.current.focus();
         }
      }
   }, [shouldFocus, delay]);

   return elementRef;
}

/**
 * Skip Links Component - for keyboard navigation
 */
export function SkipLinks() {
   return (
      <div className="sr-only focus-within:not-sr-only">
         <a
            href="#main-content"
            className="fixed top-4 left-4 z-50 bg-primary text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
         >
            Skip to main content
         </a>
         <a
            href="#navigation"
            className="fixed top-4 left-32 z-50 bg-primary text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
         >
            Skip to navigation
         </a>
      </div>
   );
}

/**
 * Focus visible utility - adds visible focus indicators
 */
export const focusClasses =
   'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark';

/**
 * Keyboard navigation handler
 */
export function useKeyboardNavigation<T>(
   items: T[],
   onSelect: (index: number) => void,
   isActive: boolean = true
) {
   const [selectedIndex, setSelectedIndex] = useState(0);

   useEffect(() => {
      if (!isActive) return;

      const handleKeyboard = (e: KeyboardEvent) => {
         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault();
               setSelectedIndex((prev: number) => {
                  const next = Math.min(prev + 1, items.length - 1);
                  onSelect(next);
                  return next;
               });
               break;
            case 'ArrowUp':
               e.preventDefault();
               setSelectedIndex((prev: number) => {
                  const next = Math.max(prev - 1, 0);
                  onSelect(next);
                  return next;
               });
               break;
            case 'Home':
               e.preventDefault();
               setSelectedIndex(0);
               onSelect(0);
               break;
            case 'End':
               e.preventDefault();
               setSelectedIndex(items.length - 1);
               onSelect(items.length - 1);
               break;
         }
      };

      window.addEventListener('keydown', handleKeyboard);
      return () => window.removeEventListener('keydown', handleKeyboard);
   }, [items.length, onSelect, isActive]);

   return selectedIndex;
}
