
import React from 'react';
import { Menu } from 'lucide-react';

interface MenuToggleProps {
  toggleMenu: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ toggleMenu }) => {
  return (
    <button
      className="text-white md:hidden"
      onClick={toggleMenu}
      aria-label="Toggle Menu"
    >
      <Menu size={24} />
    </button>
  );
};

export default MenuToggle;
