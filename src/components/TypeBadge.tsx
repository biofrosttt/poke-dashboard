import React from 'react';
import { getTypeColor } from '../utils/helpers';

interface Props {
  type: string;
  size?: 'sm' | 'md';
}

const TypeBadge: React.FC<Props> = ({ type, size = 'md' }) => {
  const color = getTypeColor(type);
  return (
    <span
      className={`type-pill ${color.pill} ${size === 'sm' ? 'text-[9px] px-2 py-0.5' : ''}`}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
