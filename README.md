# ATS Resume Checker


A powerful, client-side web application built with React and Vite that analyzes, scores, and optimizes resumes against Applicant Tracking System (ATS) algorithms. It provides job seekers with real-time feedback, keyword analysis, and formatting suggestions to ensure their resume gets past automated scanners.

## ✨ Features

- **Multi-Format Parsing:** Extract text directly from PDF (`.pdf`), Word (`.docx`), or plain text files entirely in the browser. 
- **Advanced ATS Rules Engine:** Evaluates your resume against dozens of critical formatting and content rules (e.g., proper section headings, action verbs, quantified achievements, hidden tables).
- **Job Description Matching:** Paste a target job description to get a customized keyword gap analysis and match percentage.
- **Unified Scoring Dashboard:** Get a clear, out-of-100 score with interactive, expandable category breakdowns so you understand exactly why you lost points.
- **Data Privacy First:** All file parsing and rule evaluation happens locally in your browser. No data is stored or sent to a server (unless using the optional AI improvement feature).
- **AI-Powered Suggestions (Optional):** Context-aware bullet point improvements leveraging OpenAI/Claude APIs (includes a robust fallback engine if no API key is provided).

## 🚀 Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS (with custom Animations & Glassmorphism effects)
- **State Management:** React Context API & Custom Hooks
- **Routing:** React Router DOM
- **Data Visualization:** Recharts
- **Parsing Libraries:** `pdfjs-dist` (for PDFs), `mammoth` (for DOCX)

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js (v16+ recommended) and `npm` installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dinesh-G035/Resume-Checker.git
   ```

2. Navigate into the project directory:
   ```bash
   cd Resume-Checker
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory (Optional - for AI features):
   ```env
   VITE_AI_PROVIDER=openai # or claude
   VITE_AI_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## 🧠 How the ATS Engine Works

The core of this application is a highly optimized rules engine built to simulate enterprise ATS platforms (like Workday or Taleo). 

1. **Extraction:** It uses complex RegEx cleaning logic to fix missing word boundaries and fragmented spaces common in PDF text extraction.
2. **Evaluation:** It passes the normalized text through `atsRules.js`, which maps required sections, strict formatting rules (e.g., rejecting tables), and content density (e.g., percentage of bullet points starting with action verbs).
3. **Scoring:** The `scoreCalculator.js` aggregates these checks, applying weighted importance to Keywords (30%), Content (35%), Formatting (20%), and Experience (15%) to generate a final, realistic ATS compatibility score.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the MIT License.
