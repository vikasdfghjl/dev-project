import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const ExternalLinkIconComponent: React.FC<IconProps> = props => (
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
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6L21 6m0 0v7.5m0-7.5L13.5 13.5"
    />
  </svg>
);
export const ExternalLinkIcon = React.memo(ExternalLinkIconComponent);
