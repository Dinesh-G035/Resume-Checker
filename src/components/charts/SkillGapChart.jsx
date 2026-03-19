import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useAnalysis } from '../../context/AnalysisContext';

const SkillGapChart = () => {
  const { keywords, hasAnalyzed } = useAnalysis();

  const chartData = useMemo(() => {
    if (!keywords || !keywords.all) return [];

    const categories = {};
    keywords.all.forEach((k) => {
      const cat = k.category || 'other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const maxVal = Math.max(...Object.values(categories), 1);

    return Object.entries(categories).map(([name, count]) => ({
      skill: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / maxVal) * 100),
      count,
    }));
  }, [keywords]);

  if (!hasAnalyzed || chartData.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-2">Skill Coverage</h3>
      <p className="text-surface-500 text-xs mb-4">Skills detected across categories in your resume</p>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#475569', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
              formatter={(value, name, props) => [`${props.payload.count} keywords`, 'Coverage']}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillGapChart;
