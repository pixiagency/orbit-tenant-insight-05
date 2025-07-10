
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp } from 'lucide-react';

interface PersonalityProfile {
  primaryType: 'Analytical' | 'Emotional' | 'Assertive' | 'Passive';
  traits: {
    analytical: number;
    emotional: number;
    assertive: number;
    passive: number;
  };
  confidence: number;
  lastUpdated: string;
  insights: string[];
}

interface PersonalityProfileCardProps {
  profile: PersonalityProfile;
  className?: string;
}

export const PersonalityProfileCard: React.FC<PersonalityProfileCardProps> = ({ 
  profile, 
  className = "" 
}) => {
  const getPersonalityColor = (type: string) => {
    switch (type) {
      case 'Analytical': return 'bg-blue-100 text-blue-700';
      case 'Emotional': return 'bg-red-100 text-red-700';
      case 'Assertive': return 'bg-green-100 text-green-700';
      case 'Passive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTraitColor = (trait: string) => {
    switch (trait) {
      case 'analytical': return 'text-blue-600';
      case 'emotional': return 'text-red-600';
      case 'assertive': return 'text-green-600';
      case 'passive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Personality Profile
        </CardTitle>
        <CardDescription>
          AI-generated analysis based on communication patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getPersonalityColor(profile.primaryType)}>
            Primary: {profile.primaryType}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-gray-500">Confidence</div>
            <div className="font-medium">{profile.confidence}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Trait Analysis</h4>
          {Object.entries(profile.traits).map(([trait, value]) => (
            <div key={trait} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={`capitalize font-medium ${getTraitColor(trait)}`}>
                  {trait}
                </span>
                <span>{value}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>

        {profile.insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Key Insights
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {profile.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
