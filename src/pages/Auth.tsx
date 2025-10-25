
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            SocialNet
          </CardTitle>
          <p className="text-muted-foreground">Connectez-vous à votre communauté locale</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full gradient-primary">Se connecter</Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input id="email-register" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Mot de passe</Label>
                <Input id="password-register" type="password" />
              </div>
              <Button className="w-full gradient-primary">S'inscrire</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}