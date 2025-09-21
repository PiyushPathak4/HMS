import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoonFeatures?: string[];
}

export function PlaceholderPage({ title, description, comingSoonFeatures }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-medical-100">
              <Construction className="h-8 w-8 text-medical-600" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {comingSoonFeatures && (
              <div>
                <h4 className="font-medium mb-3 text-center">Coming Soon Features:</h4>
                <ul className="space-y-2">
                  {comingSoonFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-medical-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                This page is under development. Please continue prompting to help build out this section!
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
