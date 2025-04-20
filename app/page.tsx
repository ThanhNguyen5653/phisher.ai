import { Suspense } from "react";
import EmailAnalyzer from "@/components/email-analyzer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Email Phishing Analyzer
          </CardTitle>
          <CardDescription className="text-center">
            Paste or type an email message to analyze it for phishing attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="flex justify-center p-8">Loading...</div>}
          >
            <EmailAnalyzer />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
