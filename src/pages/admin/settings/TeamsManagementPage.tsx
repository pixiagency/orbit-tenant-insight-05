
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Users, Target, Clock, Activity } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  goals: TeamGoals;
  leadDistribution: 'round-robin' | 'availability' | 'workload';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  goals: IndividualGoals;
  shift: WorkShift;
  clockActivities: ClockActivity[];
}

interface TeamGoals {
  monthly: {
    sales: number;
    revenue: number;
    leads: number;
  };
  quarterly: {
    sales: number;
    revenue: number;
    leads: number;
  };
}

interface IndividualGoals {
  monthly: {
    sales: number;
    revenue: number;
    calls: number;
  };
  quarterly: {
    sales: number;
    revenue: number;
    calls: number;
  };
}

interface WorkShift {
  startTime: string;
  endTime: string;
  workingDays: string[];
  timezone: string;
}

interface ClockActivity {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakTime: number; // in minutes
  totalHours: number;
  status: 'completed' | 'in-progress' | 'missed';
}

export const TeamsManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Sales Team Alpha',
      description: 'Primary sales team for enterprise clients',
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@company.com',
          role: 'Sales Representative',
          goals: {
            monthly: { sales: 10, revenue: 50000, calls: 100 },
            quarterly: { sales: 30, revenue: 150000, calls: 300 }
          },
          shift: {
            startTime: '09:00',
            endTime: '18:00',
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timezone: 'UTC'
          },
          clockActivities: [
            {
              id: '1',
              date: '2024-01-15',
              clockIn: '09:00',
              clockOut: '18:00',
              breakTime: 60,
              totalHours: 8,
              status: 'completed'
            }
          ]
        }
      ],
      goals: {
        monthly: { sales: 50, revenue: 250000, leads: 200 },
        quarterly: { sales: 150, revenue: 750000, leads: 600 }
      },
      leadDistribution: 'round-robin'
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState('teams');

  const form = useForm();

  const handleCreateTeam = () => {
    // Team creation logic
    console.log('Creating new team');
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'in-progress': 'secondary',
      'missed': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Teams Management</h1>
          <p className="text-muted-foreground">Manage teams, goals, shifts, and track clock-in/out activities</p>
        </div>
        <Button onClick={handleCreateTeam} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Shifts
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Clock Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teams Overview</CardTitle>
              <CardDescription>Manage your sales teams and their members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Lead Distribution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">{team.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{team.members.length} members</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.leadDistribution}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTeam(team)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTeam(team.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Goals</CardTitle>
                <CardDescription>Set and track team performance goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">{team.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Monthly Goals</Label>
                        <div className="space-y-1">
                          <div>Sales: {team.goals.monthly.sales}</div>
                          <div>Revenue: ${team.goals.monthly.revenue.toLocaleString()}</div>
                          <div>Leads: {team.goals.monthly.leads}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quarterly Goals</Label>
                        <div className="space-y-1">
                          <div>Sales: {team.goals.quarterly.sales}</div>
                          <div>Revenue: ${team.goals.quarterly.revenue.toLocaleString()}</div>
                          <div>Leads: {team.goals.quarterly.leads}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual Goals</CardTitle>
                <CardDescription>Set personal goals for team members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teams.flatMap(team => team.members).map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">{member.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Monthly Goals</Label>
                        <div className="space-y-1">
                          <div>Sales: {member.goals.monthly.sales}</div>
                          <div>Revenue: ${member.goals.monthly.revenue.toLocaleString()}</div>
                          <div>Calls: {member.goals.monthly.calls}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quarterly Goals</Label>
                        <div className="space-y-1">
                          <div>Sales: {member.goals.quarterly.sales}</div>
                          <div>Revenue: ${member.goals.quarterly.revenue.toLocaleString()}</div>
                          <div>Calls: {member.goals.quarterly.calls}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Shifts</CardTitle>
              <CardDescription>Manage work schedules for team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Shift Time</TableHead>
                    <TableHead>Working Days</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.flatMap(team => team.members).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.shift.startTime} - {member.shift.endTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.shift.workingDays.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{member.shift.timezone}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clock-in/out Activities</CardTitle>
              <CardDescription>Track attendance and working hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.flatMap(team => team.members).map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="date" className="w-48" />
                  <Button variant="outline">Filter</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Break Time</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.flatMap(team => 
                      team.members.flatMap(member =>
                        member.clockActivities.map(activity => (
                          <TableRow key={`${member.id}-${activity.id}`}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell>{activity.clockIn}</TableCell>
                            <TableCell>{activity.clockOut || 'In Progress'}</TableCell>
                            <TableCell>{activity.breakTime} min</TableCell>
                            <TableCell>{activity.totalHours}h</TableCell>
                            <TableCell>{getStatusBadge(activity.status)}</TableCell>
                          </TableRow>
                        ))
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
