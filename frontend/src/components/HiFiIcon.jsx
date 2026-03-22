
const HiFiIcon = ({ size = 36, flat = false }) => {
  const r = Math.round(size * 0.275); 

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!flat && (
        <defs>
          <linearGradient id="hifi-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B7FFF" />
            <stop offset="1" stopColor="#5A4FE0" />
          </linearGradient>
        </defs>
      )}

     
      <rect
        width="80"
        height="80"
        rx="22"
        fill={flat ? "#6C63FF" : "url(#hifi-grad)"}
      />

      
      <rect
        x="13"
        y="14"
        width="54"
        height="37"
        rx="12"
        fill="white"
        fillOpacity="0.15"
      />
      <rect
        x="13"
        y="14"
        width="54"
        height="37"
        rx="12"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />

      
      <circle cx="29" cy="33" r="4.5" fill="white" />
      <circle cx="40" cy="33" r="4.5" fill="white" />
      <circle cx="51" cy="33" r="4.5" fill="white" />

      
      <path
        d="M33 51 L40 62 L47 51"
        fill={flat ? "#6C63FF" : "url(#hifi-grad)"}
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default HiFiIcon;