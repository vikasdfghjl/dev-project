import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const RssIconComponent: React.FC<IconProps> = props => (
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
      d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.869 0 14.25 6.381 14.25 14.25v.75M6 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
    />
  </svg>
);
export const RssIcon = React.memo(RssIconComponent);
