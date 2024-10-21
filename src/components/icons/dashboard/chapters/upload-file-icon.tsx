const UploadFileIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="30"
      height="31"
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.25 3H16.5909C20.6674 3 22.7057 3 24.1212 3.99729C24.5267 4.28304 24.8868 4.62191 25.1904 5.00361C26.25 6.33584 26.25 8.2542 26.25 12.0909V15.2727C26.25 18.9767 26.25 20.8287 25.6638 22.3078C24.7215 24.6857 22.7286 26.5614 20.202 27.4483C18.6305 28 16.6627 28 12.7273 28C10.4784 28 9.35402 28 8.45597 27.6848C7.01224 27.1779 5.87344 26.1061 5.33495 24.7473C5 23.9021 5 22.8438 5 20.7273V15.5"
        stroke="#2B3674"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.25 15.5C26.25 17.8012 24.3845 19.6667 22.0833 19.6667C21.2511 19.6667 20.27 19.5208 19.4608 19.7377C18.7419 19.9303 18.1803 20.4919 17.9877 21.2108C17.7708 22.02 17.9167 23.0011 17.9167 23.8333C17.9167 26.1345 16.0512 28 13.75 28"
        stroke="#2B3674"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7505 8L3.75049 8M8.75049 3V13"
        stroke="#2B3674"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default UploadFileIcon;
