import React, { useEffect, useRef, useState } from 'react';
import { statColors, statNames } from '../utils/helpers';

interface Props {
  name: string;
  value: number;
  delay?: number;
}

const StatBar: React.FC<Props> = ({ name, value, delay = 0 }) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pct = Math.min((value / 255) * 100, 100);
  const colorClass = statColors(value);
  const shortName = statNames[name] ?? name.toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-mono text-white/40 tracking-wider">{shortName}</span>
        <span className="text-sm font-mono font-medium text-white/80">{value}</span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} stat-bar-fill`}
          style={{
            '--target-width': `${pct}%`,
            width: animated ? `${pct}%` : '0%',
            transition: animated ? `width 1s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms` : 'none',
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default StatBar;
