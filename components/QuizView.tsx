import React, { useState, useMemo } from 'react';
import { Subject, MCQ } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface QuizViewProps {
  subject: Subject;
  questions: MCQ[];
  onFinish: (score: number, mistakes: MCQ[]) => void;
  onQuit: () => void;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const QuizView: React.FC<QuizViewProps> = ({ subject, questions, onFinish, onQuit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [incorrectAnswers, setIncorrectAnswers] = useState<MCQ[]>([]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  const handleOptionSelect = (optionIndex: number) => {
    if (answerState !== 'unanswered') return;

    setSelectedOption(optionIndex);
    if (optionIndex === currentQuestion.answer) {
      setAnswerState('correct');
      setScore((prev) => prev + 1);
    } else {
      setAnswerState('incorrect');
      setIncorrectAnswers(prev => [...prev, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerState('unanswered');
    } else {
      onFinish(score, incorrectAnswers);
    }
  };

  const handleQuit = () => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই কুইজ থেকে বের হতে চান? আপনার অগ্রগতি সংরক্ষিত হবে না।')) {
      onQuit();
    }
  };

  const getButtonClass = (optionIndex: number) => {
    const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-slate-700 dark:text-slate-200";
    if (answerState === 'unanswered') {
      return `${baseClass} bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-blue-900 hover:border-blue-400`;
    }
    if (optionIndex === currentQuestion.answer) {
      return `${baseClass} bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-400 font-semibold`;
    }
    if (optionIndex === selectedOption) {
      return `${baseClass} bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-400 font-semibold`;
    }
    return `${baseClass} bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 cursor-not-allowed opacity-60`;
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-slate-600 dark:text-slate-300">
          <button onClick={handleQuit} title="Quit Quiz" className="p-2 -ml-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
            <CloseIcon />
          </button>
          <p className="font-semibold text-lg">{subject.name}</p>
          <p>Score: <span className="font-bold text-blue-500 dark:text-blue-400">{score}</span></p>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-right text-sm mt-1 text-slate-500 dark:text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={getButtonClass(index)}
            disabled={answerState !== 'unanswered'}
          >
            <span className="flex items-center">
              <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
              <span dangerouslySetInnerHTML={{ __html: option }}></span>
              {answerState !== 'unanswered' && selectedOption === index && (
                <span className="ml-auto">
                  {answerState === 'correct' ? <CheckIcon /> : <XIcon />}
                </span>
              )}
               {answerState !== 'unanswered' && index === currentQuestion.answer && selectedOption !== index && (
                <span className="ml-auto">
                  <CheckIcon />
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {answerState !== 'unanswered' && (
        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
          <button
            onClick={handleQuit}
            className="w-full bg-slate-600 text-slate-100 font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
          >
            Quit
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;