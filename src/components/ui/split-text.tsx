
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type SplitTextProps = {
  children: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  type?: 'words' | 'chars' | 'both';
  animation?: 'fade' | 'reveal' | 'none';
};

export const SplitText = ({
  children,
  className = '',
  wordClassName = '',
  charClassName = '',
  type = 'chars',
  animation = 'reveal',
}: SplitTextProps) => {
  // Basic animations for each char
  const fadeAnimation = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const revealAnimation = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.03,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // Choose animation based on prop
  const selectedAnimation = animation === 'fade' ? fadeAnimation : 
                           animation === 'reveal' ? revealAnimation : 
                           null;

  if (type === 'words') {
    const words = children.split(' ');
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {words.map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            className={`inline-block ${wordClassName}`}
            custom={wordIndex}
            variants={selectedAnimation}
          >
            {word}
            {wordIndex !== words.length - 1 && ' '}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  if (type === 'chars') {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {children.split('').map((char, charIndex) => (
          <motion.span
            key={charIndex}
            className={`inline-block ${charClassName}`}
            custom={charIndex}
            variants={selectedAnimation}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Both words and chars
  const words = children.split(' ');
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.03,
          },
        },
      }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className={`inline-block ${wordClassName}`}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className={`inline-block ${charClassName}`}
              custom={charIndex + wordIndex * 5} // to create a natural staggering effect
              variants={selectedAnimation}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex !== words.length - 1 && (
            <span>&nbsp;</span>
          )}
        </motion.span>
      ))}
    </motion.div>
  );
};
