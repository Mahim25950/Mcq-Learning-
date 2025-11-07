import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { getMCQs } from '../services/firebase';

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject, count: number) => void;
  error: string | null;
  onExit: () => void;
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const MiniSpinner: React.FC = () => (
    <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const SubjectSelector: React.FC<SubjectSelectorProps> = ({ subjects, onSelectSubject, error, onExit }) => {
  const [modalSubject, setModalSubject] = useState<Subject | null>(null);
  const [questionCounts, setQuestionCounts] = useState<Record<string, number | 'loading'>>({});
  const [numQuestions, setNumQuestions] = useState<number>(10);
  
  useEffect(() => {
    const fetchCounts = async () => {
      const initialCounts: Record<string, 'loading'> = {};
      subjects.forEach(s => { initialCounts[s.id] = 'loading'; });
      setQuestionCounts(initialCounts);

      const countsPromises = subjects.map(async (subject) => {
        try {
          const mcqs = await getMCQs(subject.id);
          return { id: subject.id, count: mcqs?.length || 0 };
        } catch (e) {
          console.error(`Failed to get count for ${subject.name}`, e);
          return { id: subject.id, count: 0 };
        }
      });
      
      const resolvedCounts = await Promise.all(countsPromises);
      const finalCounts: Record<string, number> = {};
      resolvedCounts.forEach(item => { finalCounts[item.id] = item.count; });
      setQuestionCounts(finalCounts);
    };

    fetchCounts();
  }, [subjects]);

  const handleOpenModal = (subject: Subject) => {
    const available = questionCounts[subject.id];
    if (typeof available !== 'number') return;

    const max = available > 0 ? available : 10;
    const defaultNum = Math.min(10, max);
    
    setNumQuestions(defaultNum >= 5 ? defaultNum : 5);
    setModalSubject(subject);
  };

  const handleStartQuiz = () => {
    if (modalSubject) {
      onSelectSubject(modalSubject, numQuestions);
      setModalSubject(null);
    }
  };

  const renderModal = () => {
    if (!modalSubject) return null;

    const availableCount = questionCounts[modalSubject.id];
    const maxQuestions = (typeof availableCount === 'number' && availableCount > 0) ? availableCount : 10;
    const isGenerated = typeof availableCount === 'number' && availableCount === 0;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModalSubject(null)}>
        <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-slate-100 text-center mb-2">Practice {modalSubject.name}</h3>
          <p className="text-sm text-slate-400 text-center mb-6">
            {isGenerated 
                ? `We'll generate 10 fresh questions for you.`
                : `Available questions: ${availableCount}`
            }
          </p>
          
          <div className="mb-6">
            <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-300 mb-2">
              Number of Questions: <span className="font-bold text-white">{numQuestions}</span>
            </label>
            <input
              id="numQuestions"
              type="range"
              min="5"
              max={maxQuestions}
              step="5"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5</span>
                <span>{maxQuestions}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
             <button
              onClick={handleStartQuiz}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </button>
            <button
              onClick={() => setModalSubject(null)}
              className="w-full bg-slate-600 text-slate-100 font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-slate-800 h-full">
      {renderModal()}
      <div className="w-full flex justify-between items-center mb-6 relative">
          <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-700 transition-colors absolute left-0">
              <BackArrowIcon />
          </button>
          <h2 className="text-xl font-bold text-center text-slate-100 flex-grow">
            Choose a Subject
          </h2>
      </div>

      {error && (
        <div
          className="bg-amber-900/30 border-l-4 border-amber-500 text-amber-200 p-4 mb-6 w-full rounded-md text-sm"
          role="alert"
        >
          <div dangerouslySetInnerHTML={{ __html: error }} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {subjects.map((subject) => {
          const count = questionCounts[subject.id];
          return (
            <button
              key={subject.id}
              onClick={() => handleOpenModal(subject)}
              className="group relative flex flex-col items-center justify-center p-6 bg-slate-700 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:bg-blue-600 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="absolute top-2 right-2 bg-slate-800/50 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-300 flex items-center space-x-1">
                  {count === 'loading' ? <MiniSpinner /> : <span>{count || 'AI ✨'}</span>}
              </div>

              <span className="text-4xl mb-3">{subject.emoji}</span>
              <span className="font-semibold text-slate-200 group-hover:text-white">
                {subject.name}
              </span>
              <span className="text-xs text-slate-400 group-hover:text-blue-100 mt-1">
                {count === 0 ? "Generate with AI" : `Practice now`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;