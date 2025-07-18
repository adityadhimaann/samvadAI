import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  targetRect?: DOMRect | null;
  onClose?: () => void;
  alignment?: 'left' | 'right' | 'auto';
}

export function DropdownPortal({ 
  children, 
  isOpen, 
  targetRect,
  onClose,
  alignment = 'auto'
}: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const calculatePosition = useCallback(() => {
    if (!targetRect || !mounted) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    
    // Determine if this is a right-side element (like user menu)
    // or left-side element (like logo dropdown)
    let isRightSide = alignment === 'right';
    
    if (alignment === 'auto') {
      // Auto-detect based on position in viewport
      isRightSide = targetRect.right > viewportWidth / 2;
    }
    
    let left;
    if (isRightSide) {
      // For right-aligned elements, align the dropdown right edge with the button right edge
      left = targetRect.right - dropdownWidth;
    } else {
      // For left-aligned elements, align the dropdown left edge with the button left edge
      left = targetRect.left;
    }
    
    // Ensure the dropdown doesn't go off screen
    if (left < 8) {
      left = 8; // 8px margin from left edge
    } else if (left + dropdownWidth > viewportWidth - 8) {
      left = viewportWidth - dropdownWidth - 8;
    }
    
    // Calculate top position
    let top = targetRect.bottom + window.scrollY;
    
    // Ensure the dropdown doesn't go below viewport (with 40px buffer)
    const dropdownHeight = dropdownRef.current?.offsetHeight || 200;
    if (top + dropdownHeight > viewportHeight - 40) {
      // Show above the button if not enough space below
      top = targetRect.top - dropdownHeight + window.scrollY;
      
      // If showing above would go off the top, show below anyway
      if (top < window.scrollY + 8) {
        top = targetRect.bottom + window.scrollY;
      }
    }
    
    setPosition({
      top,
      left
    });
  }, [targetRect, mounted, alignment]);
  
  useEffect(() => {
    setMounted(true);
    
    // Add click outside handler
    const handleOutsideClick = (e: MouseEvent) => {
      if (onClose && isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      
      // Calculate position when dropdown opens
      calculatePosition();
      
      // Also calculate position on resize
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isOpen, onClose, calculatePosition]);
  
  // Update position when target rect changes
  useEffect(() => {
    calculatePosition();
  }, [targetRect, calculatePosition]);
  
  // Client-side only
  if (!mounted || !isOpen) return null;
  
  // Create portal for the dropdown
  return createPortal(
    <div 
      ref={dropdownRef}
      className="dropdown-portal"
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: position.top,
        left: position.left,
        maxWidth: 'calc(100vw - 16px)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}
