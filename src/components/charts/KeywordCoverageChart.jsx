import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAnalysis } from '../../context/AnalysisContext';

const KeywordCoverageChart = () => {
  const { categories, hasAnalyzed } = useAnalysis();

  const chartData = useMemo(() => {
    if (!categories) return [];
    return Object.entries(categories).map(([key, cat]) => ({
      name: cat.label?.replace(' & ', '\n& ') || key,
      score: cat.score || 0,
      weight: Math.round((cat.weight || 0) * 100),
    }));
  }, [categories]);

  if (!hasAnalyzed || chartData.length === 0) return null;

  const getBarColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-2">Category Scores</h3>
      <p className="text-surface-500 text-xs mb-4">Performance breakdown across resume evaluation categories</p>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KeywordCoverageChart;
