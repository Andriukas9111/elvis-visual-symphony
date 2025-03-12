
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
      cursor.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      
      // The dot follows with a slight delay via CSS transition
      cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      
      const isOverLink = (e.target as HTMLElement).tagName === 'A' || 
        (e.target as HTMLElement).tagName === 'BUTTON' ||
        (e.target as HTMLElement).classList.contains('cursor-pointer');
      
      cursor.classList.toggle('scale-150', isOverLink);
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
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-[#C8C8C9] opacity-70 transition-transform duration-300 ease-out"
        style={{ 
          transform: 'translate(-100px, -100px) translate(-50%, -50%)'
        }}
      ></div>
      <div 
        ref={cursorDotRef} 
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 bg-[#C8C8C9] rounded-full transition-all duration-300 ease-out"
        style={{ 
          transform: 'translate(-100px, -100px) translate(-50%, -50%)'
        }}
      ></div>
    </>
  );
};

export default CustomCursor;
