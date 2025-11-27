import { motion } from 'framer-motion';
import { spinozaPortraitDataUrl } from '../three/spinozaPortrait';

const SpinozaMark = () => {
  return (
    <motion.div
      className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-50/80 shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <img src={spinozaPortraitDataUrl} alt="Portrait of Spinoza" className="h-full w-full object-cover" />
    </motion.div>
  );
};

export default SpinozaMark;
