// src/features/tickets/components/ConversationBubble.jsx
import React from "react";

const ConversationBubble = ({ message }) => {
  const { from, author, text, timestamp } = message;
  const isCustomer = from === "customer";

  const bubbleAlignment = isCustomer ? "items-start" : "items-end";
  // Customer: Glassmorphism dark. Agent: Electric Violet Gradient.
  const bubbleColor = isCustomer 
    ? "bg-white/5 border border-white/10 backdrop-blur-sm" 
    : "bg-gradient-to-br from-dt-accent to-dt-accent-hover shadow-glow border border-transparent";
  
  const textColor = "text-dt-foreground";

  return (
    <div className={`flex flex-col mb-6 ${bubbleAlignment} group`}>
      <div className={`max-w-xl rounded-2xl p-5 ${bubbleColor} transition-transform duration-200 hover:scale-[1.01]`}>
        <p className={`text-sm leading-relaxed ${textColor}`}>{text}</p>
      </div>
      <div className="mt-2 px-2 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-wider text-dt-subtle">
          {author}
        </span>
        <span className="text-[10px] text-dt-subtle font-mono">
            {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ConversationBubble;
