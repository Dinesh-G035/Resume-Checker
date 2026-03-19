const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';

export const getAISuggestions = async (resumeText, jobDescription = '') => {
  if (!AI_API_KEY || AI_API_KEY === 'your_api_key_here') {
    return getFallbackSuggestions(resumeText, jobDescription);
  }

  const prompt = buildPrompt(resumeText, jobDescription);

  try {
    if (AI_PROVIDER === 'openai') {
      return await callOpenAI(prompt);
    } else if (AI_PROVIDER === 'claude') {
      return await callClaude(prompt);
    }
    return getFallbackSuggestions(resumeText, jobDescription);
  } catch (error) {
    console.error('AI API error:', error);
    return getFallbackSuggestions(resumeText, jobDescription);
  }
};

const buildPrompt = (resumeText, jobDescription) => {
  let prompt = `Analyze this resume and provide specific, actionable improvement suggestions.
Return a JSON object with the following structure:
{
  "summary": "A brief professional summary suggestion",
  "bulletImprovements": [{"original": "...", "improved": "..."}],
  "missingSkills": ["skill1", "skill2"],
  "wordingImprovements": [{"section": "...", "suggestion": "..."}],
  "overallAdvice": "..."
}

Resume:
${resumeText}`;

  if (jobDescription) {
    prompt += `\n\nTarget Job Description:\n${jobDescription}`;
  }

  return prompt;
};

const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional resume coach. Respond only in valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const callClaude = async (prompt) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API error: ${response.status}`);

  const data = await response.json();
  return JSON.parse(data.content[0].text);
};

/**
 * Fallback suggestions when no API key is configured
 */
const getFallbackSuggestions = (resumeText, jobDescription) => {
  const lowerText = resumeText.toLowerCase();
  const suggestions = {
    summary: '',
    bulletImprovements: [],
    missingSkills: [],
    wordingImprovements: [],
    overallAdvice: '',
  };

  // Generate summary suggestion
  if (!lowerText.includes('summary') && !lowerText.includes('objective') && !lowerText.includes('profile')) {
    suggestions.summary = 'Consider adding a Professional Summary at the top of your resume to give recruiters a quick overview of your qualifications.';
  }

  // Check for weak bullet points
  const lines = resumeText.split('\n').filter((l) => l.trim());
  lines.forEach((line) => {
    if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
      const trimmed = line.replace(/^[\-•\*\s]+/, '');
      if (trimmed.length < 20) {
        suggestions.bulletImprovements.push({
          original: trimmed,
          improved: `Consider expanding this bullet point with specific achievements, metrics, or outcomes.`,
        });
      }
    }
  });

  // Wording improvements
  if (!/\d+%/.test(resumeText)) {
    suggestions.wordingImprovements.push({
      section: 'Experience',
      suggestion: 'Add quantified results (e.g., "Increased sales by 25%", "Reduced costs by $50K").',
    });
  }

  const weakWords = ['responsible for', 'duties included', 'helped with', 'worked on'];
  weakWords.forEach((word) => {
    if (lowerText.includes(word)) {
      suggestions.wordingImprovements.push({
        section: 'Experience',
        suggestion: `Replace "${word}" with stronger action verbs (e.g., "Led", "Developed", "Implemented").`,
      });
    }
  });

  suggestions.overallAdvice = 'Focus on quantifying achievements, using strong action verbs, and tailoring content to your target role. Consider adding a professional summary if you haven\'t already.';

  return suggestions;
};

export default getAISuggestions;
