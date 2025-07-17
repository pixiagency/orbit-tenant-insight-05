
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, User, Building2, Mail, Phone, MapPin, Percent } from 'lucide-react';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description?: string;
  competitorInfo?: string;
  decisionMakers?: string;
  budget?: number;
  timeline?: string;
  painPoints?: string;
  proposalSent?: boolean;
  contractSent?: boolean;
  country?: string;
  city?: string;
  pipeline?: string;
  notes?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  status?: 'active' | 'abandon' | 'won' | 'lost';
  lossReason?: string;
  lossDescription?: string;
  createdAt: string;
  lastActivity: string;
}

interface OpportunityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'prospecting':
      return 'bg-gray-100 text-gray-800';
    case 'qualification':
      return 'bg-blue-100 text-blue-800';
    case 'proposal':
      return 'bg-yellow-100 text-yellow-800';
    case 'negotiation':
      return 'bg-orange-100 text-orange-800';
    case 'closed-won':
      return 'bg-green-100 text-green-800';
    case 'closed-lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'abandon':
      return 'bg-yellow-100 text-yellow-800';
    case 'won':
      return 'bg-green-100 text-green-800';
    case 'lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  isOpen,
  onClose,
  opportunity,
}) => {
  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{opportunity.name}</span>
            <div className="flex space-x-2">
              <Badge variant="outline" className={getStatusColor(opportunity.status || 'active')}>
                {(opportunity.status || 'active').charAt(0).toUpperCase() + (opportunity.status || 'active').slice(1)}
              </Badge>
              <Badge variant="outline" className={getStageColor(opportunity.stage)}>
                {opportunity.stage.replace('-', ' ')}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Opportunity details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{opportunity.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.phone}</span>
                </div>
                {(opportunity.country || opportunity.city) && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{[opportunity.city, opportunity.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Opportunity Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-green-600">
                    ${opportunity.value.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Percent className="h-4 w-4 text-gray-500" />
                  <span>{opportunity.probability}% probability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Expected close: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Assigned to: {opportunity.assignedTo}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Source: </span>
                  <span>{opportunity.source}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Pipeline: </span>
                  <span className="capitalize">{opportunity.pipeline}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Products/Services */}
          {opportunity.products && opportunity.products.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">Products/Services</h3>
                <div className="space-y-2">
                  {opportunity.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {product.quantity > 1 && `Qty: ${product.quantity} × `}
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-semibold">${product.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg font-semibold">
                    <span>Total:</span>
                    <span>${opportunity.products.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Description and Notes */}
          {(opportunity.description || opportunity.notes) && (
            <>
              <div className="space-y-4">
                {opportunity.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{opportunity.description}</p>
                  </div>
                )}
                {opportunity.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{opportunity.notes}</p>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Additional Information */}
          {(opportunity.competitorInfo || opportunity.decisionMakers || opportunity.painPoints || opportunity.timeline) && (
            <div className="grid grid-cols-2 gap-6">
              {opportunity.competitorInfo && (
                <div>
                  <h4 className="font-medium mb-2">Competitor Information</h4>
                  <p className="text-sm text-gray-600">{opportunity.competitorInfo}</p>
                </div>
              )}
              {opportunity.decisionMakers && (
                <div>
                  <h4 className="font-medium mb-2">Decision Makers</h4>
                  <p className="text-sm text-gray-600">{opportunity.decisionMakers}</p>
                </div>
              )}
              {opportunity.painPoints && (
                <div>
                  <h4 className="font-medium mb-2">Pain Points</h4>
                  <p className="text-sm text-gray-600">{opportunity.painPoints}</p>
                </div>
              )}
              {opportunity.timeline && (
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <p className="text-sm text-gray-600">{opportunity.timeline}</p>
                </div>
              )}
            </div>
          )}

          {/* Loss Information */}
          {opportunity.status === 'lost' && (opportunity.lossReason || opportunity.lossDescription) && (
            <>
              <Separator />
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Loss Information</h3>
                {opportunity.lossReason && (
                  <p className="text-red-700 mb-2">
                    <span className="font-medium">Reason:</span> {opportunity.lossReason}
                  </p>
                )}
                {opportunity.lossDescription && (
                  <p className="text-red-700">
                    <span className="font-medium">Description:</span> {opportunity.lossDescription}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
