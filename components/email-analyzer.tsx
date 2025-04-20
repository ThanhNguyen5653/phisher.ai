"use client";

import type React from "react"; // Type import for React, used for type annotations like React.FormEvent
import { useState } from "react"; // React hook for managing component state
import { Button } from "@/components/ui/button"; // Custom Button component for UI
import { Textarea } from "@/components/ui/textarea"; // Custom Textarea component for input
import { AlertCircle, Loader2, Paperclip } from "lucide-react"; // Icons for error alerts and loading spinner
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Custom Alert components for displaying errors
import { sanitizeInput, countWords } from "@/lib/utils"; // Utility functions for input sanitization and word counting

export default function EmailAnalyzer() {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailText, setEmailText] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    verdict: string;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(emailText);
  const isValidSubject =
    emailSubject === "" ||
    (emailSubject.length > 0 && emailSubject.length <= 100);
  const isValidInput =
    emailText.length >= 10 && wordCount <= 2000 && isValidSubject;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidInput) {
      if (emailText.length < 10) {
        setError("Email text must be at least 10 characters long");
      } else if (wordCount > 2000) {
        setError("Email text must not exceed 2000 words");
      } else if (emailSubject.length > 100) {
        setError("Email subject must not exceed 100 characters");
      }
      return;
    }

    try {
      setIsAnalyzing(true);

      // Sanitize input to prevent XSS
      const sanitizedText = sanitizeInput(emailText);
      const sanitizedSubject = emailSubject
        ? sanitizeInput(emailSubject)
        : null;

      console.log("Request body:", {
        text: sanitizedText,
        subject: sanitizedSubject,
      }); // Log the request body

      // Call the Next.js API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sanitizedText,
          subject: sanitizedSubject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred while analyzing the email"
        );
        return;
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      setError("An error occurred while analyzing the email");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Paste or type your email subject here... (optional)"
          value={emailSubject}
          onChange={
            (e) => {
              setEmailSubject(e.target.value);
              console.log("emailSubject", e.target.value);
            } // Log the email subject
          }
          className="min-h-[50px] resize-y"
          aria-label="Email Subject for analysis"
        />
        <Textarea
          placeholder="Paste or type your email message here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          className="min-h-[200px] resize-y"
          aria-label="Email content for analysis"
        />

        <div className="flex justify-between items-center">
          <div
            className={`text-sm ${
              wordCount > 2000 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {wordCount} / 2000 words
          </div>

          <Button type="submit" disabled={!isValidInput || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Email"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && !isAnalyzing && !error && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phishing Score</p>
              <p className="text-xl font-bold">{result.score}/100</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Verdict</p>
              <p className="text-xl font-bold">{result.verdict}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Note: {result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
