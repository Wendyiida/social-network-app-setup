
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';

export default function MobileHeader() {
  return (
    <header className="md:hidden bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          SocialNet
        </h1>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}