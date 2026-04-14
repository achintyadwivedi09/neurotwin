"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ isOpen, title, message, onClose, onConfirm }: { isOpen: boolean, title: string, message: string, onClose: () => void, onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3142]/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--color-card-bg)] w-full max-w-[400px] rounded-[var(--radius-xl)] p-6 shadow-xl text-center"
          >
            <div className="mx-auto w-12 h-12 bg-amber-100 text-[var(--color-warning-soft)] rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm leading-relaxed">{message}</p>
            <div className="flex justify-center gap-3">
              <button onClick={onClose} className="px-6 py-2 text-sm font-medium border border-[var(--color-border)] rounded-[var(--radius-md)] transition hover:bg-gray-50">Cancel</button>
              <button 
                onClick={onConfirm}
                className="px-6 py-2 text-sm font-medium bg-[var(--color-warning-soft)] text-white rounded-[var(--radius-md)] transition hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
