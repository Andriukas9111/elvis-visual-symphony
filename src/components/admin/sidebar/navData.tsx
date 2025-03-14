
import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageSquare,
  Package,
  Image,
  Clapperboard,
  FileText,
  AtSign,
  Info,
  Newspaper,
  Settings,
  Home,
  Star,
  Palette
} from 'lucide-react';

export type NavSection = {
  title: string;
  defaultOpen?: boolean;
  items: NavItem[];
};

export type NavItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  badgeCount?: number;
  badgeColor?: string;
};

export const navigationData: NavSection[] = [
  {
    title: "Dashboard",
    defaultOpen: true,
    items: [
      {
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
        value: "dashboard"
      }
    ]
  },
  {
    title: "Content",
    defaultOpen: false,
    items: [
      {
        icon: <Palette size={18} />,
        label: "Content Overview",
        value: "content"
      },
      {
        icon: <Home size={18} />,
        label: "Home Page",
        value: "home"
      },
      {
        icon: <Info size={18} />,
        label: "About Page",
        value: "about"
      },
      {
        icon: <Newspaper size={18} />,
        label: "Blog",
        value: "blog"
      }
    ]
  },
  {
    title: "Media & Equipment",
    defaultOpen: false,
    items: [
      {
        icon: <Image size={18} />,
        label: "Media Library",
        value: "media"
      },
      {
        icon: <Clapperboard size={18} />,
        label: "Equipment",
        value: "equipment"
      }
    ]
  },
  {
    title: "Business",
    defaultOpen: false,
    items: [
      {
        icon: <MessageSquare size={18} />,
        label: "Hire Requests",
        value: "hire-requests",
        badgeCount: 3
      },
      {
        icon: <Package size={18} />,
        label: "Products",
        value: "products"
      },
      {
        icon: <ShoppingCart size={18} />,
        label: "Orders",
        value: "orders"
      }
    ]
  },
  {
    title: "Users",
    defaultOpen: false,
    items: [
      {
        icon: <Users size={18} />,
        label: "Manage Users",
        value: "users"
      },
      {
        icon: <AtSign size={18} />,
        label: "Subscribers",
        value: "subscribers"
      }
    ]
  },
  {
    title: "System",
    defaultOpen: false,
    items: [
      {
        icon: <Settings size={18} />,
        label: "Settings",
        value: "settings"
      }
    ]
  }
];
