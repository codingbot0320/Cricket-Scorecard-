import { useEffect, useState } from 'react';

interface ConfettiCelebrationProps {
  type: 'four' | 'six' | 'wicket';
  show: boolean;
  onComplete: () => void;
}

const ConfettiCelebration = ({ type, show, onComplete }: ConfettiCelebrationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = type === 'four' 
        ? ['#9333ea', '#a855f7', '#c084fc'] 
        : type === 'six' 
        ? ['#f59e0b', '#f97316', '#ea580c']
        : ['#dc2626', '#ef4444', '#f87171'];
      
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, type, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-celebration-burst"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            borderRadius: '50%',
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiCelebration;