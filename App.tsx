
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizState, Question } from './types';
import { QUESTIONS, QUESTION_TIME_LIMIT, TOTAL_QUIZ_TIME_LIMIT, IP_LOCKOUT_DURATION } from './constants';
import { saveQuizResult, checkIpLockout, getUserIP } from './firebase';

// Helper Components (defined outside to prevent re-renders)
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-900 border-4 border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 max-w-3xl w-full mx-2 sm:mx-4 transition-all ${className}`}>
    {children}
  </div>
);

// Added className to Button props to fix the error where it was being passed but not accepted.
const Button: React.FC<{ 
  onClick?: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  className?: string;
}> = ({ onClick, disabled, children, variant = 'primary', type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-slate-500/10',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    status: 'auth',
    userName: '',
    userEmail: '',
    startTime: null,
    endTime: null,
    score: null,
  });

  const [ip, setIp] = useState<string>('');
  const [globalTimeLeft, setGlobalTimeLeft] = useState(TOTAL_QUIZ_TIME_LIMIT);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isLocked, setIsLocked] = useState(false);
  const stateRef = useRef(state);

  // Sync ref for effect closures
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initial IP and Lockout Check
  useEffect(() => {
    const init = async () => {
      const userIp = await getUserIP();
      setIp(userIp);
      const locked = await checkIpLockout(userIp, IP_LOCKOUT_DURATION);
      if (locked) {
        setIsLocked(true);
        setState(prev => ({ ...prev, status: 'locked' }));
      }
    };
    init();
    
    // Anti-cheat: Prevent context menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const calculateScore = useCallback((answers: (number | null)[]) => {
    return answers.reduce((acc, ans, idx) => {
      return acc + (ans === QUESTIONS[idx].c ? 1 : 0);
    }, 0);
  }, []);

  const submitQuiz = useCallback(async (forced = false) => {
    const currentState = stateRef.current;
    if (currentState.status !== 'quiz' && currentState.status !== 'submitting') return;

    setState(prev => ({ ...prev, status: 'submitting' }));
    
    const finalScore = calculateScore(currentState.answers);
    const percentage = Math.round((finalScore / QUESTIONS.length) * 100);
    
    try {
      const saved = await saveQuizResult({
        name: currentState.userName,
        email: currentState.userEmail,
        score: finalScore,
        totalQuestions: QUESTIONS.length,
        ip: ip,
        percentage,
      });

      // Log saved submission (appears in browser console)
      console.log('Submission saved:', saved);

      setState(prev => ({
        ...prev,
        status: 'finished',
        score: finalScore,
        endTime: Date.now()
      }));
    } catch (err) {
      console.error("Submission failed", err);
      // Fallback for UI if Firebase fails
      console.log('Final submission (local fallback):', {
        name: currentState.userName,
        email: currentState.userEmail,
        score: finalScore,
        totalQuestions: QUESTIONS.length,
        ip: ip,
        percentage,
      });
      setState(prev => ({
        ...prev,
        status: 'finished',
        score: finalScore,
        endTime: Date.now()
      }));
    }
  }, [calculateScore, ip]);

  // Global Quiz Timer
  useEffect(() => {
    if (state.status !== 'quiz') return;

    const timer = setInterval(() => {
      setGlobalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, submitQuiz]);

  // Question Timer
  useEffect(() => {
    if (state.status !== 'quiz') return;

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Time up for current question: move to next or submit
          if (state.currentQuestionIndex < QUESTIONS.length - 1) {
            setState(s => ({ ...s, currentQuestionIndex: s.currentQuestionIndex + 1 }));
            return QUESTION_TIME_LIMIT;
          } else {
            submitQuiz();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, state.currentQuestionIndex, submitQuiz]);

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionTimeLeft(QUESTION_TIME_LIMIT);
  }, [state.currentQuestionIndex]);

  // Anti-cheat: Auto-submit on window visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && stateRef.current.status === 'quiz') {
        alert("Integrity Violation: Test auto-submitted due to tab switch/exit.");
        submitQuiz(true);
      }
    };

    const handleBlur = () => {
      if (stateRef.current.status === 'quiz') {
        alert("Integrity Violation: Test auto-submitted due to window focus loss.");
        submitQuiz(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [submitQuiz]);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setState(prev => ({
      ...prev,
      status: 'quiz',
      startTime: Date.now()
    }));
  };

  const handleSelectAnswer = (ansIndex: number) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = ansIndex;
    setState(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      submitQuiz();
    }
  };

  // UI Formatters
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Screens
  if (state.status === 'locked') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-red-500/50">
          <div className="text-center">
            <i className="fas fa-user-lock text-5xl text-red-500 mb-6"></i>
            <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
            <p className="text-slate-400 mb-6">
              A submission was already recorded from this IP address. Please wait at least 30 minutes between attempts.
            </p>
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-900/50 text-red-400 text-sm">
              Current IP: {ip}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state.status === 'auth') {
    return (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
    <header className="mb-4 text-center">
      <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
        PHYSICS QUIZ PRO
      </h1>
      <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Department of Advanced Mechanics</p>
    </header>

    {/* Add width classes here */}
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl p-6">
      <form onSubmit={handleStartQuiz} className="space-y-5">
        <h2 className="text-2xl font-bold text-center text-white">Enter Your Details to Start</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={state.userName}
                  onChange={(e) => setState(s => ({ ...s, userName: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={state.userEmail}
                  onChange={(e) => setState(s => ({ ...s, userEmail: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-lg text-amber-500 text-sm leading-relaxed">
              <i className="fas fa-shield-alt mr-2"></i>
              <strong>Security Protocol:</strong> Exiting the browser tab or resizing the window will result in an immediate automatic submission of your current progress.
            </div>

            <Button type="submit" className="w-full">
              Begin Assessment
            </Button>
          </form>
        </Card>
        
        <footer className="mt-8 text-slate-600 text-xs">
          30 Questions • 15 Minutes • Strictly Monitored Session
        </footer>
      </div>
    );
  }

  if (state.status === 'quiz') {
    const question = QUESTIONS[state.currentQuestionIndex];
    const progress = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;
    
    return (
      <div className="min-h-screen flex flex-col p-6 no-copy">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 pb-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-base">
                {state.currentQuestionIndex + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Physics Assessment</h3>
                <p className="text-base md:text-lg font-bold">{state.userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase">Global Time</p>
                <p className={`text-lg md:text-xl font-mono ${globalTimeLeft < 60 ? 'text-red-500' : 'text-indigo-400'}`}>
                  {formatTime(globalTimeLeft)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase">Question Time</p>
                <p className={`text-lg md:text-xl font-mono ${questionTimeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                  0:{questionTimeLeft.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex items-center justify-center py-8 px-0 sm:px-4">
          <Card className="shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] w-full max-w-full sm:max-w-2xl mx-0 sm:mx-auto rounded-none sm:rounded-2xl">
            <div className="mb-8">
              <h2 className="text-lg md:text-2xl font-medium leading-relaxed">
                {question.q}
              </h2>
            </div>

            <div className="space-y-3">
              {question.a.map((option, idx) => {
                const isSelected = state.answers[state.currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 group ${
                      isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 group-hover:border-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm md:text-lg">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between items-center">
              <p className="text-slate-500 italic text-sm">
                Question {state.currentQuestionIndex + 1} of {QUESTIONS.length}
              </p>
              <Button onClick={handleNext}>
                {state.currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish Test' : 'Next Question'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (state.status === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold">Securely Submitting...</h2>
          <p className="text-slate-400 mt-2">Encrypting and uploading your physics assessment results.</p>
        </div>
      </div>
    );
  }

  if (state.status === 'finished') {
    const score = state.score || 0;
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
        <Card className="border-indigo-500/30 text-center relative overflow-hidden max-w-xl sm:max-w-2xl">
          {/* Confetti effect placeholder */}
          <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
          
          <i className="fas fa-check-circle text-6xl text-emerald-500 mb-6"></i>
          <h1 className="text-3xl md:text-4xl font-black mb-2">Quiz Completed</h1>
          <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Submission Finalized</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Score</p>
              <p className="text-4xl font-black text-white">{score} <span className="text-xl text-slate-500">/ {QUESTIONS.length}</span></p>
            </div>
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Percentage</p>
              <p className="text-4xl font-black text-indigo-400">{percentage}%</p>
            </div>
          </div>

          <div className="space-y-2 text-left bg-slate-950/50 p-6 rounded-xl border border-slate-800 mb-8">
            <div className="flex justify-between">
              <span className="text-slate-500">Candidate:</span>
              <span className="font-medium">{state.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium">{state.userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="font-medium">{new Date(state.endTime!).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">IP Tracked:</span>
              <span className="font-mono text-xs opacity-50">{ip}</span>
            </div>
          </div>

          <p className="text-slate-500 text-sm italic mb-6">
            You will be locked from re-taking this assessment for 30 minutes to maintain testing integrity.
          </p>
          
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Close Session
          </Button>
        </Card>
      </div>
    );
  }

  return null;
};

export default App;
