
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, Package, Users, Settings, ShoppingBag, LayoutDashboard, Mail, FileText } from 'lucide-react';

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/admin', 
    icon: <LayoutDashboard size={18} /> 
  },
  { 
    name: 'Projects', 
    path: '/admin/projects', 
    icon: <Film size={18} /> 
  },
  { 
    name: 'Equipment', 
    path: '/admin/equipment', 
    icon: <Package size={18} /> 
  },
  { 
    name: 'Services', 
    path: '/admin/services', 
    icon: <FileText size={18} /> 
  },
  { 
    name: 'Shop', 
    path: '/admin/shop', 
    icon: <ShoppingBag size={18} /> 
  },
  { 
    name: 'Customers', 
    path: '/admin/customers', 
    icon: <Users size={18} /> 
  },
  { 
    name: 'Messages', 
    path: '/admin/messages', 
    icon: <Mail size={18} /> 
  },
  { 
    name: 'Settings', 
    path: '/admin/settings', 
    icon: <Settings size={18} /> 
  }
];

const AdminSidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-elvis-dark border-r border-elvis-light/10 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-elvis-light/10">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">Elvis Creative</span>
        </div>
        <div className="text-sm text-white/60 mt-1">Admin Dashboard</div>
      </div>
      
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-elvis-pink text-white font-medium' 
                      : 'text-white/70 hover:bg-elvis-light/10 hover:text-white'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
