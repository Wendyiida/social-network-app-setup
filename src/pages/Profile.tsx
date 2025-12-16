import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogOut, Mail, User } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/auth');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || userProfile?.photoURL || undefined} />
              <AvatarFallback className="text-lg">
                {user?.displayName ? getInitials(user.displayName) : <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.displayName || userProfile?.displayName || 'Utilisateur'}</h2>
              {userProfile?.bio && (
                <p className="text-muted-foreground mt-1">{userProfile.bio}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            )}
            
            {userProfile?.phoneNumber && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">📱</span>
                <span>{userProfile.phoneNumber}</span>
              </div>
            )}

            <div className="pt-2">
              <Badge variant="secondary">
                Confidentialité: {userProfile?.locationPrivacy || 'Non définie'}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Édition du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Fonctionnalité d'édition en cours de développement</p>
            <Badge variant="secondary" className="mt-2">Bientôt disponible</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}