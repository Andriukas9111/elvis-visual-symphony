
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define different cursor states with animation properties
export type CursorState = 'default' | 'hover' | 'click' | 'hidden' | 'text' | 'media' | 'link';

export interface CursorPosition {
  x: number;
  y: number;
}

interface CursorContextType {
  position: CursorPosition;
  setPosition: (position: CursorPosition) => void;
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  hasMoved: boolean;
  setHasMoved: (moved: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  return (
    <CursorContext.Provider
      value={{
        position,
        setPosition,
        cursorState,
        setCursorState,
        isVisible,
        setIsVisible,
        hasMoved,
        setHasMoved,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  
  return context;
};
