import React from "react";

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  lines = 1,
  height = "h-4",
  width = "w-full",
}) => {
  if (lines === 1) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${height} ${width}`}
        />
      ))}
    </div>
  );
};

// simple card skeleton for loading states
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <Skeleton height="h-6" width="w-3/4" />
    <Skeleton lines={3} height="h-4" />
    <Skeleton height="h-8" width="w-1/2" />
  </div>
);

export default Skeleton;
