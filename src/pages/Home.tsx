
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Users,
  TrendingUp,
  Plus,
} from 'lucide-react';

const posts = [
  {
    id: 1,
    user: {
      name: 'Marie Dubois',
      username: '@marie_d',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
    content: 'Magnifique coucher de soleil depuis la plage de Nice ! 🌅',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    location: 'Nice, France',
    likes: 24,
    comments: 8,
    time: '2h',
  },
  {
    id: 2,
    user: {
      name: 'Pierre Martin',
      username: '@pierre_m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    content: 'Nouveau café ouvert dans le quartier ! Excellent cappuccino ☕',
    location: 'Paris 11ème',
    likes: 15,
    comments: 3,
    time: '4h',
  },
];

const nearbyUsers = [
  {
    name: 'Sophie L.',
    distance: '200m',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  },
  {
    name: 'Thomas R.',
    distance: '500m',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  },
  {
    name: 'Emma B.',
    distance: '800m',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fil d'actualité</h1>
          <p className="text-muted-foreground">Découvrez ce qui se passe près de vous</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Publier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">127</p>
                <p className="text-xs text-muted-foreground">Amis</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">À proximité</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </CardContent>
            </Card>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-foreground">{post.user.name}</p>
                        <p className="text-sm text-muted-foreground">{post.user.username}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{post.time}</p>
                      </div>
                      {post.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{post.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-foreground mb-3">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center space-x-6 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Nearby Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-accent" />
                Utilisateurs proches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.distance}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                Voir plus
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Trouver des amis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Partager ma position
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Nouveau message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}