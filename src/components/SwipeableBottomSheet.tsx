import React, { useRef, useState, useEffect } from 'react';

interface SwipeableBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SwipeableBottomSheet: React.FC<SwipeableBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    // Only allow dragging downwards (positive translateY)
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 100) {
      // Swiped down sufficiently -> dismiss
      onClose();
    } else {
      // Snap back up
      setTranslateY(0);
    }
    setTouchStartY(null);
    setIsDragging(false);
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 pointer-events-none flex flex-col justify-end">
      {/* Top Half Backdrop: pointer-events-none so touches pass directly through to scroll the Scripture! */}
      <div className="flex-1 pointer-events-none" />

      {/* Lower Half Swipeable Sheet */}
      <div
        ref={sheetRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="pointer-events-auto w-full h-[52vh] max-h-[55vh] bg-slate-900 border-t-2 border-amber-500/40 rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* Swipe Handle Header */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full flex flex-col items-center justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing bg-slate-900 select-none border-b border-slate-800/60"
        >
          {/* Pill grab bar */}
          <div className="w-12 h-1.5 bg-slate-600 hover:bg-amber-400 rounded-full transition" />
          <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">
            Swipe down to dismiss
          </span>
        </div>

        {/* Sheet Content Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

