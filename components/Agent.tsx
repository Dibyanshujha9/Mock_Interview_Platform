// "use client";

// import Image from 'next/image';
// import React, { useState } from 'react';
// import { cn } from '@/lib/utils';

// enum CallStatus {
//   INACTIVE = 'INACTIVE',
//   CONNECTING = 'CONNECTING',
//   ACTIVE = 'ACTIVE',
//   FINISHED = 'FINISHED',
// }

// interface AgentProps {
//   userName: string;
// }

// const Agent = ({ userName }: AgentProps) => {
//   const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
//   const isSpeaking = true;
//   const messages = [
//     'Whats your name?', 
//     'My name is Dibyanshu Jha, nice to meet you!'
//   ];
//   const lastMessage = messages[messages.length - 1];

//   const handleCall = () => {
//     if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
//       setCallStatus(CallStatus.CONNECTING);
//       // Simulate connection after a delay
//       setTimeout(() => {
//         setCallStatus(CallStatus.ACTIVE);
//       }, 2000);
//     } else if (callStatus === CallStatus.CONNECTING) {
//       // Allow canceling a connection attempt
//       setCallStatus(CallStatus.INACTIVE);
//     }
//   };
  
//   const handleEnd = () => {
//     setCallStatus(CallStatus.FINISHED);
//   };
  
//   return (
//     <>
//       <div className="call-view max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 flex flex-col gap-4">
//         <div className="card-interviewer flex items-center gap-2 p-3 rounded-lg bg-gray-100 w-full sm:w-auto">
//           <div className="avatar relative">
//             <Image
//               src="/ai-avatar.png"
//               alt="Avatar"
//               width={65}
//               height={54}
//               className="object-cover rounded-full"
//             />
//             {isSpeaking && (
//               <span className="animate-speak absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full" />
//             )}
//           </div>
//           <h3 className="text-lg font-medium">AI Interviewer</h3>
//         </div>
        
//         <div className="card-border border rounded-lg p-4 shadow-sm w-full">
//           <div className="card-content flex flex-col sm:flex-row items-center gap-4 justify-center">
//             <Image
//               src="/user-avatar.png"
//               alt="Avatar"
//               width={540}
//               height={540}
//               className="rounded-full object-cover size-[80px] sm:size-[120px]"
//             />
//             <h3 className="text-xl font-medium">{userName}</h3>
//           </div>
//         </div>
        
//         {/* Message display */}
//         {messages.length > 0 && (
//           <div className="transcript-border border rounded-lg p-4 w-full">
//             <div className="transcript max-h-60 overflow-y-auto">
//               <p 
//                 key={lastMessage} 
//                 className={cn(
//                   'transition-opacity duration-500 opacity-0',
//                   'animate-fadeIn opacity-100',
//                   'p-2 text-base sm:text-lg'
//                 )}
//               >
//                 {lastMessage}
//               </p>
//             </div>
//           </div>
//         )}
        
//         <div className="w-full flex justify-center mt-4">
//           {callStatus !== CallStatus.ACTIVE ? (
//             <button 
//               className="relative btn-call bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
//               onClick={handleCall}
//             >
//               <span
//                 className={cn(
//                   "absolute animate-ping rounded-full opacity-75 inline-flex h-full w-full bg-blue-400",
//                   callStatus !== CallStatus.CONNECTING && "hidden"
//                 )}
//               />
//               <span className="relative">
//                 {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
//                   ? "Call"
//                   : ". . ."}
//               </span>
//             </button>
//           ) : (
//             <button 
//               className="btn-disconnected bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
//               onClick={handleEnd}
//             >
//               End
//             </button>
//           )}
//         </div>
//       </div> 
//     </>
//   );
// };

// export default Agent;


"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";

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

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

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
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === CallStatus.FINISHED) {
      router.push(type === "generate" ? "/" : `/interview/${interviewId}/feedback`);
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

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
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
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
