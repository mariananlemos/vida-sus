# VidaSUS

Public health assistant focused on accessibility for Brazilian SUS users.

## Overview

VidaSUS is a React web app designed to help users:
- find nearby health units;
- receive initial triage guidance in plain language;
- understand prescriptions and medical reports with simplified explanations;
- review medical history (MVP currently uses mock data);
- use accessibility features such as text-to-speech, high contrast, and VLibras.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Web Speech API (voice input/output)
- VLibras Widget

## Features

- Guided triage flow
- Health unit search (UBS, UPA, AMA, Hospital)
- Prescription/report translator
- Medical history with 5 sections:
  - digital vaccination card
  - exams and results
  - active medications
  - appointments and follow-ups
  - preventive alerts
- Accessibility:
  - font size controls
  - high contrast mode
  - text-to-speech
  - VLibras integration

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

4. Open the URL shown in the terminal (usually http://localhost:5173).

## Environment Variables

`.env` file (do not commit):

```env
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

## Security

- `.env` is ignored by `.gitignore`.
- Never commit real API keys.
- Use `.env.example` as the public template only.

## SUS Integration Roadmap

- CNES (beta, via backend proxy)
- RNDS (production, with formal credentialing and authorization flow)

See `INTEGRACAO_SUS.md` for additional details.

## License

Academic/prototype use.
