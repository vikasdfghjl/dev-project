import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const CardViewIconComponent: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25v13.5M8.25 5.25v13.5m5.25-13.5v13.5m5.25-13.5v13.5"
      transform="rotate(90 12 12) translate(0 24) scale(1 -1)"
    />{" "}
    {/* Simplified grid using lines, or use rects */}
  </svg>
);
export const CardViewIcon = React.memo(CardViewIconComponent);
