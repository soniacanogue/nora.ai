import React from "react";
import Button from "@/shared/components/ui/Button";

const PageHeader = ({ icon: Icon, title, description, action, children, className = "" }) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-2xl text-dt-accent" />}
        <div>
          <h1 className="text-2xl font-bold text-dt-foreground">{title}</h1>
          {description && <p className="text-sm text-dt-subtle">{description}</p>}
        </div>
      </div>

      {action ? (
        <Button
          onClick={action.onClick}
          variant={action.variant || "primary"}
          icon={action.icon}
          size={action.size || "md"}
          fullWidth={false}
        >
          {action.label}
        </Button>
      ) : (
        children
      )}
    </div>
  );
};

export default PageHeader;
