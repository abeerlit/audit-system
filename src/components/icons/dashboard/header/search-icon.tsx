const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="11"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="4.3" stroke="#2B3674" strokeWidth="1.4" />
      <line
        x1="10.0101"
        y1="11"
        x2="8"
        y2="8.98995"
        stroke="#2B3674"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SearchIcon;
