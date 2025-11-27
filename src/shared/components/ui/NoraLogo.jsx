const NoraLogo = ({ collapsed = false }) => {
  if (collapsed) {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1" />
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="currentColor"
        >
          N
        </text>
      </svg>
    );
  }

  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fondo */}
      <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1" />
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />

      {/* Letra N */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="currentColor"
      >
        N
      </text>

      {/* Texto "Nora AI" */}
      <text
        x="48"
        y="28"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Nora AI
      </text>
    </svg>
  );
};

export default NoraLogo;
