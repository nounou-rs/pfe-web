import React from 'react';
import { Lightbulb, AlertCircle } from 'lucide-react'; // Si tu utilises lucide-react

const AIAnalysisCard = ({ title, analysis, recommendation, type }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="text-yellow-500" size={20} />
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 italic">
        "{analysis}"
      </p>
      
      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
        <p className="text-blue-800 text-xs font-semibold">Recommandation de l'IA :</p>
        <p className="text-blue-900 text-sm">{recommendation}</p>
      </div>
    </div>
  );
};

export default AIAnalysisCard;