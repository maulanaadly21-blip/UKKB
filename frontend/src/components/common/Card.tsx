import React, { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-soft ${
        hover ? 'hover:shadow-studio hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
