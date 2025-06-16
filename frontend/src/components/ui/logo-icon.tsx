// Simple SVG target icon for logo
import * as React from "react";

export function LogoIcon({ className = "w-8 h-8 text-blue-900" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" fill="white" />
      <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="white" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}
