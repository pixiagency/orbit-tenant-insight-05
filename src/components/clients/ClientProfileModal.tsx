import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Client } from '../../types/superadmin';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Package,
  Users,
  Database,
  Clock,
  DollarSign,
  Edit,
  X
} from 'lucide-react';

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit?: () => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  isOpen,
  onClose,
  client,
  onEdit,
}) => {
  if (!client) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (!limit) return 0;
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage <= 50) return 'text-green-600';
    if (percentage <= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-6 w-6 mr-3 text-blue-600" />
              {client.companyName}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(client.status)}>
                {client.status.toUpperCase()}
              </Badge>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Company Name</label>
                <p className="text-gray-900 font-medium">{client.companyName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Subdomain</label>
                <p className="text-gray-900">{client.subdomain}</p>
              </div>

              {client.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </label>
                  <a 
                    href={client.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.website}
                  </a>
                </div>
              )}

              {client.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address
                  </label>
                  <p className="text-gray-900">{client.address}</p>
                </div>
              )}

              {client.industry && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Industry</label>
                  <p className="text-gray-900">{client.industry}</p>
                </div>
              )}

              {client.companySize && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Size</label>
                  <p className="text-gray-900">{client.companySize}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Name</label>
                <p className="text-gray-900 font-medium">{client.contactName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </label>
                <a 
                  href={`mailto:${client.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {client.contactEmail}
                </a>
              </div>

              {client.contactPhone && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <a 
                    href={`tel:${client.contactPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {client.contactPhone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.packageName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Package</label>
                  <p className="text-gray-900 font-medium">{client.packageName}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Monthly Revenue
                </label>
                <p className="text-gray-900 font-semibold text-lg">${client.monthlyRevenue}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date
                  </label>
                  <p className="text-gray-900">{formatDate(client.subscriptionStartDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    End Date
                  </label>
                  <p className="text-gray-900">{formatDate(client.subscriptionEndDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Users</label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">
                    {client.usersCount || client.totalUsers || 0} / {client.usersLimit || 'Unlimited'}
                  </span>
                  {client.usersLimit && (
                    <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(client.usersCount || client.totalUsers || 0, client.usersLimit))}`}>
                      {getUsagePercentage(client.usersCount || client.totalUsers || 0, client.usersLimit)}%
                    </span>
                  )}
                </div>
              </div>

              {client.contactsCount !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Contacts</label>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      {client.contactsCount} / {client.contactsLimit || 'Unlimited'}
                    </span>
                    {client.contactsLimit && (
                      <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(client.contactsCount, client.contactsLimit))}`}>
                        {getUsagePercentage(client.contactsCount, client.contactsLimit)}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Storage
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">
                    {client.storageUsed}GB / {client.storageLimit || 'Unlimited'}GB
                  </span>
                  {client.storageLimit && (
                    <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(client.storageUsed, client.storageLimit))}`}>
                      {getUsagePercentage(client.storageUsed, client.storageLimit)}%
                    </span>
                  )}
                </div>
              </div>

              {client.callMinutesUsed !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Call Minutes</label>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      {client.callMinutesUsed} / {client.callMinutesLimit || 'Unlimited'}
                    </span>
                    {client.callMinutesLimit && (
                      <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(client.callMinutesUsed, client.callMinutesLimit))}`}>
                        {getUsagePercentage(client.callMinutesUsed, client.callMinutesLimit)}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Activity Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-gray-900">{formatDate(client.lastLogin)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Activity</label>
                  <p className="text-gray-900">{formatDate(client.lastActivity)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-900">{formatDate(client.registrationDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {client.notes && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Trial Information */}
          {client.hasTrialDays && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Trial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">Trial Days Added</p>
                      <p className="text-sm text-blue-700">{client.trialDaysCount} days</p>
                    </div>
                    {client.trialDaysReason && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-900">Reason:</p>
                        <p className="text-sm text-blue-700">{client.trialDaysReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
