import React from 'react';
import { motion } from 'framer-motion';
import { SCENARIOS, useChatStore } from '../store/useChatStore';
import { cn } from '../../../lib/utils';
import { ChevronRight } from 'lucide-react';

export const ScenarioSelector: React.FC = () => {
  const { activeScenarioId, setScenario } = useChatStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide">
      {SCENARIOS.map((scenario) => {
        const isActive = activeScenarioId === scenario.id;
        
        return (
          <motion.button
            key={scenario.id}
            onClick={() => setScenario(scenario.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300",
              isActive 
                ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <span className="text-2xl">{scenario.icon}</span>
            <div className="text-left">
              <div className={cn(
                "text-sm font-bold",
                isActive ? "text-white" : "text-slate-300"
              )}>
                {scenario.name}
              </div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap">
                {scenario.description.split(' ')[0]}...
              </div>
            </div>
            {isActive && <ChevronRight className="w-3 h-3 text-indigo-400" />}
          </motion.button>
        );
      })}
    </div>
  );
};
