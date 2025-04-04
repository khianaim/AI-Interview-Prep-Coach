"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Message {
  type: string;
  transcriptType?: string;
  role: "user" | "assistant" | "system";
  transcript?: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
  interviewId?: string;
  questions?: string[];
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [currentCallStatus, setCurrentCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCurrentCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCurrentCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript || "" };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        setIsAiSpeaking(true);
      } else if (lastMessage?.role === "user") {
        setIsUserSpeaking(true);
      }
    };

    const onSpeechEnd = () => {
      setIsAiSpeaking(false);
      setIsUserSpeaking(false);
    };

    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [messages]);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generate feedback here.");

    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages
    });

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log("Error saving feedback");
      router.push("/");
    }
  };

  useEffect(() => {
    if (currentCallStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, currentCallStatus, type, userId]);

  const handleCall = async () => {
    setCurrentCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";

      if (questions) {
        formattedQuestions = questions.map((question) => `- ${question}`).join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          question: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCurrentCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  // Filter messages based on role
  const aiMessages = messages.filter((msg) => msg.role === "assistant");
  const userMessages = messages.filter((msg) => msg.role === "user");

  const latestAiMessage = aiMessages[aiMessages.length - 1]?.content;
  const latestUserMessage = userMessages[userMessages.length - 1]?.content;

  const isCallInactiveOrFinished =
    currentCallStatus === CallStatus.INACTIVE || currentCallStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        {/* AI Avatar + AI Transcript */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.svg" alt="vapi" width={85} height={65} className="object-cover" />
            {isAiSpeaking && <span className="animate-speak" />}
          </div>
          <h3>Alexi</h3>

          {/* AI Transcript */}
          {aiMessages.length > 0 && (
            <div className="transcript-border mt-2">
              <div className="transcript">
                <p className="text-sm text-center font-bold bg-gradient-to-r from-purple-500 via-blue-500 via-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100">
                  {latestAiMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar + User Transcript */}
        <div className="card-border">
          <div className="card-content">
            <Image src="/user-avatar.svg" alt="user-avatar" width={120} height={120} className="rounded-full object-cover" />
            {isUserSpeaking && <span className="animate-speak" />}
            <h3>{userName}</h3>

            {/* User Transcript */}
            {userMessages.length > 0 && (
              <div className="transcript-border mt-2">
                <div className="transcript">
                  <p className="text-sm text-center font-bold bg-gradient-to-r from-purple-500 via-blue-500 via-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100">
                    {latestUserMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="w-full flex justify-center mt-4">
        {currentCallStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span className={cn("absolute animate-ping rounded-full opacity-75", currentCallStatus !== CallStatus.CONNECTING && "hidden")} />
            <span>{isCallInactiveOrFinished ? "Call" : "..."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
