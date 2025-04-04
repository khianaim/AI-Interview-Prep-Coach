"use server";

import { generateObject } from "ai";
import { db } from "../../../firebase/admin";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";

// Function to dynamically generate questions based on role
function getRoleBasedQuestions(role: string): string[] {
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
            return [];
    }
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    const interviewData = interviews.docs.map((doc) => doc.data() as Interview) || null;
    
    if (interviewData) {
        // Dynamically update questions based on the role for each interview
        interviewData.forEach((interview) => {
            interview.questions = getRoleBasedQuestions(interview.role);
        });
    }
    
    return interviewData;
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;
    console.log('User ID:', userId); // Check user ID being passed
  
    const interviews = await db
        .collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .get();
  
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getInterviewsById(id: string): Promise<Interview | null> {
    const interviews = await db
        .collection('interviews')
        .doc(id)
        .get();

    return interviews.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript } = params;

    try {
        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string; }) => (
                `-${sentence.role}: ${sentence.content}\n`
            )).join('');

        // Feedback generation logic based on the role
        const role = params.role;
        const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
            You are an AI interviewer analyzing a mock interview for the role of ${role}. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. 

            Transcript:
            ${formattedTranscript}

            Please score the candidate in the following areas (adjust based on role):
            - **Technical Knowledge** (for technical roles like Developer or Analyst) or **Behavioral Insights** (for non-technical roles like Product Manager)
            - **Problem-Solving**
            - **Cultural Fit**
            - **Confidence & Clarity**

            Focus on the candidate's fit for the ${role} role.
            `,
        });

        const feedback = await db.collection('feedback').add({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString()
        });

        return {
            success: true,
            feedbackId: feedback.id
        };

    } catch (e) {
        console.error('Error saving feedback', e);
        return { success: false };
    }
};

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;
    
    const feedback = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get();

    if(feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
    } as Feedback;
}

