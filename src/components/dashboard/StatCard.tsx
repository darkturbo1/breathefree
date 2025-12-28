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

  const bgClasses = {
    default: 'bg-secondary',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    primary: 'bg-primary/10',
  };

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${bgClasses[color]}`}>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]} tabular-nums`}>{value}</p>
      {subvalue && (
        <p className="text-xs text-muted-foreground mt-1">{subvalue}</p>
      )}
    </div>
  );
};

export default StatCard;
