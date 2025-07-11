import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Mail, Phone, Star, Building, User, Megaphone, Heart } from 'lucide-react';
import { PRSR } from '@/types/pr-sr';

interface PRSRGridProps {
  searchTerm: string;
  sourceFilter: string;
  statusFilter: string;
  typeFilter?: string;
  onEdit: (prsr: PRSR) => void;
}

// Mock data for PR/SR contacts (same as table)
const mockPRSRData: PRSR[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@mediahub.com',
    phone: '+1 (555) 123-4567',
    company: 'MediaHub Communications',
    job_title: 'PR Director',
    type: 'pr',
    contact_status: 'Active',
    lead_source: 'Referral',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Email',
    do_not_call: false,
    priority: 'High',
    media_type: 'Digital',
    reach: 50000,
    influence_score: 85,
    campaign_interests: ['Technology', 'Innovation'],
    created_date: '2024-01-15',
    modified_date: '2024-01-15'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'm.chen@socialgood.org',
    phone: '+1 (555) 234-5678',
    company: 'Social Good Foundation',
    job_title: 'CSR Manager',
    type: 'sr',
    contact_status: 'Qualified',
    lead_source: 'Website',
    email_opt_in: true,
    phone_opt_in: false,
    preferred_contact_method: 'Email',
    do_not_call: true,
    priority: 'Medium',
    media_type: 'Social Media',
    reach: 25000,
    influence_score: 72,
    campaign_interests: ['Environmental', 'Community Development'],
    created_date: '2024-01-20',
    modified_date: '2024-01-20'
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    email: 'emily@greeninitiatives.org',
    phone: '+1 (555) 345-6789',
    company: 'Green Initiatives Inc',
    job_title: 'Sustainability Director',
    type: 'sr',
    contact_status: 'Active',
    lead_source: 'Event',
    email_opt_in: true,
    phone_opt_in: true,
    preferred_contact_method: 'Phone',
    do_not_call: false,
    priority: 'High',
    media_type: 'Blog',
    reach: 15000,
    influence_score: 78,
    campaign_interests: ['Sustainability', 'Environmental'],
    created_date: '2024-01-25',
    modified_date: '2024-01-25'
  }
];

export const PRSRGrid: React.FC<PRSRGridProps> = ({
  searchTerm,
  sourceFilter,
  statusFilter,
  typeFilter,
  onEdit
}) => {
  const [data] = useState<PRSR[]>(mockPRSRData);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchTerm || 
      `${item.first_name} ${item.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || item.lead_source.toLowerCase() === sourceFilter;
    const matchesStatus = statusFilter === 'all' || item.contact_status.toLowerCase() === statusFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    
    return matchesSearch && matchesSource && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Qualified': return 'secondary';
      case 'Inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredData.map((prsr) => (
        <Card key={prsr.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {prsr.type === 'pr' ? (
                    <Megaphone className="h-6 w-6 text-white" />
                  ) : (
                    <Heart className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{prsr.first_name} {prsr.last_name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{prsr.job_title}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(prsr)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{prsr.email}</span>
              </div>
              {prsr.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{prsr.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{prsr.company}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={prsr.type === 'pr' ? 'default' : 'secondary'}>
                {prsr.type === 'pr' ? 'PR' : 'SR'}
              </Badge>
              <Badge variant={getStatusColor(prsr.contact_status)}>
                {prsr.contact_status}
              </Badge>
              <Badge variant={getPriorityColor(prsr.priority || 'Medium')}>
                {prsr.priority || 'Medium'}
              </Badge>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {prsr.reach?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Reach</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {prsr.influence_score || 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>

            {/* Campaign Interests */}
            {prsr.campaign_interests && prsr.campaign_interests.length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 mb-2">Interests</div>
                <div className="flex flex-wrap gap-1">
                  {prsr.campaign_interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {prsr.campaign_interests.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{prsr.campaign_interests.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredData.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No PR/SR contacts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};