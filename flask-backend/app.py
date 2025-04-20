from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import re
import json
import os
import logging
from dotenv import load_dotenv
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for communication with the frontend

# Load environment variables
load_dotenv()
token = os.environ.get("GITHUB_TOKEN")
if not token:
    raise ValueError("GITHUB_TOKEN environment variable is not set")

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"

# Configure logging to log errors
logging.basicConfig(level=logging.ERROR)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        # Validate input
        data = request.json
        
        email_body = data.get('text', '')
        
        email_subject = data.get('subject', '')
        print("Received email subject:", email_subject)
 
        if not email_body:
            return jsonify({'error': 'Invalid input'}), 400


        prediction_result = None
        prediction_text = ""
        
        if email_subject:
            prediction_result = predict(email_subject)
            prediction_text = (
                f"Also Machine Learning model predicted this email subject as potentially {prediction_result['prediction']}, "
                f"with a score of {prediction_result['confidence']} "
                
            )

        # Initialize OpenAI client
        client = OpenAI(
            base_url=endpoint,
            api_key=token,
        )

        # Prompt structure
        messages = [
            {
                "role": "system",
                "content": """
                        You are a phishing detection system designed to assess the legitimacy of emails using a clear scoring rubric. You will be given the body (and sometimes subject) of an email.
                        User will also provide you result from other machine learning model, but don't get influence by that result too much since it's just email subject.
                       
                        - Be skeptical, but not paranoid.
                        - Legitimate businesses may reference benefits or job openings, but small inconsistencies or unusual phrasing can be red flags.
                        - Never classify a message as “Safe” if there is any uncertainty.

                        ---

                        PHISHING INDICATORS (any present = score ≥ 85 → verdict: "Phishing")
                        - Requests for sensitive info (login, password, SSN, account numbers)
                        - Impersonation of known companies using mismatched domains or unusual sender email
                        - Hoverable link text doesn't match destination
                        - Fake job offers or payment promises
                        - Grammatical issues or unnatural repetition
                        - Impersonal greetings
                        - Unusual urgency, pressure to act
                        - Broken branding or inconsistent layout
                        - Suspicious attachments
                        - Unexplained third-party survey or application links

                        ---

                        SAFE OVERRIDE CONDITIONS (ALL must be true → score = 20 → verdict: "Safe")
                        Only use if all five below are clearly present:
                        1. Perfect grammar and professional tone  
                        2. Sender email domain exactly matches the official domain  
                        3. Links point to official or explicitly named third-party domains  
                        4. Contains personal context (e.g., mentions a past transaction or expected service)  
                        5. Reader was likely expecting this communication (e.g., follow-up to a known interaction)

                        > If any of these 5 are missing → do not apply Safe override.

                        ---

                        SUSPICIOUS INDICATORS (score 60–84 → verdict: "Suspicious")
                        Use when:
                        - Email looks polished but has any uncertainty
                        - Link domains seem real but not directly verifiable
                        - The tone or repetition feels off
                        - It asks for replies to an unknown address
                        - Sender uses “on behalf of” without a strong brand match

                        ---

                        SCORE-TO-VERDICT MAPPING (strictly follow)
                        - 80–100 → "Phishing"
                        - 60–79 → "Suspicious"
                        - 30–59 → "Safe with minor flags"
                        - 0–29 → "Safe" (Only with valid Safe override)

                        > Do not mismatch score and verdict.  
                        > If unsure, classify as “Suspicious” with score ≥ 60.

                        ---

                        RESPONSE FORMAT (JSON only)
                        ```json
                        {
                        "score": [integer between 0–100],
                        "verdict": "[Phishing / Suspicious / Safe with minor flags / Safe]",
                        "message": "[Brief reason for verdict, 1-2 sentences]"
                        }
                
                """
            },
            {
                "role": "user",
                "content": f"My email is {email_body}, the subject is {email_subject}, {prediction_text}. please analyze it."
            }
        ]

        # OpenAI API call
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=1.0,
            top_p=1.0
        )

        # Extract model content
        raw_output = response.choices[0].message.content.strip()

        # Clean response (remove ```json ... ```)
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", raw_output, re.DOTALL | re.IGNORECASE)
        if match:
            raw_output = match.group(1).strip()

        print("Sanitized model response:", raw_output)

        # Attempt to parse JSON
        result = json.loads(raw_output)
        return jsonify(result)

    except json.JSONDecodeError as e:
        logging.error("JSON decode error: %s", e)
        return jsonify({
            "error": "Invalid JSON from model",
            "raw": raw_output
        }), 500

    except Exception as e:
        logging.error("Unexpected error: %s", e)
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


def predict(email_text):
    # Load model and vectorizer
    logging.info("Loading model and vectorizer...")
    model = pickle.load(open('model.pkl', 'rb'))
    vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
    
    # Preprocess email text
    email_vec = vectorizer.transform([email_text])
    prediction = model.predict(email_vec)[0]
    proba = model.predict_proba(email_vec)[0]
    phishing_index = list(model.classes_).index('phishing')
    confidence = round(proba[phishing_index] * 100, 2)
    advice = (
        "Avoid clicking on suspicious links or giving personal info."
        if prediction == "phishing"
        else "Looks safe, but stay cautious."
    )
    
    print(f"ML Prediction: {prediction}, Confidence: {confidence}, Advice: {advice}")
    return {
        "prediction": prediction,
        "confidence": confidence,
        "advice": advice
    }
    


# Debug mode - SHOULD BE OFF AFTER DEPLOYMENT
if __name__ == '__main__':
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)