
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Phone, Star, Clock, MessageCircle, Award } from 'lucide-react';

interface CallEvaluationData {
  callId: string;
  summary: string;
  keyPoints: string[];
  scores: {
    clarity: number;
    effectiveness: number;
    duration: number;
    politeness: number;
    overall: number;
  };
  duration: string;
  outcome: 'Positive' | 'Neutral' | 'Negative';
  followUpSuggestions: string[];
  evaluatedAt: string;
}

interface CallEvaluationCardProps {
  evaluation: CallEvaluationData;
  onNotifyTeamLeader?: () => void;
  className?: string;
}

export const CallEvaluationCard: React.FC<CallEvaluationCardProps> = ({
  evaluation,
  onNotifyTeamLeader,
  className = ""
}) => {
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Positive': return 'bg-green-100 text-green-700';
      case 'Neutral': return 'bg-yellow-100 text-yellow-700';
      case 'Negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Phone className="h-5 w-5 mr-2 text-blue-600" />
            Call Evaluation
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getOutcomeColor(evaluation.outcome)}>
              {evaluation.outcome}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {evaluation.duration}
            </Badge>
          </div>
        </div>
        <CardDescription>
          AI-generated analysis and scoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(evaluation.scores.overall)}`}>
            {evaluation.scores.overall}
          </div>
          <div className="text-sm text-gray-600">Overall Score</div>
          <div className="flex items-center justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(evaluation.scores.overall / 20)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Detailed Scores</h4>
          {Object.entries(evaluation.scores).filter(([key]) => key !== 'overall').map(([metric, score]) => (
            <div key={metric} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium">{metric}</span>
                <span className={getScoreColor(score)}>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </div>

        {/* Call Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            Call Summary
          </h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {evaluation.summary}
          </p>
        </div>

        {/* Key Points */}
        {evaluation.keyPoints.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Points Discussed</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {evaluation.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Suggestions */}
        {evaluation.followUpSuggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Follow-up Suggestions
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {evaluation.followUpSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {onNotifyTeamLeader && (
          <div className="pt-4 border-t">
            <Button variant="outline" size="sm" onClick={onNotifyTeamLeader}>
              Notify Team Leader
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          Evaluated: {new Date(evaluation.evaluatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
