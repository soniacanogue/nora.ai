// src/components/tickets/ConversationBubble.jsx
import React from 'react';
import clsx from 'clsx';

const ConversationBubble = ({ message }) => {
  const isCustomer = message.from === 'customer';

  const bubbleClasses = clsx(
    'p-4 rounded-lg max-w-[80%]',
    {
      'bg-secondary self-start text-left': isCustomer,
      'bg-accent bg-opacity-20 self-end text-right': !isCustomer,
    }
  );

  const wrapperClasses = clsx(
    'flex flex-col mb-4',
    { 'items-start': isCustomer, 'items-end': !isCustomer }
  );

  return (
    <div className={wrapperClasses}>
      <div className="text-sm text-subtle mb-1">
        {isCustomer ? message.author : 'Nora AI'}
      </div>
      <div className={bubbleClasses}>
        <p className="text-foreground whitespace-pre-wrap">{message.text}</p>
      </div>
      <div className="text-xs text-subtle mt-1">
        {new Date(message.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default ConversationBubble;