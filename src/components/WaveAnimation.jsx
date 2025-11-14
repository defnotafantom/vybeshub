import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Image, Video, Music } from 'lucide-react';

const Bubble = ({ onExplode }) => {
  const controls = useAnimation();
  const duration = useMemo(() => Math.random() * 8 + 7, []); // 7-15s
  const size = useMemo(() => Math.random() * 60 + 40, []); // 40-100px
  const x = useMemo(() => Math.random() * 100, []);
  const type = useMemo(() => (Math.random() > 0.3 ? 'image' : 'video'), []);
  const icon = useMemo(() => {
    if (type === 'video') return <Video className="w-1/2 h-1/2 text-white/50" />;
    return <Image className="w-1/2 h-1/2 text-white/50" />;
  }, [type]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        y: '-100vh',
        x: `${Math.random() * 40 - 20}vw`,
        opacity: [0.8, 1, 1, 0.8],
        scale: [1, 1.05, 1],
        transition: {
          y: { duration: duration, ease: 'linear' },
          x: { duration: duration, ease: 'easeInOut' },
          opacity: { duration: duration, repeat: Infinity },
          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
        },
      });
      onExplode();
    };
    sequence();
  }, [controls, duration, onExplode]);

  const handleExplode = () => {
    onExplode();
    controls.stop();
  };

  const videoExplosionTime = type === 'video' ? 10000 : undefined;

  return (
    <motion.div
      className="absolute bottom-[-100px]"
      style={{
        left: `${x}vw`,
        width: size,
        height: size,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={controls}
      onTap={handleExplode}
      onViewportLeave={handleExplode}
      {...(videoExplosionTime && { onAnimationComplete: () => setTimeout(handleExplode, videoExplosionTime) })}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400/50 to-blue-500/50 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
        {icon}
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
          alt={type === 'image' ? 'Abstract artistic visual' : 'Video thumbnail placeholder'}
          style={{ display: 'none' }} // Placeholder
         src="https://images.unsplash.com/photo-1689608667123-9d167fdfb873" />
      </div>
    </motion.div>
  );
};

const WaveAnimation = () => {
  const [bubbles, setBubbles] = React.useState([]);

  const addBubble = () => {
    const id = Date.now() + Math.random();
    setBubbles((prev) => [...prev, { id, component: <Bubble key={id} onExplode={() => removeBubble(id)} /> }]);
  };
  
  const removeBubble = (id) => {
    setBubbles((prev) => prev.filter(b => b.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
        if (bubbles.length < 10) {
            addBubble();
        }
    }, 1500);
    return () => clearInterval(interval);
  }, [bubbles.length]);


  return (
    <div className="absolute bottom-0 left-0 w-full h-40 overflow-visible pointer-events-none">
      {/* Wave SVG */}
      <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: 'rgb(56 189 248)', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: 'rgb(37 99 235)', stopOpacity:1}} />
          </linearGradient>
        </defs>
        <motion.path 
          fill="url(#waveGradient)" 
          fillOpacity="0.7"
          d="M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,186.7C672,171,768,181,864,197.3C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,186.7C672,171,768,181,864,197.3C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,224C672,245,768,235,864,208C960,181,1056,139,1152,144C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,186.7C672,171,768,181,864,197.3C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-auto">
        {bubbles.map(b => b.component)}
      </div>
    </div>
  );
};

export default WaveAnimation;