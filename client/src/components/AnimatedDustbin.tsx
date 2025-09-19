import { motion } from 'framer-motion';
import { type Bin } from '@shared/schema';

interface AnimatedDustbinProps {
  bin: Bin;
  className?: string;
}

export default function AnimatedDustbin({ bin, className = '' }: AnimatedDustbinProps) {
  const fillLevel = bin.fillLevel;
  const status = bin.status;
  
  // Calculate colors based on status
  const getColors = () => {
    switch (status) {
      case 'alert':
        return {
          bin: '#ef4444', // red-500
          fill: '#dc2626', // red-600
          lid: '#991b1b', // red-800
          glow: '#fecaca', // red-200
          text: '#dc2626', // red-600
        };
      case 'warning':
        return {
          bin: '#f97316', // orange-500
          fill: '#ea580c', // orange-600
          lid: '#9a3412', // orange-800
          glow: '#fed7aa', // orange-200
          text: '#ea580c', // orange-600
        };
      default:
        return {
          bin: '#10b981', // emerald-500
          fill: '#059669', // emerald-600
          lid: '#064e3b', // emerald-800
          glow: '#a7f3d0', // emerald-200
          text: '#059669', // emerald-600
        };
    }
  };

  const colors = getColors();
  const fillHeight = (fillLevel / 100) * 180; // 180px is the max fill height

  return (
    <div className={`animated-dustbin-container ${className}`}>
      {/* Grid layout to separate dustbin from data points */}
      <div className="grid grid-cols-3 grid-rows-3 gap-8 items-center justify-items-center w-full h-full">
        {/* Top Row */}
        {/* Fill Level Data Point - Top Left */}
        <motion.div
          className="data-point-card rounded-lg px-3 py-2 border-2 shadow-lg"
          style={{
            borderColor: colors.fill,
            color: colors.text,
          }}
          animate={{
            y: [-3, 3, -3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-sm font-bold flex items-center space-x-1">
            <span>📊</span>
            <span>{fillLevel.toFixed(1)}%</span>
          </div>
          <div className="text-xs opacity-70">Fill Level</div>
        </motion.div>

        {/* Empty space - Top Center */}
        <div></div>

        {/* Status Data Point - Top Right */}
        <motion.div
          className="data-point-card rounded-lg px-3 py-2 border-2 shadow-lg"
          style={{
            borderColor: colors.fill,
            color: colors.text,
          }}
          animate={{
            y: [3, -3, 3],
            scale: [1.05, 0.95, 1.05],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="text-sm font-bold flex items-center space-x-1">
            <span>⚡</span>
            <span>{status.toUpperCase()}</span>
          </div>
          <div className="text-xs opacity-70">Status</div>
        </motion.div>

        {/* Middle Row */}
        {/* Empty space - Middle Left */}
        <div></div>

        {/* Dustbin - Center */}
        <div className="relative flex items-center justify-center">
          {/* Glow effect for alerts */}
          {status === 'alert' && (
            <motion.div
              className="absolute inset-0 rounded-full blur-xl opacity-30 z-0"
              style={{ backgroundColor: colors.glow }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <svg
            width="200"
            height="280"
            viewBox="0 0 200 280"
            className="drop-shadow-lg relative z-10"
          >
            {/* Dustbin body */}
            <motion.rect
              x="50"
              y="70"
              width="100"
              height="190"
              rx="8"
              ry="8"
              fill={colors.bin}
              stroke="#374151"
              strokeWidth="3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Fill level indicator */}
            <motion.rect
              x="55"
              y={255 - fillHeight}
              width="90"
              height={fillHeight}
              rx="4"
              ry="4"
              fill={colors.fill}
              opacity={0.9}
              initial={{ height: 0, y: 255 }}
              animate={{ height: fillHeight, y: 255 - fillHeight }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
                type: "spring",
                stiffness: 120
              }}
            />

            {/* Dustbin lid */}
            <motion.ellipse
              cx="100"
              cy="70"
              rx="60"
              ry="15"
              fill={colors.lid}
              stroke="#374151"
              strokeWidth="3"
              animate={status === 'alert' ? {
                y: [0, -4, 0],
              } : {}}
              transition={{
                duration: 0.8,
                repeat: status === 'alert' ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            {/* Lid handle */}
            <motion.rect
              x="95"
              y="50"
              width="10"
              height="25"
              rx="5"
              fill={colors.lid}
              stroke="#374151"
              strokeWidth="2"
              animate={status === 'alert' ? {
                y: [0, -4, 0],
              } : {}}
              transition={{
                duration: 0.8,
                repeat: status === 'alert' ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            {/* Fill level percentage text */}
            <text
              x="100"
              y="175"
              textAnchor="middle"
              className="fill-white font-bold text-xl"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
            >
              {fillLevel.toFixed(1)}%
            </text>

            {/* Status indicator LED */}
            <motion.circle
              cx="170"
              cy="90"
              r="8"
              fill={colors.fill}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: status === 'alert' ? 0.6 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <circle
              cx="170"
              cy="90"
              r="12"
              fill="none"
              stroke={colors.fill}
              strokeWidth="2"
              opacity={0.6}
            />

            {/* Bubbling particles for high fill levels */}
            {fillLevel > 70 && (
              <>
                <motion.circle
                  cx="70"
                  cy={245 - fillHeight + 20}
                  r="3"
                  fill={colors.glow}
                  animate={{
                    y: [-8, -25, -8],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />
                <motion.circle
                  cx="100"
                  cy={245 - fillHeight + 25}
                  r="2"
                  fill={colors.glow}
                  animate={{
                    y: [-8, -25, -8],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.8,
                  }}
                />
                <motion.circle
                  cx="130"
                  cy={245 - fillHeight + 15}
                  r="2.5"
                  fill={colors.glow}
                  animate={{
                    y: [-8, -25, -8],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 1.6,
                  }}
                />
              </>
            )}
          </svg>
        </div>

        {/* Empty space - Middle Right */}
        <div></div>

        {/* Bottom Row */}
        {/* Location Data Point - Bottom Left */}
        <motion.div
          className="data-point-card rounded-lg px-3 py-2 border-2 shadow-lg"
          style={{
            borderColor: colors.fill,
            color: colors.text,
          }}
          animate={{
            x: [-2, 2, -2],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="text-sm font-bold flex items-center space-x-1">
            <span>🏠</span>
            <span className="max-w-32 truncate text-xs">{bin.location}</span>
          </div>
          <div className="text-xs opacity-70">Location</div>
        </motion.div>

        {/* Empty space - Bottom Center */}
        <div></div>

        {/* Threshold Data Point - Bottom Right */}
        <motion.div
          className="data-point-card rounded-lg px-3 py-2 border-2 shadow-lg"
          style={{
            borderColor: colors.fill,
            color: colors.text,
          }}
          animate={{
            scale: [0.92, 1.08, 0.92],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <div className="text-sm font-bold flex items-center space-x-1">
            <span>🎯</span>
            <span>{bin.alertThreshold}%</span>
          </div>
          <div className="text-xs opacity-70">Alert Level</div>
        </motion.div>
      </div>

      {/* Dustbin name and real-time indicator */}
      <div className="mt-6 text-center space-y-3">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {bin.name}
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Live Data
          </span>
        </div>
      </div>
    </div>
  );
}