import React, { useState, useMemo } from 'react';
import { VocabularyWord } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import Spinner from './Spinner';

interface VocabularyViewProps {
  onExit: () => void;
  onAddXP: (xp: number) => void;
}

// --- Icons ---
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);
const MCQUIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const FlashcardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2" /></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

type PracticeMode = 'mcq' | 'flashcard' | 'table';
type AnswerState = 'unanswered' | 'correct' | 'incorrect';
type QuestionType = 'meaning' | 'synonym' | 'antonym';

interface VocabMCQ {
    word: VocabularyWord;
    question: string;
    options: string[];
    answer: number;
    questionType: QuestionType;
}


const VocabularyView: React.FC<VocabularyViewProps> = ({ onExit, onAddXP }) => {
    const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
    const [numWords, setNumWords] = useState<number>(10);
    const [isPracticing, setIsPracticing] = useState(false);
    const [questions, setQuestions] = useState<VocabMCQ[]>([]);
    
    // Quiz state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
    const [isFinished, setIsFinished] = useState(false);

    const generateQuestions = (words: VocabularyWord[]): VocabMCQ[] => {
        const mcqs: VocabMCQ[] = [];
        const questionTypes: QuestionType[] = ['meaning', 'synonym', 'antonym'];

        for (const word of words) {
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            let questionText = '';
            let correctAnswer = '';

            switch(questionType) {
                case 'meaning':
                    questionText = `'${word.word}'-এর বাংলা অর্থ কী?`;
                    correctAnswer = word.meaning;
                    break;
                case 'synonym':
                    questionText = `'${word.word}'-এর সমার্থক শব্দ কী?`;
                    correctAnswer = word.synonym;
                    break;
                case 'antonym':
                    questionText = `'${word.word}'-এর বিপরীতার্থক শব্দ কী?`;
                    correctAnswer = word.antonym;
                    break;
            }

            const options: string[] = [correctAnswer];
            const otherWords = words.filter(w => w.word !== word.word);
            
            while (options.length < 4 && otherWords.length > 0) {
                const randomWordIndex = Math.floor(Math.random() * otherWords.length);
                const randomWord = otherWords[randomWordIndex];
                otherWords.splice(randomWordIndex, 1); // Ensure we don't pick the same word twice

                let randomOption = '';
                switch (questionType) {
                    case 'meaning': randomOption = randomWord.meaning; break;
                    case 'synonym': randomOption = randomWord.synonym; break;
                    case 'antonym': randomOption = randomWord.antonym; break;
                }
                
                if (!options.includes(randomOption)) {
                    options.push(randomOption);
                }
            }
            
            // Fallback if not enough unique options
            while(options.length < 4) {
                options.push(`অপশন ${options.length + 1}`);
            }

            const shuffledOptions = options.sort(() => Math.random() - 0.5);
            const answerIndex = shuffledOptions.indexOf(correctAnswer);
            
            mcqs.push({
                word: word,
                question: questionText,
                options: shuffledOptions,
                answer: answerIndex,
                questionType: questionType
            });
        }
        return mcqs;
    };
    
    const handleStartPractice = () => {
        if (!selectedMode) return;
    
        const shuffledWords = [...VOCABULARY_LIST].sort(() => 0.5 - Math.random());
        const selectedWords = shuffledWords.slice(0, numWords);
        
        if (selectedMode === 'mcq') {
            const generatedQuestions = generateQuestions(selectedWords);
            setQuestions(generatedQuestions);
            // Reset quiz state
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedOption(null);
            setAnswerState('unanswered');
            setIsFinished(false);
            
            setIsPracticing(true);
        }
        setSelectedMode(null); // Close modal
    };
    
    const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

    const handleOptionSelect = (optionIndex: number) => {
        if (answerState !== 'unanswered') return;
        setSelectedOption(optionIndex);
        if (optionIndex === currentQuestion.answer) {
            setAnswerState('correct');
            setScore(prev => prev + 1);
        } else {
            setAnswerState('incorrect');
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setAnswerState('unanswered');
        } else {
            onAddXP(score); // Add score as XP
            setIsFinished(true);
        }
    };
    
    const restartQuiz = () => {
        setIsPracticing(false);
        setIsFinished(false);
    }
    
    const getButtonClass = (optionIndex: number) => {
        const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-slate-200";
        if (answerState === 'unanswered') {
          return `${baseClass} bg-slate-700 border-slate-600 hover:bg-blue-900 hover:border-blue-400`;
        }
        if (optionIndex === currentQuestion.answer) {
          return `${baseClass} bg-green-900 border-green-400 font-semibold`;
        }
        if (optionIndex === selectedOption) {
          return `${baseClass} bg-red-900 border-red-400 font-semibold`;
        }
        return `${baseClass} bg-slate-700 border-slate-600 cursor-not-allowed opacity-60`;
    };

    const renderQuiz = () => {
        if (!currentQuestion) return <div className="flex justify-center items-center h-full"><Spinner/></div>;

        if (isFinished) {
            return (
                <div className="flex flex-col items-center text-center h-full justify-center p-4">
                     <h2 className="text-3xl font-bold text-slate-100 mb-2">অনুশীলন সম্পন্ন!</h2>
                     <p className="text-lg text-slate-300 mb-6">
                        আপনি {questions.length}টির মধ্যে {score}টি সঠিক উত্তর দিয়েছেন।
                     </p>
                     <div className="text-2xl font-bold mb-8">
                        <span className="text-slate-100">আপনার স্কোর: </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                            {Math.round((score / questions.length) * 100)}%
                        </span>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                        <button
                           onClick={restartQuiz}
                           className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                         >
                           আবার চেষ্টা করুন
                         </button>
                       <button
                         onClick={onExit}
                         className="w-full bg-slate-600 text-slate-100 font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors"
                       >
                         হোমপেজে ফিরে যান
                       </button>
                     </div>
                </div>
            );
        }
        
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        return (
            <div className="p-4 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6 flex-shrink-0">
                    <div className="flex justify-between items-center mb-2 text-slate-300">
                        <p className="font-semibold text-lg">MCQ Practice</p>
                        <p>Score: <span className="font-bold text-blue-400">{score}</span></p>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-right text-sm mt-1 text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
                
                {/* Body */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="mb-6">
                        <h3 className="text-xl md:text-2xl font-semibold text-slate-100 text-center">{currentQuestion.question}</h3>
                    </div>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionSelect(index)} className={getButtonClass(index)} disabled={answerState !== 'unanswered'}>
                            <span className="flex items-center">
                            <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                            <span>{option}</span>
                            {answerState !== 'unanswered' && selectedOption === index && (
                                <span className="ml-auto">{answerState === 'correct' ? <CheckIcon /> : <XIcon />}</span>
                            )}
                            {answerState !== 'unanswered' && index === currentQuestion.answer && selectedOption !== index && (
                                <span className="ml-auto"><CheckIcon /></span>
                            )}
                            </span>
                        </button>
                        ))}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-auto flex-shrink-0 pt-4">
                    {answerState !== 'unanswered' && (
                        <button
                        onClick={handleNext}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderModal = () => {
        if (!selectedMode) return null;
        const maxQuestions = VOCABULARY_LIST.length;

        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMode(null)}>
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-6">Select Number of Words</h3>
              <div className="mb-6">
                <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Words: <span className="font-bold text-white">{numWords}</span>
                </label>
                <input
                  id="numQuestions" type="range" min="5" max={maxQuestions} step="5" value={numWords}
                  onChange={(e) => setNumWords(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                 <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5</span><span>{maxQuestions}</span></div>
              </div>
              <div className="flex flex-col gap-3">
                 <button onClick={handleStartPractice} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Start</button>
                 <button onClick={() => setSelectedMode(null)} className="w-full bg-slate-600 text-slate-100 font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        );
      };
      
    const renderModeSelector = () => (
        <div className="p-4 bg-slate-800 h-full">
             <div className="w-full flex justify-between items-center mb-8 relative">
                <button onClick={onExit} className="p-2 rounded-full hover:bg-slate-700 transition-colors absolute left-0">
                    <BackArrowIcon />
                </button>
                <h2 className="text-xl font-bold text-center text-slate-100 flex-grow">
                    শব্দভান্ডার - Vocabulary
                </h2>
            </div>
            <div className="space-y-4">
                <button onClick={() => setSelectedMode('mcq')} className="w-full text-left p-6 bg-slate-700 rounded-lg flex items-center space-x-4 hover:bg-blue-900/50 hover:ring-2 hover:ring-blue-500 transition-all">
                    <MCQUIcon />
                    <div>
                        <h3 className="font-bold text-lg text-slate-100">MCQ Practice</h3>
                        <p className="text-sm text-slate-400">Test your knowledge with multiple choice questions.</p>
                    </div>
                </button>
                <button disabled className="w-full text-left p-6 bg-slate-700 rounded-lg flex items-center space-x-4 opacity-50 cursor-not-allowed relative">
                    <div className="absolute top-2 right-2 text-xs bg-yellow-500 text-slate-900 font-bold px-2 py-0.5 rounded-full">Coming Soon</div>
                    <FlashcardIcon />
                    <div>
                        <h3 className="font-bold text-lg text-slate-100">Flashcards</h3>
                        <p className="text-sm text-slate-400">Memorize words with interactive flashcards.</p>
                    </div>
                </button>
                <button disabled className="w-full text-left p-6 bg-slate-700 rounded-lg flex items-center space-x-4 opacity-50 cursor-not-allowed relative">
                    <div className="absolute top-2 right-2 text-xs bg-yellow-500 text-slate-900 font-bold px-2 py-0.5 rounded-full">Coming Soon</div>
                    <TableIcon />
                    <div>
                        <h3 className="font-bold text-lg text-slate-100">Table View</h3>
                        <p className="text-sm text-slate-400">See all words, meanings, and synonyms in a list.</p>
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-slate-800">
            {renderModal()}
            {isPracticing ? renderQuiz() : renderModeSelector()}
        </div>
    );
};

export default VocabularyView;
