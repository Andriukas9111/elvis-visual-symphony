
import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Apply positions directly for smoother movement
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
      
      // The dot follows with a slight delay via CSS transition
      cursorDot.style.left = `${clientX}px`;
      cursorDot.style.top = `${clientY}px`;
      
      const isOverLink = (e.target as HTMLElement).tagName === 'A' || 
        (e.target as HTMLElement).tagName === 'BUTTON' ||
        (e.target as HTMLElement).classList.contains('cursor-pointer');
      
      cursor.classList.toggle('scale-lg', isOverLink);
      cursorDot.classList.toggle('opacity-0', isOverLink);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-white opacity-70 transition-transform duration-200 ease-out"
        style={{ 
          transform: 'translate(-50%, -50%)',
          left: '-100px',
          top: '-100px'
        }}
      ></div>
      <div 
        ref={cursorDotRef} 
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 bg-white rounded-full transition-opacity transition-transform duration-300 ease-out"
        style={{ 
          transform: 'translate(-50%, -50%)',
          left: '-100px',
          top: '-100px'
        }}
      ></div>
    </>
  );
};

export default CustomCursor;
