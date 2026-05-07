import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { BookOpenText, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { Toaster } from 'sonner';

// PREMIUM UI: Fallback loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
  </div>
);

const App: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
      {/* PREMIUM UI: Mesh Gradient Arka Plan */}
      <div className="mesh-gradient" />
      
      <Toaster position="top-center" expand={false} richColors />

      <Suspense fallback={<LoadingFallback />}>
        <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            className={cn(
              "glass-card w-full max-w-4xl p-8 md:p-16 rounded-3xl",
              "flex flex-col items-center text-center space-y-8 md:space-y-12"
            )}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header Badge */}
            <motion.div 
              variants={itemVariants}
              className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Geleceğin İngilizce Öğrenme Deneyimi</span>
            </motion.div>

            {/* Title Section */}
            <div className="space-y-4 md:space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-[1.1] text-white"
                variants={itemVariants}
              >
                AI Destekli <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400">
                  Öğretmeninizle Tanışın
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Geleneksel yöntemleri unutun. Kişiselleştirilmiş müfredat ve 7/24 yanınızda olan akıllı asistanla akıcı İngilizce artık hayal değil.
              </motion.p>
            </div>

            {/* CTA Section */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <motion.button
                className="group relative bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all w-full sm:w-auto flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpenText className="w-5 h-5" />
                <span>Hemen Başla</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                className="bg-white/5 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="w-5 h-5 text-indigo-400" />
                <span>Özellikleri İncele</span>
              </motion.button>
            </motion.div>

            {/* Footer Stats/Info */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-white/5 w-full max-w-2xl"
            >
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-white">7/24</div>
                <div className="text-sm text-slate-500">Aktif Destek</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-white">%100</div>
                <div className="text-sm text-slate-500">Kişiselleştirme</div>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-2xl font-bold text-white">20k+</div>
                <div className="text-sm text-slate-500">Mutlu Öğrenci</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-xs text-slate-600 mt-12 tracking-widest uppercase font-medium"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Powered by Antigravity AI — Premium Digital Experience
          </motion.p>
        </main>
      </Suspense>
    </div>
  );
}

export default App;
