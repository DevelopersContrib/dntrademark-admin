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
      className={`group rounded-2xl border p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-4 ${
        isGradient
          ? `${bgCard} border-transparent text-white`
          : 'border-stroke/70 bg-white dark:border-strokedark/70 dark:bg-boxdark'
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          isGradient
            ? 'bg-white/20 text-white'
            : 'bg-brand/10 text-brand dark:bg-brand/15'
        }`}
      >
        {children}
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <h4
            className={`text-3xl font-bold tracking-tight ${
              isGradient ? 'text-white' : 'text-black dark:text-white'
            }`}
          >
            {total}
          </h4>
          <span
            className={`mt-1 block text-sm font-medium ${
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
