# Phisher.AI Backend

This is the backend service for the Phisher.AI email phishing detection system. It uses Flask to serve a REST API and integrates with GitHub's OpenAI API for advanced phishing detection.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- GitHub account for API access

## Configuration

1. Obtain a GitHub API token:

   - Visit GitHub Marketplace
   - Subscribe to OpenAI API access
   - Generate an API token

2. Set up environment variables:
   - Create a `.env` file in the flask-backend directory
   - Add your GitHub token:
   ```
   GITHUB_TOKEN=your_token_here
   ```

## Machine Learning Model

This project uses a pre-trained machine learning model for initial email subject analysis. The model was developed by [Khadim Diop](https://github.com/KHAUSMC/phishing-detector-backend).

For the latest model updates and training data, please refer to the original repository:
https://github.com/KHAUSMC/phishing-detector-backend

## Running the Server

1. Start the Flask server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

- `POST /api/analyze`
  - Analyzes email content for phishing attempts
  - Accepts JSON payload with `text` and optional `subject` fields
  - Returns analysis results including score and verdict

## Development

For development mode:

```bash
export FLASK_DEBUG=true
python app.py
```

## Contributors

- Khadim Diop
- Jaymond Baruso
- Duy Nguyen
