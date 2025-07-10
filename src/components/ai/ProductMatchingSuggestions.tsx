
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Package, TrendingUp, CheckCircle } from 'lucide-react';

interface ProductMatch {
  productId: string;
  productName: string;
  matchScore: number;
  confidence: number;
  reasons: string[];
  price: string;
  category: string;
}

interface ProductMatchingSuggestionsProps {
  matches: ProductMatch[];
  onSelectProduct?: (productId: string) => void;
  className?: string;
}

export const ProductMatchingSuggestions: React.FC<ProductMatchingSuggestionsProps> = ({
  matches,
  onSelectProduct,
  className = ""
}) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Zap className="h-5 w-5 mr-2 text-orange-600" />
          AI Product Matching
        </CardTitle>
        <CardDescription>
          Products/services suggested based on client conversation analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No product matches found yet</p>
            <p className="text-sm">Analysis will update as more data becomes available</p>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.productId} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{match.productName}</h4>
                    <Badge className={getMatchColor(match.matchScore)}>
                      {match.matchScore}% match
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {match.category}
                    </span>
                    <span className="font-medium text-green-600">{match.price}</span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {match.confidence}% confidence
                    </span>
                  </div>
                </div>
                {onSelectProduct && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSelectProduct(match.productId)}
                  >
                    Select
                  </Button>
                )}
              </div>

              {match.reasons.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-1">Why this matches:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {match.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
