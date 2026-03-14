import { useOnboarding } from '@/contexts/OnboardingContext';
import { motion } from 'framer-motion';
import { Check, Circle, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function OnboardingChecklist() {
  const { steps, completedCount, totalSteps, progress, isOnboardingDone, startTour } = useOnboarding();
  const [expanded, setExpanded] = useState(true);

  if (isOnboardingDone) return null;

  return (
    <div className="mx-4 mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5">
            <svg viewBox="0 0 36 36" className="h-5 w-5 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray={`${progress * 0.97} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-foreground">{completedCount}/{totalSteps} Setup</span>
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 space-y-1"
        >
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                step.completed ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.completed ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground/30'
              }`}>
                {step.completed && <Check className="h-2.5 w-2.5" />}
              </div>
              <span className={step.completed ? 'line-through' : 'font-medium'}>{step.title}</span>
            </div>
          ))}
          <button
            onClick={startTour}
            className="flex items-center gap-1.5 px-3 py-1.5 mt-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Rocket className="h-3 w-3" /> Retake tour
          </button>
        </motion.div>
      )}
    </div>
  );
}
