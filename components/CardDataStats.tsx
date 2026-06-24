import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
  bgCard?: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  bgCard,
  children,
}) => {
  const isGradient = Boolean(bgCard);

  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border p-4 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-4 ${
        isGradient
          ? `${bgCard} border-transparent text-white`
          : 'border-stroke/70 bg-white dark:border-strokedark/70 dark:bg-boxdark'
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isGradient
            ? 'bg-white/20 text-white'
            : 'bg-brand/10 text-brand dark:bg-brand/15'
        }`}
      >
        {children}
      </div>

      <div className="flex min-w-0 flex-1 items-end justify-between">
        <div className="min-w-0">
          <h4
            className={`text-2xl font-bold tracking-tight ${
              isGradient ? 'text-white' : 'text-black dark:text-white'
            }`}
          >
            {total}
          </h4>
          <span
            className={`mt-0.5 block truncate text-sm font-medium ${
              isGradient ? 'text-white/80' : 'text-body dark:text-bodydark'
            }`}
          >
            {title}
          </span>
        </div>

        {rate ? (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              levelUp && 'text-meta-3'
            } ${levelDown && 'text-meta-5'}`}
          >
            {rate}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default CardDataStats;
