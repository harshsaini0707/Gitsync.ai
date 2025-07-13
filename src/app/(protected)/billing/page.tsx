import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

const Billing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="animate-bounce text-emerald-500 mb-4">
        <CheckCircle2 size={60} />
      </div>

      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
        100% Free Beta Access
      </h1>

      <p className="text-gray-700 text-lg mt-2 max-w-md">
        🚀 Get <span className="font-semibold text-emerald-600">unlimited access</span> to all features at <span className="font-semibold text-emerald-600">zero cost</span>. 
        We’re in beta — everything’s unlocked for you!
      </p>

      <div className="flex gap-2 mt-6 animate-pulse text-yellow-400">
        <Sparkles size={28} />
        <Sparkles size={28} />
        <Sparkles size={28} />
      </div>
    </div>
  );
};

export default Billing;
