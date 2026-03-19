// ATS Rules Engine — defines the rules used to evaluate resume ATS compatibility

export const ATS_RULES = {
  formatting: {
    weight: 0.2,
    rules: [
      {
        id: 'has-sections',
        label: 'Contains standard sections',
        description: 'Resume includes common sections like Experience, Education, Skills',
        requiredSections: ['experience', 'education', 'skills', 'summary'],
        score: 25,
      },
      {
        id: 'no-tables',
        label: 'Avoids complex tables & columns',
        description: 'Tables and multi-column layouts can confuse ATS parsers',
        patterns: [/\|.*\|.*\|/g, /[┌┐└┘─│]/g],
        penaltyPerMatch: 5,
        maxPenalty: 15,
        score: 25,
      },
      {
        id: 'proper-headings',
        label: 'Uses clear headings',
        description: 'Section headings are clearly identifiable',
        headingPatterns: [
          /\b(experience|work\s*experience|professional\s*experience)\b/i,
          /\b(education|academic|qualifications)\b/i,
          /\b(skills|technical\s*skills|core\s*competencies)\b/i,
          /\b(summary|objective|profile|about)\b/i,
        ],
        score: 25,
      },
      {
        id: 'reasonable-length',
        label: 'Appropriate resume length',
        description: 'Resume is between 300 and 1500 words',
        minWords: 300,
        maxWords: 1500,
        score: 25,
      },
    ],
  },
  content: {
    weight: 0.35,
    rules: [
      {
        id: 'has-contact-info',
        label: 'Contact information present',
        description: 'Include email, phone, and optionally LinkedIn',
        patterns: {
          email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
          phone: /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}(\s?\d{1,4})?|\b\d{10}\b/,
          linkedin: /linkedin\.com\/in\/[\w\-\/]+/i,
        },
        score: 20,
      },
      {
        id: 'quantified-achievements',
        label: 'Quantified achievements',
        description: 'Uses numbers and metrics to demonstrate impact',
        patterns: [
          /\d+(?:\.\d+)?[%$]/g,
          /\d{1,3}(?:,\d{3})*(?:\.\d+)?[%$]/g,
          /\$[\d,]+/g,
          /\d+\s*(years?|months?|projects?|clients?|team\s*members?|employees?|hackathon)/gi,
          /\b(?:sav|reduc|increas|improv|achiev|deliver|grew|boost|enhanc|optimiz|cut|gain|win|secur|clos|generat|handl|serv|reach|exceed)\w*\b.*\d/gi,
          /\b\d+(?:\.\d{1,3})?\b/g,
        ],
        minMatches: 2,
        score: 25,
      },
      {
        id: 'action-verbs',
        label: 'Uses strong action verbs',
        description: 'Bullet points start with action verbs',
        verbs: [
          'achieved', 'accomplished', 'managed', 'manage', 'led', 'lead', 'developed', 'develop', 'created', 'create', 'implemented', 'implement',
          'designed', 'design', 'built', 'build', 'improved', 'improve', 'increased', 'increase', 'reduced', 'reduce', 'launched', 'launch',
          'negotiated', 'negotiate', 'coordinated', 'coordinate', 'analyzed', 'analyze', 'established', 'establish', 'generated', 'generate',
          'streamlined', 'streamline', 'optimized', 'optimize', 'delivered', 'deliver', 'executed', 'execute', 'mentored', 'mentor',
          'spearheaded', 'spearhead', 'pioneered', 'pioneer', 'transformed', 'transform', 'automated', 'automate', 'orchestrated', 'orchestrate',
          'facilitated', 'facilitate', 'supervised', 'supervise', 'administered', 'administer', 'resolved', 'resolve', 'initiated', 'initiate',
          'directed', 'direct', 'oversaw', 'oversee', 'planned', 'plan', 'organized', 'organize', 'trained', 'coach', 'handled', 'support',
        ],
        minMatches: 3,
        score: 30,
      },
      {
        id: 'no-personal-pronouns',
        label: 'Avoids personal pronouns',
        description: 'Professional resumes avoid "I", "me", "my"',
        patterns: [/\bI\b/g, /\bme\b/g, /\bmy\b/gi, /\bmyself\b/gi],
        maxMatches: 2,
        score: 25,
      },
    ],
  },
  keywords: {
    weight: 0.3,
    rules: [
      {
        id: 'industry-keywords',
        label: 'Industry-relevant keywords',
        description: 'Resume contains keywords matching the target role',
        minKeywordDensity: 0.02,
        maxKeywordDensity: 0.05,
        score: 50,
      },
      {
        id: 'skill-keywords',
        label: 'Skill keywords present',
        description: 'Technical and soft skills are clearly listed',
        minSkills: 5,
        score: 50,
      },
    ],
  },
  experience: {
    weight: 0.15,
    rules: [
      {
        id: 'date-consistency',
        label: 'Consistent date formats',
        description: 'Employment dates use consistent formatting',
        patterns: [
          /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}/gi,
          /\d{1,2}\/\d{4}/g,
          /\d{4}\s*[-–]\s*(?:\d{4}|present|current)/gi,
        ],
        score: 50,
      },
      {
        id: 'no-gaps',
        label: 'No unexplained employment gaps',
        description: 'Timeline of employment appears continuous',
        score: 50,
      },
    ],
  },
};

export const SECTION_NAMES = {
  experience: ['experience', 'work experience', 'professional experience', 'employment history', 'work history', 'employment', 'career history', 'professional history'],
  education: ['education', 'academic background', 'qualifications', 'academic qualifications', 'education & training', 'academic', 'degree', 'training'],
  skills: ['skills', 'technical skills', 'core competencies', 'competencies', 'key skills', 'areas of expertise', 'skill set', 'skill summary', 'technical abilities'],
  summary: ['summary', 'professional summary', 'objective', 'career objective', 'profile', 'about me', 'professional profile', 'career profile'],
  certifications: ['certifications', 'certificates', 'licenses', 'professional certifications'],
  projects: ['projects', 'key projects', 'notable projects'],
  awards: ['awards', 'honors', 'achievements', 'recognition'],
};

export default ATS_RULES;