import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search, Users, TrendingUp, UserPlus, Star, Download, Upload, Grid3X3, List, Trash2, Mail, Phone, MessageSquare, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadDrawerForm } from '../../components/leads/LeadDrawerForm';
import { LeadsTable } from '../../components/leads/LeadsTable';
import { LeadsGrid } from '../../components/leads/LeadsGrid';
import { LeadsAdvancedFilters } from '../../components/leads/LeadsAdvancedFilters';
import { LeadsExportModal } from '../../components/leads/LeadsExportModal';
import { LeadsImportModal } from '../../components/leads/LeadsImportModal';
import { FilterDrawer } from '../../components/shared/FilterDrawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  source: string;
  assignedTo: string;
  createdDate: string;
  createdAt: string;
  lastActivity: string;
  value: number;
  notes: string;
}
const leadsData: Lead[] = [{
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1 (555) 123-4567',
  company: 'TechCorp Inc.',
  title: 'IT Director',
  status: 'qualified',
  score: 85,
  source: 'Website Form',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-15',
  createdAt: '2024-01-15T10:30:00Z',
  lastActivity: '2024-01-18',
  value: 50000,
  notes: 'Interested in enterprise solution'
}, {
  id: '2',
  firstName: 'Emily',
  lastName: 'Davis',
  email: 'emily.davis@startup.com',
  phone: '+1 (555) 987-6543',
  company: 'StartupXYZ',
  title: 'CEO',
  status: 'new',
  score: 92,
  source: 'LinkedIn',
  assignedTo: 'Mike Chen',
  createdDate: '2024-01-18',
  createdAt: '2024-01-18T14:20:00Z',
  lastActivity: '2024-01-18',
  value: 75000,
  notes: 'High potential lead from LinkedIn campaign'
}, {
  id: '3',
  firstName: 'Robert',
  lastName: 'Wilson',
  email: 'r.wilson@manufacturing.com',
  phone: '+1 (555) 456-7890',
  company: 'Manufacturing Ltd',
  title: 'Operations Manager',
  status: 'contacted',
  score: 78,
  source: 'Trade Show',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-01-12',
  createdAt: '2024-01-12T09:15:00Z',
  lastActivity: '2024-01-17',
  value: 35000,
  notes: 'Met at industry trade show, interested in automation'
}, {
  id: '4',
  firstName: 'Lisa',
  lastName: 'Anderson',
  email: 'lisa.a@finance.com',
  phone: '+1 (555) 321-0987',
  company: 'Finance Corp',
  title: 'CFO',
  status: 'converted',
  score: 95,
  source: 'Referral',
  assignedTo: 'David Brown',
  createdDate: '2024-01-08',
  createdAt: '2024-01-08T16:45:00Z',
  lastActivity: '2024-01-16',
  value: 125000,
  notes: 'Converted to customer, very satisfied with service'
}, {
  id: '5',
  firstName: 'Michael',
  lastName: 'Johnson',
  email: 'mjohnson@retail.com',
  phone: '+1 (555) 654-3210',
  company: 'Retail Solutions',
  title: 'VP Marketing',
  status: 'unqualified',
  score: 35,
  source: 'Cold Call',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-10',
  createdAt: '2024-01-10T11:30:00Z',
  lastActivity: '2024-01-14',
  value: 15000,
  notes: 'Not ready for our solution at this time'
}, {
  id: '6',
  firstName: 'Amanda',
  lastName: 'Thompson',
  email: 'a.thompson@healthtech.com',
  phone: '+1 (555) 789-0123',
  company: 'HealthTech Solutions',
  title: 'Product Manager',
  status: 'new',
  score: 88,
  source: 'Google Ads',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-20',
  createdAt: '2024-01-20T09:15:00Z',
  lastActivity: '2024-01-20',
  value: 65000,
  notes: 'Interested in healthcare automation'
}, {
  id: '7',
  firstName: 'David',
  lastName: 'Garcia',
  email: 'david.garcia@edu.com',
  phone: '+1 (555) 234-5678',
  company: 'Education Plus',
  title: 'Director of Technology',
  status: 'contacted',
  score: 72,
  source: 'Email Campaign',
  assignedTo: 'Mike Chen',
  createdDate: '2024-01-19',
  createdAt: '2024-01-19T11:30:00Z',
  lastActivity: '2024-01-21',
  value: 42000,
  notes: 'Looking for educational technology solutions'
}, {
  id: '8',
  firstName: 'Jennifer',
  lastName: 'Miller',
  email: 'j.miller@logistics.com',
  phone: '+1 (555) 345-6789',
  company: 'Logistics Pro',
  title: 'Operations Director',
  status: 'qualified',
  score: 91,
  source: 'Referral',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-01-17',
  createdAt: '2024-01-17T14:20:00Z',
  lastActivity: '2024-01-22',
  value: 85000,
  notes: 'Highly interested in supply chain optimization'
}, {
  id: '9',
  firstName: 'Christopher',
  lastName: 'Brown',
  email: 'c.brown@automotive.com',
  phone: '+1 (555) 456-7890',
  company: 'Auto Innovations',
  title: 'Engineering Manager',
  status: 'converted',
  score: 96,
  source: 'Trade Show',
  assignedTo: 'David Brown',
  createdDate: '2024-01-14',
  createdAt: '2024-01-14T16:45:00Z',
  lastActivity: '2024-01-23',
  value: 145000,
  notes: 'Successfully converted, implementing solution'
}, {
  id: '10',
  firstName: 'Sarah',
  lastName: 'Williams',
  email: 's.williams@consulting.com',
  phone: '+1 (555) 567-8901',
  company: 'Strategic Consulting',
  title: 'Senior Consultant',
  status: 'unqualified',
  score: 28,
  source: 'Cold Call',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-16',
  createdAt: '2024-01-16T10:30:00Z',
  lastActivity: '2024-01-19',
  value: 12000,
  notes: 'Budget constraints, not ready to proceed'
}, {
  id: '11',
  firstName: 'Kevin',
  lastName: 'Rodriguez',
  email: 'k.rodriguez@fintech.com',
  phone: '+1 (555) 678-9012',
  company: 'FinTech Innovations',
  title: 'CTO',
  status: 'qualified',
  score: 89,
  source: 'LinkedIn',
  assignedTo: 'Mike Chen',
  createdDate: '2024-01-21',
  createdAt: '2024-01-21T13:15:00Z',
  lastActivity: '2024-01-24',
  value: 95000,
  notes: 'Strong technical requirements, good fit'
}, {
  id: '12',
  firstName: 'Michelle',
  lastName: 'Lee',
  email: 'm.lee@ecommerce.com',
  phone: '+1 (555) 789-0123',
  company: 'E-Commerce Hub',
  title: 'VP Operations',
  status: 'contacted',
  score: 76,
  source: 'Website Form',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-01-22',
  createdAt: '2024-01-22T15:30:00Z',
  lastActivity: '2024-01-25',
  value: 58000,
  notes: 'Scaling operations, needs automation'
}, {
  id: '13',
  firstName: 'Daniel',
  lastName: 'Taylor',
  email: 'd.taylor@media.com',
  phone: '+1 (555) 890-1234',
  company: 'Media Solutions',
  title: 'Creative Director',
  status: 'new',
  score: 81,
  source: 'Google Ads',
  assignedTo: 'David Brown',
  createdDate: '2024-01-23',
  createdAt: '2024-01-23T08:45:00Z',
  lastActivity: '2024-01-23',
  value: 47000,
  notes: 'Creative industry, unique requirements'
}, {
  id: '14',
  firstName: 'Rachel',
  lastName: 'Martinez',
  email: 'r.martinez@nonprofit.org',
  phone: '+1 (555) 901-2345',
  company: 'Community Support',
  title: 'Program Director',
  status: 'contacted',
  score: 65,
  source: 'Email Campaign',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-24',
  createdAt: '2024-01-24T12:00:00Z',
  lastActivity: '2024-01-26',
  value: 28000,
  notes: 'Non-profit organization, limited budget'
}, {
  id: '15',
  firstName: 'Brian',
  lastName: 'Anderson',
  email: 'b.anderson@construction.com',
  phone: '+1 (555) 012-3456',
  company: 'BuildTech Corp',
  title: 'Project Manager',
  status: 'qualified',
  score: 83,
  source: 'Referral',
  assignedTo: 'Mike Chen',
  createdDate: '2024-01-25',
  createdAt: '2024-01-25T14:30:00Z',
  lastActivity: '2024-01-27',
  value: 72000,
  notes: 'Construction industry, project management focus'
}, {
  id: '16',
  firstName: 'Nicole',
  lastName: 'Wilson',
  email: 'n.wilson@pharma.com',
  phone: '+1 (555) 123-4567',
  company: 'PharmaTech',
  title: 'Research Director',
  status: 'converted',
  score: 94,
  source: 'Trade Show',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-01-26',
  createdAt: '2024-01-26T16:15:00Z',
  lastActivity: '2024-01-28',
  value: 165000,
  notes: 'Pharmaceutical research, high compliance needs'
}, {
  id: '17',
  firstName: 'Thomas',
  lastName: 'Clark',
  email: 't.clark@telecom.com',
  phone: '+1 (555) 234-5678',
  company: 'Telecom Solutions',
  title: 'Network Manager',
  status: 'unqualified',
  score: 41,
  source: 'Cold Call',
  assignedTo: 'David Brown',
  createdDate: '2024-01-27',
  createdAt: '2024-01-27T10:00:00Z',
  lastActivity: '2024-01-29',
  value: 22000,
  notes: 'Technical mismatch, different requirements'
}, {
  id: '18',
  firstName: 'Angela',
  lastName: 'White',
  email: 'a.white@insurance.com',
  phone: '+1 (555) 345-6789',
  company: 'InsureTech',
  title: 'Claims Manager',
  status: 'new',
  score: 77,
  source: 'LinkedIn',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-01-28',
  createdAt: '2024-01-28T11:45:00Z',
  lastActivity: '2024-01-28',
  value: 51000,
  notes: 'Insurance claims automation interest'
}, {
  id: '19',
  firstName: 'Mark',
  lastName: 'Harris',
  email: 'm.harris@hospitality.com',
  phone: '+1 (555) 456-7890',
  company: 'Hotel Management Co',
  title: 'Operations Manager',
  status: 'contacted',
  score: 69,
  source: 'Website Form',
  assignedTo: 'Mike Chen',
  createdDate: '2024-01-29',
  createdAt: '2024-01-29T13:20:00Z',
  lastActivity: '2024-01-30',
  value: 38000,
  notes: 'Hospitality industry, guest management focus'
}, {
  id: '20',
  firstName: 'Stephanie',
  lastName: 'Young',
  email: 's.young@agriculture.com',
  phone: '+1 (555) 567-8901',
  company: 'AgriTech Solutions',
  title: 'Farm Operations Director',
  status: 'qualified',
  score: 86,
  source: 'Google Ads',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-01-30',
  createdAt: '2024-01-30T15:10:00Z',
  lastActivity: '2024-02-01',
  value: 68000,
  notes: 'Agricultural technology, precision farming'
}, {
  id: '21',
  firstName: 'Gregory',
  lastName: 'King',
  email: 'g.king@energy.com',
  phone: '+1 (555) 678-9012',
  company: 'Energy Solutions',
  title: 'Plant Manager',
  status: 'converted',
  score: 92,
  source: 'Email Campaign',
  assignedTo: 'David Brown',
  createdDate: '2024-02-01',
  createdAt: '2024-02-01T09:30:00Z',
  lastActivity: '2024-02-03',
  value: 135000,
  notes: 'Energy sector, efficiency optimization'
}, {
  id: '22',
  firstName: 'Lisa',
  lastName: 'Scott',
  email: 'l.scott@aerospace.com',
  phone: '+1 (555) 789-0123',
  company: 'Aerospace Dynamics',
  title: 'Systems Engineer',
  status: 'unqualified',
  score: 33,
  source: 'Referral',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-02',
  createdAt: '2024-02-02T11:15:00Z',
  lastActivity: '2024-02-04',
  value: 18000,
  notes: 'Aerospace requirements too specialized'
}, {
  id: '23',
  firstName: 'William',
  lastName: 'Green',
  email: 'w.green@banking.com',
  phone: '+1 (555) 890-1234',
  company: 'Community Bank',
  title: 'IT Manager',
  status: 'new',
  score: 79,
  source: 'Trade Show',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-03',
  createdAt: '2024-02-03T14:00:00Z',
  lastActivity: '2024-02-03',
  value: 44000,
  notes: 'Banking sector, compliance requirements'
}, {
  id: '24',
  firstName: 'Karen',
  lastName: 'Adams',
  email: 'k.adams@retail.com',
  phone: '+1 (555) 901-2345',
  company: 'Fashion Retail',
  title: 'Store Manager',
  status: 'contacted',
  score: 71,
  source: 'LinkedIn',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-04',
  createdAt: '2024-02-04T16:30:00Z',
  lastActivity: '2024-02-06',
  value: 35000,
  notes: 'Retail fashion, inventory management'
}, {
  id: '25',
  firstName: 'Steven',
  lastName: 'Baker',
  email: 's.baker@transport.com',
  phone: '+1 (555) 012-3456',
  company: 'Transport Logistics',
  title: 'Fleet Manager',
  status: 'qualified',
  score: 84,
  source: 'Website Form',
  assignedTo: 'David Brown',
  createdDate: '2024-02-05',
  createdAt: '2024-02-05T08:20:00Z',
  lastActivity: '2024-02-07',
  value: 61000,
  notes: 'Transportation logistics, fleet optimization'
}, {
  id: '26',
  firstName: 'Patricia',
  lastName: 'Campbell',
  email: 'p.campbell@legal.com',
  phone: '+1 (555) 123-4567',
  company: 'Legal Associates',
  title: 'Partner',
  status: 'converted',
  score: 93,
  source: 'Google Ads',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-06',
  createdAt: '2024-02-06T12:45:00Z',
  lastActivity: '2024-02-08',
  value: 115000,
  notes: 'Legal services, case management system'
}, {
  id: '27',
  firstName: 'Richard',
  lastName: 'Evans',
  email: 'r.evans@sports.com',
  phone: '+1 (555) 234-5678',
  company: 'Sports Management',
  title: 'Facility Director',
  status: 'unqualified',
  score: 39,
  source: 'Email Campaign',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-07',
  createdAt: '2024-02-07T15:30:00Z',
  lastActivity: '2024-02-09',
  value: 25000,
  notes: 'Sports facility, seasonal business model'
}, {
  id: '28',
  firstName: 'Maria',
  lastName: 'Phillips',
  email: 'm.phillips@beauty.com',
  phone: '+1 (555) 345-6789',
  company: 'Beauty Solutions',
  title: 'Brand Manager',
  status: 'new',
  score: 75,
  source: 'Referral',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-08',
  createdAt: '2024-02-08T10:15:00Z',
  lastActivity: '2024-02-08',
  value: 41000,
  notes: 'Beauty industry, brand management tools'
}, {
  id: '29',
  firstName: 'Charles',
  lastName: 'Turner',
  email: 'c.turner@publishing.com',
  phone: '+1 (555) 456-7890',
  company: 'Digital Publishing',
  title: 'Content Director',
  status: 'contacted',
  score: 73,
  source: 'Trade Show',
  assignedTo: 'David Brown',
  createdDate: '2024-02-09',
  createdAt: '2024-02-09T13:40:00Z',
  lastActivity: '2024-02-11',
  value: 49000,
  notes: 'Publishing industry, content management'
}, {
  id: '30',
  firstName: 'Dorothy',
  lastName: 'Parker',
  email: 'd.parker@gaming.com',
  phone: '+1 (555) 567-8901',
  company: 'Gaming Studios',
  title: 'Producer',
  status: 'qualified',
  score: 87,
  source: 'LinkedIn',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-10',
  createdAt: '2024-02-10T11:25:00Z',
  lastActivity: '2024-02-12',
  value: 73000,
  notes: 'Gaming industry, production pipeline tools'
}, {
  id: '31',
  firstName: 'Paul',
  lastName: 'Collins',
  email: 'p.collins@security.com',
  phone: '+1 (555) 678-9012',
  company: 'Security Systems',
  title: 'Security Manager',
  status: 'converted',
  score: 90,
  source: 'Website Form',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-11',
  createdAt: '2024-02-11T14:50:00Z',
  lastActivity: '2024-02-13',
  value: 98000,
  notes: 'Security systems, monitoring solutions'
}, {
  id: '32',
  firstName: 'Helen',
  lastName: 'Edwards',
  email: 'h.edwards@textiles.com',
  phone: '+1 (555) 789-0123',
  company: 'Textile Manufacturing',
  title: 'Production Manager',
  status: 'unqualified',
  score: 42,
  source: 'Google Ads',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-12',
  createdAt: '2024-02-12T09:35:00Z',
  lastActivity: '2024-02-14',
  value: 31000,
  notes: 'Textile industry, manufacturing focus'
}, {
  id: '33',
  firstName: 'George',
  lastName: 'Stewart',
  email: 'g.stewart@chemicals.com',
  phone: '+1 (555) 890-1234',
  company: 'Chemical Solutions',
  title: 'Process Engineer',
  status: 'new',
  score: 80,
  source: 'Email Campaign',
  assignedTo: 'David Brown',
  createdDate: '2024-02-13',
  createdAt: '2024-02-13T16:20:00Z',
  lastActivity: '2024-02-13',
  value: 54000,
  notes: 'Chemical processing, safety compliance'
}, {
  id: '34',
  firstName: 'Nancy',
  lastName: 'Flores',
  email: 'n.flores@wellness.com',
  phone: '+1 (555) 901-2345',
  company: 'Wellness Center',
  title: 'Operations Director',
  status: 'contacted',
  score: 68,
  source: 'Referral',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-14',
  createdAt: '2024-02-14T12:10:00Z',
  lastActivity: '2024-02-16',
  value: 37000,
  notes: 'Wellness industry, patient management'
}, {
  id: '35',
  firstName: 'Frank',
  lastName: 'Morris',
  email: 'f.morris@mining.com',
  phone: '+1 (555) 012-3456',
  company: 'Mining Operations',
  title: 'Site Manager',
  status: 'qualified',
  score: 82,
  source: 'Trade Show',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-15',
  createdAt: '2024-02-15T10:55:00Z',
  lastActivity: '2024-02-17',
  value: 67000,
  notes: 'Mining industry, equipment management'
}, {
  id: '36',
  firstName: 'Betty',
  lastName: 'Cook',
  email: 'b.cook@entertainment.com',
  phone: '+1 (555) 123-4567',
  company: 'Entertainment Group',
  title: 'Event Manager',
  status: 'converted',
  score: 91,
  source: 'LinkedIn',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-16',
  createdAt: '2024-02-16T15:40:00Z',
  lastActivity: '2024-02-18',
  value: 102000,
  notes: 'Entertainment industry, event management'
}, {
  id: '37',
  firstName: 'Carl',
  lastName: 'Rogers',
  email: 'c.rogers@furniture.com',
  phone: '+1 (555) 234-5678',
  company: 'Furniture Design',
  title: 'Design Director',
  status: 'unqualified',
  score: 45,
  source: 'Website Form',
  assignedTo: 'David Brown',
  createdDate: '2024-02-17',
  createdAt: '2024-02-17T08:25:00Z',
  lastActivity: '2024-02-19',
  value: 29000,
  notes: 'Furniture design, creative tools needed'
}, {
  id: '38',
  firstName: 'Ruth',
  lastName: 'Reed',
  email: 'r.reed@veterinary.com',
  phone: '+1 (555) 345-6789',
  company: 'Veterinary Clinic',
  title: 'Practice Manager',
  status: 'new',
  score: 74,
  source: 'Google Ads',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-18',
  createdAt: '2024-02-18T13:15:00Z',
  lastActivity: '2024-02-18',
  value: 43000,
  notes: 'Veterinary practice, patient records system'
}, {
  id: '39',
  firstName: 'Arthur',
  lastName: 'Howard',
  email: 'a.howard@jewelry.com',
  phone: '+1 (555) 456-7890',
  company: 'Luxury Jewelry',
  title: 'Store Owner',
  status: 'contacted',
  score: 66,
  source: 'Email Campaign',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-19',
  createdAt: '2024-02-19T11:00:00Z',
  lastActivity: '2024-02-21',
  value: 34000,
  notes: 'Jewelry retail, inventory tracking'
}, {
  id: '40',
  firstName: 'Frances',
  lastName: 'Ward',
  email: 'f.ward@photography.com',
  phone: '+1 (555) 567-8901',
  company: 'Photography Studio',
  title: 'Studio Manager',
  status: 'qualified',
  score: 78,
  source: 'Referral',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-20',
  createdAt: '2024-02-20T14:30:00Z',
  lastActivity: '2024-02-22',
  value: 46000,
  notes: 'Photography business, client management'
}, {
  id: '41',
  firstName: 'Raymond',
  lastName: 'Cox',
  email: 'r.cox@architecture.com',
  phone: '+1 (555) 678-9012',
  company: 'Architectural Firm',
  title: 'Principal Architect',
  status: 'converted',
  score: 89,
  source: 'Trade Show',
  assignedTo: 'David Brown',
  createdDate: '2024-02-21',
  createdAt: '2024-02-21T16:45:00Z',
  lastActivity: '2024-02-23',
  value: 87000,
  notes: 'Architecture firm, project management tools'
}, {
  id: '42',
  firstName: 'Gloria',
  lastName: 'Hughes',
  email: 'g.hughes@consulting.com',
  phone: '+1 (555) 789-0123',
  company: 'Business Consulting',
  title: 'Senior Partner',
  status: 'unqualified',
  score: 38,
  source: 'LinkedIn',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-22',
  createdAt: '2024-02-22T09:20:00Z',
  lastActivity: '2024-02-24',
  value: 21000,
  notes: 'Consulting firm, different service model'
}, {
  id: '43',
  firstName: 'Eugene',
  lastName: 'Price',
  email: 'e.price@plumbing.com',
  phone: '+1 (555) 890-1234',
  company: 'Plumbing Services',
  title: 'Service Manager',
  status: 'new',
  score: 72,
  source: 'Website Form',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-23',
  createdAt: '2024-02-23T12:35:00Z',
  lastActivity: '2024-02-23',
  value: 39000,
  notes: 'Plumbing services, scheduling system'
}, {
  id: '44',
  firstName: 'Carolyn',
  lastName: 'Watson',
  email: 'c.watson@catering.com',
  phone: '+1 (555) 901-2345',
  company: 'Catering Excellence',
  title: 'Operations Manager',
  status: 'contacted',
  score: 70,
  source: 'Google Ads',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-24',
  createdAt: '2024-02-24T15:50:00Z',
  lastActivity: '2024-02-26',
  value: 42000,
  notes: 'Catering business, event coordination'
}, {
  id: '45',
  firstName: 'Ralph',
  lastName: 'Bailey',
  email: 'r.bailey@dental.com',
  phone: '+1 (555) 012-3456',
  company: 'Dental Practice',
  title: 'Practice Owner',
  status: 'qualified',
  score: 85,
  source: 'Email Campaign',
  assignedTo: 'David Brown',
  createdDate: '2024-02-25',
  createdAt: '2024-02-25T10:15:00Z',
  lastActivity: '2024-02-27',
  value: 56000,
  notes: 'Dental practice, patient scheduling'
}, {
  id: '46',
  firstName: 'Annie',
  lastName: 'Rivera',
  email: 'a.rivera@florist.com',
  phone: '+1 (555) 123-4567',
  company: 'Flower Shop',
  title: 'Owner',
  status: 'converted',
  score: 88,
  source: 'Referral',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-02-26',
  createdAt: '2024-02-26T13:00:00Z',
  lastActivity: '2024-02-28',
  value: 32000,
  notes: 'Flower shop, seasonal inventory management'
}, {
  id: '47',
  firstName: 'Louis',
  lastName: 'Cooper',
  email: 'l.cooper@electrical.com',
  phone: '+1 (555) 234-5678',
  company: 'Electrical Services',
  title: 'Lead Electrician',
  status: 'unqualified',
  score: 44,
  source: 'Trade Show',
  assignedTo: 'Mike Chen',
  createdDate: '2024-02-27',
  createdAt: '2024-02-27T11:40:00Z',
  lastActivity: '2024-03-01',
  value: 27000,
  notes: 'Electrical services, field service focus'
}, {
  id: '48',
  firstName: 'Alice',
  lastName: 'Richardson',
  email: 'a.richardson@bakery.com',
  phone: '+1 (555) 345-6789',
  company: 'Artisan Bakery',
  title: 'Head Baker',
  status: 'new',
  score: 69,
  source: 'LinkedIn',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-02-28',
  createdAt: '2024-02-28T08:30:00Z',
  lastActivity: '2024-02-28',
  value: 24000,
  notes: 'Bakery business, recipe management'
}, {
  id: '49',
  firstName: 'Wayne',
  lastName: 'Cox',
  email: 'w.cox@landscaping.com',
  phone: '+1 (555) 456-7890',
  company: 'Landscape Design',
  title: 'Design Manager',
  status: 'contacted',
  score: 67,
  source: 'Website Form',
  assignedTo: 'David Brown',
  createdDate: '2024-03-01',
  createdAt: '2024-03-01T14:20:00Z',
  lastActivity: '2024-03-03',
  value: 41000,
  notes: 'Landscaping services, project tracking'
}, {
  id: '50',
  firstName: 'Jean',
  lastName: 'Ward',
  email: 'j.ward@fitness.com',
  phone: '+1 (555) 567-8901',
  company: 'Fitness Center',
  title: 'General Manager',
  status: 'qualified',
  score: 81,
  source: 'Google Ads',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-03-02',
  createdAt: '2024-03-02T16:10:00Z',
  lastActivity: '2024-03-04',
  value: 52000,
  notes: 'Fitness center, membership management'
}, {
  id: '51',
  firstName: 'Harold',
  lastName: 'Torres',
  email: 'h.torres@cleaning.com',
  phone: '+1 (555) 678-9012',
  company: 'Commercial Cleaning',
  title: 'Operations Director',
  status: 'converted',
  score: 86,
  source: 'Email Campaign',
  assignedTo: 'Mike Chen',
  createdDate: '2024-03-03',
  createdAt: '2024-03-03T12:45:00Z',
  lastActivity: '2024-03-05',
  value: 64000,
  notes: 'Cleaning services, route optimization'
}, {
  id: '52',
  firstName: 'Kathryn',
  lastName: 'Peterson',
  email: 'k.peterson@daycare.com',
  phone: '+1 (555) 789-0123',
  company: 'Children Daycare',
  title: 'Director',
  status: 'unqualified',
  score: 36,
  source: 'Referral',
  assignedTo: 'Emily Rodriguez',
  createdDate: '2024-03-04',
  createdAt: '2024-03-04T09:55:00Z',
  lastActivity: '2024-03-06',
  value: 19000,
  notes: 'Daycare center, regulatory compliance focus'
}, {
  id: '53',
  firstName: 'Albert',
  lastName: 'Gray',
  email: 'a.gray@locksmith.com',
  phone: '+1 (555) 890-1234',
  company: 'Security Locksmith',
  title: 'Master Locksmith',
  status: 'new',
  score: 63,
  source: 'Trade Show',
  assignedTo: 'David Brown',
  createdDate: '2024-03-05',
  createdAt: '2024-03-05T15:25:00Z',
  lastActivity: '2024-03-05',
  value: 33000,
  notes: 'Locksmith services, emergency dispatch'
}, {
  id: '54',
  firstName: 'Teresa',
  lastName: 'Ramirez',
  email: 't.ramirez@spa.com',
  phone: '+1 (555) 901-2345',
  company: 'Luxury Spa',
  title: 'Spa Manager',
  status: 'contacted',
  score: 76,
  source: 'LinkedIn',
  assignedTo: 'Sarah Johnson',
  createdDate: '2024-03-06',
  createdAt: '2024-03-06T11:30:00Z',
  lastActivity: '2024-03-08',
  value: 48000,
  notes: 'Spa services, appointment scheduling'
}, {
  id: '55',
  firstName: 'Roy',
  lastName: 'James',
  email: 'r.james@pest.com',
  phone: '+1 (555) 012-3456',
  company: 'Pest Control Pro',
  title: 'Service Manager',
  status: 'qualified',
  score: 79,
  source: 'Website Form',
  assignedTo: 'Mike Chen',
  createdDate: '2024-03-07',
  createdAt: '2024-03-07T13:15:00Z',
  lastActivity: '2024-03-09',
  value: 45000,
  notes: 'Pest control services, route management'
}];
export const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined
    },
    valueRange: {
      min: '',
      max: ''
    },
    scoreRange: {
      min: '',
      max: ''
    },
    assignedTo: 'all',
    source: 'all',
    lastActivity: 'all',
    operator: 'AND' as 'AND' | 'OR',
    textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals',
    filterRules: [] as any[]
  });
  const [appliedFilters, setAppliedFilters] = useState<Array<{
    id: string;
    label: string;
    type: string;
    ruleId?: string;
  }>>([]);
  const filteredLeads = leads.filter(lead => {
    const fullName = `${lead.firstName} ${lead.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesAssignee = assigneeFilter === 'all' || lead.assignedTo === assigneeFilter;
    const matchesScore = scoreFilter === 'all' || scoreFilter === 'hot' && lead.score >= 80 || scoreFilter === 'warm' && lead.score >= 60 && lead.score < 80 || scoreFilter === 'cold' && lead.score < 60;
    return matchesSearch && matchesStatus && matchesSource && matchesAssignee && matchesScore;
  });
  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0)
  };
  const handleAddLead = () => {
    setSelectedLead(null);
    setShowLeadForm(true);
  };
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadForm(true);
  };
  const handleSaveLead = (leadData: any) => {
    console.log('Saving lead:', leadData);
    setShowLeadForm(false);
    setSelectedLead(null);
    toast.success(selectedLead ? 'Lead updated successfully!' : 'Lead created successfully!');
  };
  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    console.log('Deleting lead:', leadId);
    toast.success('Lead deleted successfully!');
  };
  const handleConvertLead = (leadId: string) => {
    console.log('Converting lead to opportunity:', leadId);
    toast.success('Lead converted to opportunity!');
  };
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedLeads(checked ? filteredLeads.map(lead => lead.id) : []);
  };
  const handleBulkDelete = () => {
    setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
    console.log('Bulk deleting leads:', selectedLeads);
    setSelectedLeads([]);
    setShowBulkDeleteDialog(false);
    toast.success(`${selectedLeads.length} leads deleted successfully!`);
  };
  const handleBulkEmail = () => {
    console.log('Bulk email to leads:', selectedLeads);
    toast.success(`Email sent to ${selectedLeads.length} leads!`);
  };
  const handleBulkAssign = () => {
    console.log('Bulk assign leads:', selectedLeads);
    toast.success(`${selectedLeads.length} leads assigned successfully!`);
  };
  const handleImportLeads = (importedLeads: any[]) => {
    setLeads(prev => [...prev, ...importedLeads]);
    setShowImportModal(false);
    toast.success(`${importedLeads.length} leads imported successfully!`);
  };
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (assigneeFilter !== 'all') count++;
    if (scoreFilter !== 'all') count++;
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) count++;
    if (advancedFilters.valueRange.min || advancedFilters.valueRange.max) count++;
    if (advancedFilters.scoreRange.min || advancedFilters.scoreRange.max) count++;
    if (advancedFilters.assignedTo !== 'all') count++;
    if (advancedFilters.source !== 'all') count++;
    if (advancedFilters.lastActivity !== 'all') count++;
    return count;
  };
  const fieldOptions = [{
    value: 'name',
    label: 'Lead Name'
  }, {
    value: 'email',
    label: 'Email'
  }, {
    value: 'phone',
    label: 'Phone'
  }, {
    value: 'company',
    label: 'Company'
  }, {
    value: 'nationality',
    label: 'Nationality'
  }, {
    value: 'source',
    label: 'Lead Source'
  }, {
    value: 'status',
    label: 'Status'
  }, {
    value: 'value',
    label: 'Lead Value'
  }, {
    value: 'score',
    label: 'Lead Score'
  }, {
    value: 'created_date',
    label: 'Created Date'
  }, {
    value: 'assigned_to',
    label: 'Assigned To'
  }];
  const operatorOptions = [{
    value: 'equals',
    label: 'Equals'
  }, {
    value: 'not_equals',
    label: 'Not Equals'
  }, {
    value: 'contains',
    label: 'Contains'
  }, {
    value: 'not_contains',
    label: 'Not Contains'
  }, {
    value: 'greater_than',
    label: 'Greater Than'
  }, {
    value: 'less_than',
    label: 'Less Than'
  }, {
    value: 'this_week',
    label: 'This Week'
  }, {
    value: 'this_month',
    label: 'This Month'
  }, {
    value: 'this_quarter',
    label: 'This Quarter'
  }];
  const removeAppliedFilter = (filterId: string) => {
    const filterToRemove = appliedFilters.find(f => f.id === filterId);
    if (!filterToRemove) return;
    if (filterToRemove.type === 'filterRule' && filterToRemove.ruleId) {
      // Remove specific filter rule
      setAdvancedFilters(prev => ({
        ...prev,
        filterRules: prev.filterRules.filter((rule: any) => rule.id !== filterToRemove.ruleId)
      }));
    } else {
      // Reset specific advanced filter
      const resetAdvancedFilters = {
        ...advancedFilters
      };
      switch (filterToRemove.type) {
        case 'dateRange':
          resetAdvancedFilters.dateRange = {
            from: undefined,
            to: undefined
          };
          break;
        case 'valueRange':
          resetAdvancedFilters.valueRange = {
            min: '',
            max: ''
          };
          break;
        case 'scoreRange':
          resetAdvancedFilters.scoreRange = {
            min: '',
            max: ''
          };
          break;
        case 'assignedTo':
          resetAdvancedFilters.assignedTo = 'all';
          break;
        case 'source':
          resetAdvancedFilters.source = 'all';
          break;
        case 'lastActivity':
          resetAdvancedFilters.lastActivity = 'all';
          break;
      }
      setAdvancedFilters(resetAdvancedFilters);
    }
    setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
  };
  const clearFilters = () => {
    setStatusFilter('all');
    setSourceFilter('all');
    setAssigneeFilter('all');
    setScoreFilter('all');
    setSearchTerm('');
    setAdvancedFilters({
      dateRange: {
        from: undefined,
        to: undefined
      },
      valueRange: {
        min: '',
        max: ''
      },
      scoreRange: {
        min: '',
        max: ''
      },
      assignedTo: 'all',
      source: 'all',
      lastActivity: 'all',
      operator: 'AND' as 'AND' | 'OR',
      textCondition: 'contains' as 'contains' | 'equals' | 'not_contains' | 'not_equals',
      filterRules: []
    });
    setAppliedFilters([]);
  };
  return <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts Management</h1>
          <p className="text-gray-600 mt-1">Track and nurture your potential customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/leads/import')}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAddLead}>
            <Plus className="h-4 w-4 mr-2" />
            New Contact
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ModernKPICard title="Total Contacts" value={leadStats.total.toString()} icon={Users} change={{
        value: "+8 this week",
        trend: "up"
      }} gradient="from-blue-500 to-blue-600" />
        <ModernKPICard title="New Contacts" value={leadStats.new.toString()} icon={UserPlus} change={{
        value: "2 today",
        trend: "up"
      }} gradient="from-green-500 to-green-600" />
        <ModernKPICard title="Qualified" value={leadStats.qualified.toString()} icon={Star} change={{
        value: "Hot prospects",
        trend: "up"
      }} gradient="from-yellow-500 to-yellow-600" />
        <ModernKPICard title="Converted" value={leadStats.converted.toString()} icon={TrendingUp} change={{
        value: "Great results!",
        trend: "up"
      }} gradient="from-purple-500 to-purple-600" />
        <ModernKPICard title="Total Value" value={`$${(leadStats.totalValue / 1000).toFixed(0)}K`} icon={TrendingUp} change={{
        value: "Pipeline value",
        trend: "up"
      }} gradient="from-orange-500 to-orange-600" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contact Filters</CardTitle>
              <CardDescription>Filter and search your contacts</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              {getActiveFiltersCount() > 0 && <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters ({getActiveFiltersCount()})
                </Button>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search contacts..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website Form">Website Form</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Trade Show">Trade Show</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                <SelectItem value="David Brown">David Brown</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="hot">Hot (80+)</SelectItem>
                <SelectItem value="warm">Warm (60-79)</SelectItem>
                <SelectItem value="cold">Cold (&lt;60)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applied Filters Tags */}
      {appliedFilters.length > 0 && <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Applied Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map(filter => <Badge key={filter.id} variant="secondary" className="px-3 py-1">
                  {filter.label}
                  <button onClick={() => removeAppliedFilter(filter.id)} className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>)}
            </div>
          </CardContent>
        </Card>}

      {/* Advanced Filters Drawer */}
      <FilterDrawer isOpen={showAdvancedFilters} onClose={() => setShowAdvancedFilters(false)} title="Advanced Lead Filters" filters={advancedFilters} onFiltersChange={setAdvancedFilters} onApplyFilters={() => {
      console.log('Applying advanced filters:', advancedFilters);
      const newAppliedFilters = [];

      // Add basic filters
      if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
        newAppliedFilters.push({
          id: 'dateRange',
          label: `Date: ${advancedFilters.dateRange.from?.toLocaleDateString() || ''} - ${advancedFilters.dateRange.to?.toLocaleDateString() || ''}`,
          type: 'dateRange'
        });
      }
      if (advancedFilters.valueRange.min || advancedFilters.valueRange.max) {
        newAppliedFilters.push({
          id: 'valueRange',
          label: `Value: $${advancedFilters.valueRange.min || '0'} - $${advancedFilters.valueRange.max || '∞'}`,
          type: 'valueRange'
        });
      }
      if (advancedFilters.scoreRange.min || advancedFilters.scoreRange.max) {
        newAppliedFilters.push({
          id: 'scoreRange',
          label: `Score: ${advancedFilters.scoreRange.min || '0'} - ${advancedFilters.scoreRange.max || '100'}`,
          type: 'scoreRange'
        });
      }
      if (advancedFilters.assignedTo !== 'all') {
        newAppliedFilters.push({
          id: 'assignedTo',
          label: `Assigned: ${advancedFilters.assignedTo}`,
          type: 'assignedTo'
        });
      }
      if (advancedFilters.source !== 'all') {
        newAppliedFilters.push({
          id: 'source',
          label: `Source: ${advancedFilters.source}`,
          type: 'source'
        });
      }
      if (advancedFilters.lastActivity !== 'all') {
        newAppliedFilters.push({
          id: 'lastActivity',
          label: `Activity: ${advancedFilters.lastActivity}`,
          type: 'lastActivity'
        });
      }

      // Add filter rules
      if (advancedFilters.filterRules && advancedFilters.filterRules.length > 0) {
        advancedFilters.filterRules.forEach((rule: any, index: number) => {
          if (rule.field && rule.operator && rule.value) {
            const fieldLabel = fieldOptions.find(f => f.value === rule.field)?.label || rule.field;
            const operatorLabel = operatorOptions.find(o => o.value === rule.operator)?.label || rule.operator;
            newAppliedFilters.push({
              id: `rule_${rule.id}`,
              label: `${fieldLabel} ${operatorLabel} "${rule.value}"`,
              type: 'filterRule',
              ruleId: rule.id
            });
          }
        });
      }
      setAppliedFilters(newAppliedFilters);
      setShowAdvancedFilters(false);
    }}>
        <LeadsAdvancedFilters isOpen={true} onClose={() => {}} filters={advancedFilters} onFiltersChange={setAdvancedFilters} onApplyFilters={() => {}} onClearFilters={() => {}} />
      </FilterDrawer>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contacts ({filteredLeads.length})</CardTitle>
              <CardDescription>Manage and track your sales contacts</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Bulk Actions */}
              {selectedLeads.length > 0 && <div className="flex items-center space-x-2 mr-4">
                  <Badge variant="secondary">{selectedLeads.length} selected</Badge>
                  <Button size="sm" variant="outline" onClick={handleBulkEmail}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkAssign}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowBulkDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>}

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className="rounded-r-none">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-l-none">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? <LeadsTable leads={filteredLeads} onEditLead={handleEditLead} onDeleteLead={handleDeleteLead} onConvertLead={handleConvertLead} selectedLeads={selectedLeads} onSelectLead={handleSelectLead} onSelectAll={handleSelectAll} /> : <LeadsGrid leads={filteredLeads} onEditLead={handleEditLead} onDeleteLead={handleDeleteLead} onConvertLead={handleConvertLead} />}

          {filteredLeads.length === 0 && <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leads found matching your filters</p>
              <Button onClick={clearFilters} variant="outline" className="mt-2">
                Clear Filters
              </Button>
            </div>}
        </CardContent>
      </Card>

      {/* Lead Drawer Form */}
      <LeadDrawerForm isOpen={showLeadForm} onClose={() => {
      setShowLeadForm(false);
      setSelectedLead(null);
    }} onSubmit={handleSaveLead} lead={selectedLead} />

      {/* Export Modal */}
      <LeadsExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} leads={filteredLeads} selectedLeads={selectedLeads} />

      {/* Import Modal */}
      <LeadsImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImportLeads} />
 {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Leads</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedLeads.length} selected leads? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete Leads
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};