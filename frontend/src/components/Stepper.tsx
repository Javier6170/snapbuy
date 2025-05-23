import React from 'react';

interface StepperProps {
  steps: string[];
  current: number; // índice 0-based
}

const Stepper: React.FC<StepperProps> = ({ steps, current }) => (
  <div className="flex items-center mb-8">
    {steps.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center 
              ${i <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
            `}
          >
            {i + 1}
          </div>
          <span className="mt-2 text-xs">{label}</span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-2 ${
              i < current ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default Stepper;