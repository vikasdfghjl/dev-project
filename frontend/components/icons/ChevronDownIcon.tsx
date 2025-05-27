
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const ChevronDownIconComponent: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
export const ChevronDownIcon = React.memo(ChevronDownIconComponent);
