import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './lib/utils';
import { BookOpenText, Sparkles, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-teal-950 text-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div
        className={cn(
          "glass-card max-w-4xl w-full p-6 md:p-10 rounded-2xl border border-slate-700/50 shadow-lg backdrop-blur-lg",
          "flex flex-col items-center text-center space-y-6 md:space-y-8"
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Sparkles className="w-16 h-16 text-indigo-400" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-400 leading-tight"
          variants={itemVariants}
        >
          AI Destekli İngilizce Öğretmeniniz
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed"
          variants={itemVariants}
        >
          Kişiselleştirilmiş dersler, anında geri bildirim ve akıllı alıştırmalarla İngilizce öğrenme deneyiminizi bir üst seviyeye taşıyın.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mt-6">
          <motion.button
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpenText className="w-5 h-5" />
            Derslere Başla
          </motion.button>
          <motion.button
            className="bg-slate-700/40 hover:bg-slate-600/60 text-slate-200 font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center gap-2 border border-slate-600/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wand2 className="w-5 h-5" />
            Özellikleri Keşfet
          </motion.button>
        </motion.div>

        <motion.p
          className="text-sm text-slate-500 mt-8"
          variants={itemVariants}
        >
          Powered by Antigravity AI — Unleash your potential.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default App;
