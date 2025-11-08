// src/features/tickets/components/ConversationBubble.jsx
import React from "react";

const ConversationBubble = ({ message }) => {
  const { from, author, text, timestamp } = message;
  const isCustomer = from === "customer";

  const bubbleAlignment = isCustomer ? "items-start" : "items-end";
  const bubbleColor = isCustomer ? "bg-secondary" : "bg-blue-600";
  const textColor = isCustomer ? "text-foreground" : "text-white";

  return (
    <div className={`flex flex-col mb-4 ${bubbleAlignment}`}>
      <div className={`max-w-xl rounded-lg p-4 ${bubbleColor}`}>
        <p className={`text-sm ${textColor}`}>{text}</p>
      </div>
      <div className="mt-1">
        <span className="text-xs text-subtle">
          {author} &bull; {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ConversationBubble;
