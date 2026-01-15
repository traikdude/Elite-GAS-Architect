import React, { useState } from 'react';
import { TROUBLESHOOTING_STEPS } from '../constants';
import { Stethoscope, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

const Troubleshooter: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);

  const currentStep = TROUBLESHOOTING_STEPS.find(s => s.id === currentStepId);

  const handleOptionClick = (nextId: string) => {
    setHistory([...history, currentStepId]);
    setCurrentStepId(nextId);
  };

  const reset = () => {
    setCurrentStepId('start');
    setHistory([]);
  };

  if (!currentStep) return <div>Error: Step not found</div>;

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center max-w-3xl mx-auto">
      <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
          <Stethoscope className="text-amber-400 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-100">Diagnostic Protocol</h2>
        </div>

        {currentStep.solution ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl mb-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-emerald-400 w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Recommended Solution</h3>
                  <p className="text-slate-200 leading-relaxed text-lg">{currentStep.solution}</p>
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors mx-auto font-medium"
            >
              <RotateCcw size={18} />
              Run New Diagnostic
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl text-slate-200 mb-8 text-center font-medium">
              {currentStep.question}
            </h3>
            
            <div className="grid gap-3">
              {currentStep.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.next)}
                  className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all duration-200 text-left"
                >
                  <span className="text-slate-300 group-hover:text-white">{option.label}</span>
                  <ArrowRight className="text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  const prev = history[history.length - 1];
                  setHistory(history.slice(0, -1));
                  setCurrentStepId(prev);
                }}
                className="mt-8 text-slate-500 hover:text-slate-400 text-sm flex items-center gap-1 mx-auto"
              >
                Back to previous step
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Troubleshooter;
