import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, getOptionScores } from '../utils/engine';
import type { Scores } from '../types';

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Scores>({ A: 0, E: 0, S: 0, W: 0, D: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const currentQuestion = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const canGoBack = currentIndex > 0 && !isTransitioning;

  // 处理选项选择
  const handleSelect = useCallback(async (optionIndex: number) => {
    if (isTransitioning) return;

    // 计算新分数
    const optionScores = getOptionScores(currentIndex, optionIndex);
    const newScores = { ...scores };
    for (const [key, val] of Object.entries(optionScores)) {
      if (key in newScores) {
        newScores[key as keyof Scores] += val as number;
      }
    }

    // 更新状态
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    setScores(newScores);

    // 过渡动画
    setDirection('next');
    setIsTransitioning(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsTransitioning(false);
    } else {
      // 保存答案到 sessionStorage，防止刷新丢失
      sessionStorage.setItem('quiz_answers', JSON.stringify(newAnswers));
      sessionStorage.setItem('quiz_scores', JSON.stringify(newScores));

      // 跳转到加载页
      navigate('/loading', { state: { answers: newAnswers, scores: newScores } });
    }
  }, [answers, currentIndex, isTransitioning, navigate, scores, total]);

  // 返回上一题
  const handleBack = useCallback(async () => {
    if (!canGoBack) return;

    setDirection('prev');
    setIsTransitioning(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    // 移除最后一题的答案
    const lastAnswerIndex = answers[currentIndex - 1];
    const lastOptionScores = getOptionScores(currentIndex - 1, lastAnswerIndex);

    // 恢复分数（减去上一题的分数变化）
    const newScores = { ...scores };
    for (const [key, val] of Object.entries(lastOptionScores)) {
      if (key in newScores) {
        newScores[key as keyof Scores] -= val as number;
      }
    }

    setScores(newScores);
    setAnswers(answers.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
    setIsTransitioning(false);
  }, [canGoBack, currentIndex, answers, scores]);

  // 进度百分比
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        {/* 返回按钮 */}
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#2C2C2C] transition-all ${
            canGoBack
              ? 'hover:bg-gray-100 active:translate-x-[-2px]'
              : 'opacity-30 cursor-not-allowed'
          }`}
          aria-label="返回上一题"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 题号 */}
        <span className="text-sm font-medium">
          {currentIndex + 1} / {total}
        </span>

        {/* 占位 */}
        <div className="w-10" />
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2C2C2C] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`card-outline p-6 sm:p-8 w-full max-w-lg transition-all duration-300 ${
            isTransitioning
              ? direction === 'next'
                ? 'opacity-0 -translate-x-8'
                : 'opacity-0 translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <h2 className="text-lg sm:text-xl font-medium mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-item w-full text-left"
                onClick={() => handleSelect(index)}
                disabled={isTransitioning}
              >
                <span className="mr-3 font-medium text-gray-400">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <p className="text-center text-sm text-gray-400 mt-4">
        {canGoBack ? '← 点击左上角返回上一题' : '点击选项进入下一题'}
      </p>
    </div>
  );
}
