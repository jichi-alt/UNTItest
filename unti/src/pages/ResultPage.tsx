import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPersonalityInfo, generateArchiveId, getAuthorNote } from '../utils/engine';
import type { Scores } from '../types';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const scores: Scores = location.state?.scores || { A: 0, E: 0, S: 0, W: 0, D: 0 };
  const [showAuthorNote, setShowAuthorNote] = useState(false);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 mb-4">请先完成测试</p>
        <button className="btn-outline" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  const personalityInfo = getPersonalityInfo(result.personality);
  const subType = personalityInfo?.subTypes?.[result.subType as keyof typeof personalityInfo.subTypes] as { name: string; desc: string } | undefined;
  const archiveId = generateArchiveId();
  const authorNote = getAuthorNote();

  // 分数转百分比
  const getScorePercent = (score: number) => {
    const max = 12;
    return Math.min(100, Math.max(0, ((score + max) / (max * 2)) * 100));
  };

  // SSR/UR 特效
  const isRare = result.trigger === 'SSR' || result.trigger === 'UR';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className={`card-outline max-w-md mx-auto p-6 relative ${isRare ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">受测者代号</p>
            <p className="font-medium text-sm">匿名观察对象</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">档案编号</p>
            <p className="font-mono font-medium text-sm">{archiveId}</p>
          </div>
        </div>

        {/* 印章 */}
        <div className="absolute top-3 right-3 -rotate-12">
          <span className="inline-block px-2 py-0.5 border-2 border-red-500 text-red-500 font-bold text-xs rounded">
            鉴定完毕
          </span>
        </div>

        {/* 人格插画 */}
        <div className="flex justify-center my-6">
          <img
            src={`/images/${result.personality}.webp`}
            alt={personalityInfo?.name}
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* 人格名称 */}
        <div className="text-center mb-4">
          <span className="text-3xl mr-1">{personalityInfo?.emoji}</span>
          <span className="text-xl font-bold">{personalityInfo?.name}</span>
          {personalityInfo?.rare !== 'N' && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-black text-white rounded">
              {personalityInfo?.rare}
            </span>
          )}
        </div>

        {/* 锐评 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
          <p className="font-medium text-gray-700 text-sm">{personalityInfo?.review}</p>
        </div>

        {/* 五维条形图 */}
        <div className="mb-3">
          <div className="flex justify-center items-end gap-2 h-20">
            {(['A', 'E', 'S', 'W', 'D'] as const).map(dim => (
              <div key={dim} className="flex flex-col items-center">
                <div
                  className="w-6 rounded-t bg-[#002FA7] transition-all duration-500"
                  style={{ height: `${Math.max(8, getScorePercent(scores[dim]) * 0.6)}px` }}
                />
                <span className="text-xs mt-1 font-medium">{dim}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 维度说明 */}
        <div className="mb-4 text-center text-xs text-gray-400">
          <span className="mr-2"><strong>A</strong> 执行力</span>
          <span className="mr-2"><strong>E</strong> 内耗</span>
          <span className="mr-2"><strong>S</strong> 社交</span>
          <span className="mr-2"><strong>W</strong> 发疯</span>
          <span><strong>D</strong> DDL</span>
        </div>

        {/* 确诊报告 */}
        <div className="mb-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {personalityInfo?.verdict}
        </div>

        {/* 副人格提示 */}
        {subType && (
          <div className="border-t border-dashed border-gray-300 pt-3 mb-4">
            <p className="text-xs text-gray-500">
              隐藏特质：{subType.desc}
            </p>
          </div>
        )}

        {/* 分隔线 */}
        <div className="border-t-2 border-gray-200 my-6" />

        {/* 来自作者 */}
        <div className="mb-6">
          <button
            onClick={() => setShowAuthorNote(!showAuthorNote)}
            className="w-full flex items-center justify-between text-gray-500 text-xs py-2 border border-gray-200 rounded px-3 hover:bg-gray-50 transition-colors"
          >
            <span>来自作者</span>
            <svg
              className={`w-4 h-4 transition-transform ${showAuthorNote ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAuthorNote && (
            <div className="mt-2 text-gray-500 text-xs leading-relaxed whitespace-pre-line p-3 bg-gray-50 rounded">
              {authorNote}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3">
          <button
            className="btn-outline flex-1 text-sm"
            onClick={() => navigate('/')}
          >
            再测一次
          </button>
        </div>
      </div>
    </div>
  );
}
