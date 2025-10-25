
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Discover() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Découvrir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Page de découverte en cours de développement</p>
            <Badge variant="secondary" className="mt-2">Bientôt disponible</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}