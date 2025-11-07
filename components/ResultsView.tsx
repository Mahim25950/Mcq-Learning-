import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onExit: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, onRestart, onExit }) => {
  const incorrectAnswers = totalQuestions - score;
  const percentage = Math.round((score / totalQuestions) * 100);

  const data = [
    { name: 'Correct', value: score },
    { name: 'Incorrect', value: incorrectAnswers },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a master!";
    if (percentage >= 80) return "Excellent work! You really know your stuff.";
    if (percentage >= 60) return "Good job! A little more practice and you'll be an expert.";
    if (percentage >= 40) return "Not bad! Keep studying and you'll improve.";
    return "Keep trying! Practice makes perfect.";
  };

  return (
    <div className="flex flex-col items-center text-center bg-slate-800 h-full justify-center">
      <h2 className="text-3xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
      <p className="text-lg text-slate-300 mb-6">{getFeedbackMessage()}</p>

      <div className="w-full h-48 sm:h-64 mb-6">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ color: '#94a3b8' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-2xl font-bold mb-8">
        <span className="text-slate-100">Your Score: </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">{percentage}%</span>
        <p className="text-base font-normal text-slate-400 mt-1">({score} out of {totalQuestions} correct)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
         <button
            onClick={onRestart}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Play Again
          </button>
        <button
          onClick={onExit}
          className="w-full bg-slate-600 text-slate-100 font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
