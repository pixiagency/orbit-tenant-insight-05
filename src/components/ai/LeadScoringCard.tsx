
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, Target, Calendar } from 'lucide-react';

interface LeadScoringData {
  leadId: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  conversionProbability: number;
  factors: {
    source: { score: number; weight: number; };
    engagement: { score: number; weight: number; };
    demographics: { score: number; weight: number; };
    behavior: { score: number; weight: number; };
  };
  forecast: {
    timeToConversion: string;
    confidence: number;
  };
  recommendations: string[];
  lastUpdated: string;
}

interface LeadScoringCardProps {
  leadScoring: LeadScoringData;
  className?: string;
}

export const LeadScoringCard: React.FC<LeadScoringCardProps> = ({
  leadScoring,
  className = ""
}) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'D': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Activity className="h-5 w-5 mr-2 text-teal-600" />
          Lead Scoring & Forecast
        </CardTitle>
        <CardDescription>
          AI-powered lead qualification and conversion prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(leadScoring.score)}`}>
              {leadScoring.score}
            </div>
            <div className="text-sm text-gray-600">Lead Score</div>
          </div>
          <div className="text-center">
            <Badge className={`text-lg px-3 py-1 ${getGradeColor(leadScoring.grade)}`}>
              Grade {leadScoring.grade}
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {leadScoring.conversionProbability}%
            </div>
            <div className="text-sm text-gray-600">Conversion Probability</div>
          </div>
        </div>

        {/* Scoring Factors */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Scoring Factors</h4>
          {Object.entries(leadScoring.factors).map(([factor, data]) => (
            <div key={factor} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium">{factor}</span>
                <div className="flex items-center space-x-2">
                  <span className={getScoreColor(data.score)}>{data.score}%</span>
                  <span className="text-xs text-gray-500">({data.weight}% weight)</span>
                </div>
              </div>
              <Progress value={data.score} className="h-2" />
            </div>
          ))}
        </div>

        {/* Conversion Forecast */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm flex items-center mb-3">
            <Target className="h-4 w-4 mr-1 text-purple-600" />
            Conversion Forecast
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                Expected Timeline
              </div>
              <div className="font-medium">{leadScoring.forecast.timeToConversion}</div>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Forecast Confidence
              </div>
              <div className="font-medium">{leadScoring.forecast.confidence}%</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {leadScoring.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">AI Recommendations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {leadScoring.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-teal-600">→</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          Last updated: {new Date(leadScoring.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
