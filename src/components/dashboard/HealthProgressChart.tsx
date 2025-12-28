import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { healthRecoveryData } from '@/lib/healthMilestones';
import { TrendingUp, Heart, Wind, Activity } from 'lucide-react';

interface HealthProgressChartProps {
  hoursSinceQuit: number;
}

const HealthProgressChart: React.FC<HealthProgressChartProps> = ({ hoursSinceQuit }) => {
  // Determine current progress point based on hours
  // Index 0 = Start (baseline), Index 1 = 20min, etc.
  const getCurrentDataIndex = () => {
    if (hoursSinceQuit < 0.33) return 0; // Less than 20 min = baseline
    if (hoursSinceQuit < 8) return 1;    // 20 min - 8 hr
    if (hoursSinceQuit < 24) return 2;   // 8 hr - 24 hr
    if (hoursSinceQuit < 48) return 3;   // 24 hr - 48 hr
    if (hoursSinceQuit < 72) return 4;   // 48 hr - 72 hr
    if (hoursSinceQuit < 168) return 5;  // 72 hr - 1 wk
    if (hoursSinceQuit < 336) return 6;  // 1 wk - 2 wk
    if (hoursSinceQuit < 720) return 7;  // 2 wk - 1 mo
    if (hoursSinceQuit < 2160) return 8; // 1 mo - 3 mo
    if (hoursSinceQuit < 4320) return 9; // 3 mo - 6 mo
    if (hoursSinceQuit < 6480) return 10; // 6 mo - 9 mo
    if (hoursSinceQuit < 8760) return 11; // 9 mo - 1 yr
    if (hoursSinceQuit < 43800) return 12; // 1 yr - 5 yr
    return 13; // 5+ years
  };

  const currentIndex = getCurrentDataIndex();
  const displayData = healthRecoveryData.slice(0, currentIndex + 2);

  // Calculate current health metrics
  const currentData = healthRecoveryData[Math.min(currentIndex, healthRecoveryData.length - 1)];
  
  const healthMetrics = [
    {
      label: 'Heart Health',
      value: currentData.heartRate,
      icon: Heart,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Oxygen Levels',
      value: currentData.oxygen,
      icon: Wind,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Lung Function',
      value: currentData.lungFunction,
      icon: Activity,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Circulation',
      value: currentData.circulation,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {healthMetrics.map((metric) => (
          <div key={metric.label} className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold">{metric.value}%</span>
              <span className="text-xs text-muted-foreground mb-1">recovered</span>
            </div>
            <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${metric.value}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="glass-panel-strong p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Health Recovery Timeline
        </h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLung" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCirc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="lungFunction"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLung)"
                name="Lung Function"
              />
              <Area
                type="monotone"
                dataKey="circulation"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCirc)"
                name="Circulation"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Lung Function</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">Circulation</span>
          </div>
        </div>
      </div>

      {/* Risk Reduction Card */}
      <div className="glass-panel p-4">
        <h4 className="font-medium mb-3 text-sm">Disease Risk Reduction</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Heart Attack Risk</span>
              <span className="font-medium text-success">
                {hoursSinceQuit >= 8760 ? '-50%' : hoursSinceQuit >= 24 ? '-10%' : 'Improving'}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-success transition-all duration-1000"
                style={{ width: `${Math.min(100, hoursSinceQuit >= 8760 ? 100 : (hoursSinceQuit / 8760) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Stroke Risk</span>
              <span className="font-medium text-primary">
                {hoursSinceQuit >= 43800 ? 'Normal' : hoursSinceQuit >= 17520 ? '-40%' : 'Improving'}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${Math.min(100, hoursSinceQuit >= 43800 ? 100 : (hoursSinceQuit / 43800) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Lung Cancer Risk</span>
              <span className="font-medium text-warning">
                {hoursSinceQuit >= 87600 ? '-50%' : hoursSinceQuit >= 43800 ? '-30%' : 'Improving'}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-warning transition-all duration-1000"
                style={{ width: `${Math.min(100, hoursSinceQuit >= 87600 ? 100 : (hoursSinceQuit / 87600) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProgressChart;
