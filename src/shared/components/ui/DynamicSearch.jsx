import React from "react";
import SearchInput from "./SearchInput";

const DynamicSearch = ({
  value,
  onChange,
  suggestions = [],
  placeholder = "Buscar...",
  label = "Buscar",
  className = "",
  ...props
}) => {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      placeholder={placeholder}
      label={label}
      className={className}
      {...props}
    />
  );
};

export default DynamicSearch;
