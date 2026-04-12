import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
        UNTI
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        大学生人格测试
      </p>

      {/* 首页插画 */}
      <div className="w-full max-w-sm mb-8">
        <img
          src="/images/Home page.webp"
          alt="UNTI"
          className="w-full h-auto"
          loading="eager"
        />
      </div>

      {/* 副标题 */}
      <p className="text-lg sm:text-xl mb-8 text-center">
        测测你是什么品种的大学生
      </p>

      {/* 开始按钮 */}
      <button
        className="btn-outline text-lg px-8 py-4"
        onClick={() => navigate('/quiz')}
      >
        开始测试
      </button>

      {/* 底部信息 */}
      <p className="mt-12 text-sm text-gray-400">
        共 16 题 · 约 3 分钟
      </p>
    </div>
  );
}
