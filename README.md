# Phisher.AI - Email Phishing Detection System (Frontend)

## Overview

Phisher.AI is an email analysis tool that helps users identify potential phishing attempts in their emails. Built with modern web technologies and AI integration, this tool provides real-time analysis (through ChatGPT, and trained ML model) of email content to detect suspicious patterns and potential threats.

## Collaborators

- Khadim Diop
- Jaymond Baruso
- Duy Nguyen

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**:
  - Shadcn/ui (Built on Radix UI)
  - Lucide Icons
- **Type Safety**: TypeScript
- **State Management**: React Hooks

## Features

- Real-time email content analysis
- Optional subject line analysis (sklearn ML)
- User-friendly interface with clear feedback
- Detailed phishing probability scores
- Comprehensive analysis results with explanations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/phisher-ai.git

# Navigate to the project directory
cd phisher-ai

# Install dependencies
npm install
# or
yarn install

# Start frontent development server
npm run dev
# or
yarn dev


# Set up back end
cd flask-backend
# Create a .env file
GITHUB_KEY="your api key"
# Then
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py


```

### Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Paste or type your email content in the main text area
3. (Optional) Add the email subject for additional analysis
4. Click "Analyze Email" to get the results

## Project Structure

```
phisher-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   └── page.tsx
├── components/
│   ├── ui/
│   └── email-analyzer.tsx
├── lib/
│   └── utils.ts
├── public/
└── flask-backend/
```

## Future Enhancements

- [ ] Add support for email attachment analysis
- [ ] Implement user authentication
- [ ] Add history tracking for analyzed emails
- [ ] Integrate with email clients via plugins
- [ ] Enhance UI/UX with more interactive features
- [ ] Add support for multiple languages
- [ ] Implement batch analysis for multiple emails

**Note**: This is the frontend documentation. For backend documentation and API details, please refer to the backend README.
