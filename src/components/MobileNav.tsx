
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
    <div className="bg-card border-t border-border">
      <nav className="flex">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center py-3 px-2 text-xs',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}