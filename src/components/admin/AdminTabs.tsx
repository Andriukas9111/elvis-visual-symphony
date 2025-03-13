
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NavItem, NavGroup } from './sidebar';
import { navigationData } from './sidebar/navData';

type AdminTabsProps = {
  collapsed?: boolean;
};

const AdminTabs: React.FC<AdminTabsProps> = ({ collapsed = false }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="h-full py-2 space-y-4">
      {navigationData.map((section) => (
        <NavGroup 
          key={section.title}
          title={section.title}
          defaultOpen={
            section.defaultOpen || 
            section.items.some(item => currentTab.includes(item.value))
          }
          collapsed={collapsed}
        >
          {section.items.map((item) => (
            <NavItem
              key={item.value}
              icon={item.icon}
              label={item.label}
              value={item.value}
              currentTab={currentTab}
              onClick={handleTabChange}
              badgeCount={item.badgeCount}
              badgeColor={item.badgeColor}
              collapsed={collapsed}
            />
          ))}
        </NavGroup>
      ))}
    </div>
  );
};

export default AdminTabs;
