import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Package, Rocket, ArrowRight, Check, Circle, Sparkles } from 'lucide-react';

export function WelcomeModal() {
  const { showWelcome, dismissWelcome, steps, completedCount, totalSteps, progress, startTour } = useOnboarding();

  if (!showWelcome) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) dismissWelcome(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="absolute top-4 right-4">
              <Sparkles className="h-5 w-5 text-primary/40 animate-pulse" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Welcome to BulkDrink!</h2>
                <p className="text-sm text-muted-foreground">Let's get your store up and running</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Setup Progress</span>
                <span className="text-primary font-bold">{completedCount}/{totalSteps}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="px-8 py-5 space-y-2.5">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  step.completed ? 'bg-primary/5' : 'bg-muted/30'
                }`}
              >
                <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  step.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-muted-foreground/30'
                }`}>
                  {step.completed ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2 text-transparent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={startTour}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              <Rocket className="h-4 w-4" /> Take a Quick Tour
            </button>
            <button
              onClick={dismissWelcome}
              className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-semibold text-sm hover:bg-muted/50 active:scale-[0.98] transition-all"
            >
              I'll Explore Myself
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
