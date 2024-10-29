const EditIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_116_6327)">
        <mask
          id="mask0_116_6327"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="15"
          height="15"
        >
          <path d="M0 4.3869e-05H15V15H0V4.3869e-05Z" fill="white" />
        </mask>
        <g mask="url(#mask0_116_6327)">
          <path
            d="M8.05662 2.84183H1.61132C0.9641 2.84183 0.439453 3.36648 0.439453 4.0137V13.3887C0.439453 14.0359 0.9641 14.5605 1.61132 14.5605H10.9863C11.6335 14.5605 12.1582 14.0359 12.1582 13.3887V6.94338"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.3892 2.26908L7.76008 8.89816L5.68848 9.3125L6.10279 7.24089L12.7319 0.611794C12.9607 0.382986 13.3317 0.382986 13.5605 0.611794L14.3892 1.44045C14.618 1.66926 14.618 2.04025 14.3892 2.26908Z"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.9033 1.4404L13.5606 3.09766"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_116_6327">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default EditIcon;
