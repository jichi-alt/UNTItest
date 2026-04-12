import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRandomLoadingText, calculatePersonality } from '../utils/engine';

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    const answers = location.state?.answers;
    const scores = location.state?.scores;

    if (!answers) {
      navigate('/');
      return;
    }

    setLoadingText(getRandomLoadingText());

    // 预加载所有人格图片
    const images = [
      'KING', 'NULL', 'FIRE', 'FLOP', 'PURE', 'OOPS', 'WILD', 'FREE', 'ALIEN'
    ];
    images.forEach(name => {
      const img = new Image();
      img.src = `/images/${name}.webp`;
    });

    // 2秒后跳转
    const timer = setTimeout(() => {
      const result = calculatePersonality(answers);
      navigate('/result', { state: { result, scores } });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* 加载动画 */}
      <div className="w-16 h-16 mb-8">
        <div className="w-full h-full border-4 border-gray-200 border-t-[#2C2C2C] rounded-full animate-spin" />
      </div>

      {/* 加载文案 */}
      <p className="text-lg text-gray-600 animate-pulse">
        {loadingText}
      </p>
    </div>
  );
}
