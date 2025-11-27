import React from "react";
import { Link } from "react-router-dom";

const QueueLinkCard = ({ title, count, linkTo, description }) => {
  return (
    <Link
      to={linkTo}
      className="block bg-dt-primary p-6 rounded-lg border border-secondary hover:border-accent hover:shadow-lg transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-dt-foreground">{title}</h3>
        <span className="text-2xl font-bold text-accent">{count}</span>
      </div>
      <p className="text-sm text-dt-subtle mt-2">{description}</p>
    </Link>
  );
};

export default QueueLinkCard;
