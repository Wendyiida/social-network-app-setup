
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  MessageCircle,
  Compass,
  MapPin,
  Store,
  Settings,
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Découvrir', href: '/discover', icon: Compass },
  { name: 'Carte', href: '/map', icon: MapPin },
  { name: 'Business', href: '/business', icon: Store },
  { name: 'Profil', href: '/profile', icon: User },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          SocialNet
        </h1>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @johndoe
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}