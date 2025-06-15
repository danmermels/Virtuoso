// This component renders a floating button with a plus icon that can be used to add tasks.
// The button is styled to be fixed at the bottom right corner of the screen, with a shadow and hover effect.       

import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary/90 transition-all duration-300 animate-bounce"
      aria-label="Add Task"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
