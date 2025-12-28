import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  color?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subvalue,
  color = 'default',
  className = '',
}) => {
  const colorClasses = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    primary: 'text-primary',
  };

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl bg-${color === 'default' ? 'secondary' : color}/10`}>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
      {subvalue && (
        <p className="text-xs text-muted-foreground mt-1">{subvalue}</p>
      )}
    </div>
  );
};

export default StatCard;
