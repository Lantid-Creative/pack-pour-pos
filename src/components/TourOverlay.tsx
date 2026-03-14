import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TooltipPosition {
  top: number;
  left: number;
  highlightTop: number;
  highlightLeft: number;
  highlightWidth: number;
  highlightHeight: number;
}

export function TourOverlay() {
  const { tourActive, tourStep, tourSteps, nextTourStep, prevTourStep, endTour } = useOnboarding();
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const currentStep = tourSteps[tourStep];

  useEffect(() => {
    if (!tourActive || !currentStep) return;

    const calculatePosition = () => {
      const el = document.getElementById(currentStep.targetId);
      if (!el) {
        setPosition(null);
        return;
      }

      const rect = el.getBoundingClientRect();
      const padding = 6;

      const highlight = {
        highlightTop: rect.top - padding,
        highlightLeft: rect.left - padding,
        highlightWidth: rect.width + padding * 2,
        highlightHeight: rect.height + padding * 2,
      };

      let top = 0;
      let left = 0;
      const tooltipWidth = 300;
      const tooltipHeight = 140;

      switch (currentStep.position) {
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + 16;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - 16;
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'top':
          top = rect.top - tooltipHeight - 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
      }

      // Clamp within viewport
      top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));

      setPosition({ top, left, ...highlight });
    };

    calculatePosition();

    // Recalculate on resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [tourActive, tourStep, currentStep]);

  if (!tourActive || !currentStep) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200]">
        {/* Dark overlay with hole */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {position && (
                <rect
                  x={position.highlightLeft}
                  y={position.highlightTop}
                  width={position.highlightWidth}
                  height={position.highlightHeight}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#tour-mask)"
            onClick={endTour}
          />
        </svg>

        {/* Highlight border */}
        {position && (
          <motion.div
            key={`highlight-${tourStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute rounded-lg border-2 border-primary shadow-lg shadow-primary/20 pointer-events-none"
            style={{
              top: position.highlightTop,
              left: position.highlightLeft,
              width: position.highlightWidth,
              height: position.highlightHeight,
            }}
          />
        )}

        {/* Tooltip card */}
        {position && (
          <motion.div
            key={`tooltip-${tourStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute w-[300px] bg-card border border-border rounded-xl shadow-2xl p-5 z-[201]"
            style={{ top: position.top, left: position.left }}
          >
            {/* Close button */}
            <button
              onClick={endTour}
              className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-3">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === tourStep ? 'w-6 bg-primary' : i < tourStep ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-sm font-bold text-foreground mb-1">{currentStep.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{currentStep.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevTourStep}
                disabled={tourStep === 0}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                onClick={nextTourStep}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-[0.97] transition-all"
              >
                {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
