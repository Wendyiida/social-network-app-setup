import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageCircle,
  Compass,
  MapPin,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Découvrir', href: '/discover', icon: Compass },
  { name: 'Carte', href: '/map', icon: MapPin },
  { name: 'Profil', href: '/profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
      <nav className="flex safe-area-inset-bottom">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-all duration-200',
                'min-h-[60px] relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              
              <item.icon 
                className={cn(
                  'h-6 w-6 mb-1 transition-transform duration-200',
                  isActive ? 'scale-110' : 'scale-100'
                )} 
              />
              <span className={cn(
                'text-[10px] leading-tight',
                isActive ? 'font-semibold' : 'font-normal'
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