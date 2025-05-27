
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const TrashIconComponent: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.094M5.25 6H4.372c-.51 0-.963.228-1.29.595a1.875 1.875 0 00-.317 2.241l.137.388c.16.44.503.806.945 1.025c.44.22.956.332 1.486.332H19.5c.53 0 1.046-.112 1.486-.332a1.875 1.875 0 00.945-1.025l.137-.388a1.875 1.875 0 00-.317-2.241A1.875 1.875 0 0019.628 6h-.879M5.25 6V5.25c0-.828.672-1.5 1.5-1.5h5.5c.828 0 1.5.672 1.5 1.5V6m-8.5 0h7.5" />
  </svg>
);
export const TrashIcon = React.memo(TrashIconComponent);
