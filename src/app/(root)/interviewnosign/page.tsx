"use client";

import React, { useState } from "react";
import Agent from "@/components/agent";
import { motion } from "framer-motion";

// Function to dynamically generate interview questions based on role
const getRoleBasedQuestions = (role: string): string[] => {
  switch (role) {
    case "Frontend Developer":
      return ["What is React?", "Explain the concept of virtual DOM."];
    case "Full Stack Developer":
      return ["What is Node.js?", "How would you create an API in Express?"];
    case "Product Manager":
      return ["How do you prioritize tasks?", "Tell me about a time when you had to manage conflicting priorities."];
    case "Data Analyst":
      return ["How do you clean data in Python?", "What is your experience with SQL?"];
    case "UX Designer":
      return ["How do you approach user research?", "What’s your design process?"];
    default:
      return ["Tell me about your experience and skills in the role you're applying for.", "Why do you think you're a good fit for this role?"];
  }
};

// Function to evaluate user responses
const evaluatePerformance = (answers: string[], questions: string[]): string => {
  let score = 0;
  answers.forEach((answer, index) => {
    // Simple evaluation logic: Check for the presence of key terms in the answer
    if (answer.toLowerCase().includes("react") && questions[index].includes("React")) {
      score++;
    } else if (answer.toLowerCase().includes("node.js") && questions[index].includes("Node.js")) {
      score++;
    }
    // Add more simple checks based on your needs
  });

  // Return a basic feedback based on score
  if (score === answers.length) {
    return "Great job! You're on the right track. Your answers were very relevant and comprehensive.";
  } else if (score >= answers.length / 2) {
    return "Good job! You have some great knowledge but could improve on a few areas.";
  } else {
    return "Needs improvement. Try to focus more on the core concepts of the questions.";
  }
};

const Page = () => {
  const [role, setRole] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]); // Store answers for evaluation
  const [interviewComplete, setInterviewComplete] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Generate questions based on the role
    const generatedQuestions = getRoleBasedQuestions(role);
    setQuestions(generatedQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleInterviewComplete = () => {
    // After the interview is complete, evaluate performance
    const evalResult = evaluatePerformance(answers, questions);
    setEvaluation(evalResult);
    setInterviewComplete(true);
  };

  return (
    <>
      {/* User Input for Role and Experience */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">MOCK INTERVIEW WITH AUMI</h3>

        <form onSubmit={handleSubmit} className=" mt-6 space-y-4">
          {/* Role Input */}
          <div>
            <label htmlFor="role" className="block font-medium">What role are you looking for?</label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
              placeholder="e.g., Frontend Developer"
              required
            />
          </div>

          {/* Experience Input */}
          <div>
            <label htmlFor="experience" className="block font-medium">Tell us about your experience:</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
              rows={4}
              placeholder="Describe your experience and relevant skills."
              required
            />
          </div>

          <motion.button type="submit"  style={{
      animation: "glowing 5s ease-in-out infinite",
    }} className="mt-6 bg-black text-white p-2 rounded-full">Start Interview</motion.button>
        </form>
      </div>

      {/* Displaying Interview Details and Agent */}
      {questions.length > 0 && !interviewComplete && (
        <>
          <div className="flex flex-row gap-4 justify-between mt-10">
            <div className="flex flex-row gap-4 items-center">
              <h3 className="capitalize">
                Trial Interview for {role}
              </h3>
            </div>
          </div>

          {/* Agent Component for Mock Interview */}
          <Agent
            userName="Guest"
            userId="mockUserId"
            interviewId="mockInterviewId"
            type="interview"
            questions={questions}
            onComplete={handleInterviewComplete} // Trigger when interview is complete
            onAnswerChange={handleAnswerChange} // Capture the user's answers
          />
        </>
      )}

    </>
  );
};

export default Page;
