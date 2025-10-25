
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageCircle,
  Compass,
  MapPin,
  User,
  Store,
} from 'lucide-react';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Découvrir', href: '/discover', icon: Compass },
  { name: 'Carte', href: '/map', icon: MapPin },
  { name: 'Business', href: '/business', icon: Store },
  { name: 'Profil', href: '/profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <nav className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className={cn(
                'mb-1 transition-all duration-200',
                isActive ? 'h-5 w-5' : 'h-4 w-4'
              )} />
              <span className={cn(
                'text-xs font-medium truncate transition-all duration-200',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}