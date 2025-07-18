import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Users, Target, Clock, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const TeamsManagementPage: React.FC = () => {
  const { toast } = useToast();
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
          }
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
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isEditGoalsOpen, setIsEditGoalsOpen] = useState(false);
  const [isEditShiftOpen, setIsEditShiftOpen] = useState(false);

  // Form states
  const [teamForm, setTeamForm] = useState<{
    name: string;
    description: string;
    leadDistribution: 'round-robin' | 'availability' | 'workload';
  }>({
    name: '',
    description: '',
    leadDistribution: 'round-robin'
  });

  const [goalForm, setGoalForm] = useState<TeamGoals>({
    monthly: { sales: 0, revenue: 0, leads: 0 },
    quarterly: { sales: 0, revenue: 0, leads: 0 }
  });

  const [shiftForm, setShiftForm] = useState<WorkShift>({
    startTime: '09:00',
    endTime: '18:00',
    workingDays: [],
    timezone: 'UTC'
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timezones = ['UTC', 'EST', 'PST', 'CET', 'JST'];

  const handleCreateTeam = () => {
    if (!teamForm.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive"
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamForm.name,
      description: teamForm.description,
      leadDistribution: teamForm.leadDistribution,
      members: [],
      goals: {
        monthly: { sales: 0, revenue: 0, leads: 0 },
        quarterly: { sales: 0, revenue: 0, leads: 0 }
      }
    };

    setTeams([...teams, newTeam]);
    setTeamForm({ name: '', description: '', leadDistribution: 'round-robin' });
    setIsCreateTeamOpen(false);

    toast({
      title: "Success",
      description: "Team created successfully"
    });
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      leadDistribution: team.leadDistribution
    });
    setIsEditTeamOpen(true);
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam) return;

    setTeams(teams.map(team => 
      team.id === selectedTeam.id 
        ? { ...team, ...teamForm }
        : team
    ));

    setIsEditTeamOpen(false);
    setSelectedTeam(null);

    toast({
      title: "Success",
      description: "Team updated successfully"
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    toast({
      title: "Success",
      description: "Team deleted successfully"
    });
  };

  const handleEditGoals = (team: Team) => {
    setSelectedTeam(team);
    setGoalForm(team.goals);
    setIsEditGoalsOpen(true);
  };

  const handleUpdateGoals = () => {
    if (!selectedTeam) return;

    setTeams(teams.map(team =>
      team.id === selectedTeam.id
        ? { ...team, goals: goalForm }
        : team
    ));

    setIsEditGoalsOpen(false);
    setSelectedTeam(null);

    toast({
      title: "Success",
      description: "Goals updated successfully"
    });
  };

  const handleEditShift = (member: TeamMember) => {
    setSelectedMember(member);
    setShiftForm(member.shift);
    setIsEditShiftOpen(true);
  };

  const handleUpdateShift = () => {
    if (!selectedMember) return;

    setTeams(teams.map(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === selectedMember.id
          ? { ...member, shift: shiftForm }
          : member
      )
    })));

    setIsEditShiftOpen(false);
    setSelectedMember(null);

    toast({
      title: "Success",
      description: "Shift updated successfully"
    });
  };

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setShiftForm({
        ...shiftForm,
        workingDays: [...shiftForm.workingDays, day]
      });
    } else {
      setShiftForm({
        ...shiftForm,
        workingDays: shiftForm.workingDays.filter(d => d !== day)
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Teams Management</h1>
          <p className="text-muted-foreground">Manage teams, goals, and work shifts</p>
        </div>
        <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Add a new sales team to your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="teamDescription">Description</Label>
                <Textarea
                  id="teamDescription"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  placeholder="Enter team description"
                />
              </div>
              <div>
                <Label>Lead Distribution</Label>
                <Select value={teamForm.leadDistribution} onValueChange={(value: 'round-robin' | 'availability' | 'workload') => setTeamForm({ ...teamForm, leadDistribution: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                    <SelectItem value="workload">Workload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
          <Card>
            <CardHeader>
              <CardTitle>Team Goals</CardTitle>
              <CardDescription>Set and track team performance goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{team.name}</h4>
                    <Button variant="outline" size="sm" onClick={() => handleEditGoals(team)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Goals
                    </Button>
                  </div>
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
                        <Button variant="ghost" size="sm" onClick={() => handleEditShift(member)}>
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
      </Tabs>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTeamName">Team Name</Label>
              <Input
                id="editTeamName"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editTeamDescription">Description</Label>
              <Textarea
                id="editTeamDescription"
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Lead Distribution</Label>
              <Select value={teamForm.leadDistribution} onValueChange={(value: 'round-robin' | 'availability' | 'workload') => setTeamForm({ ...teamForm, leadDistribution: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                  <SelectItem value="workload">Workload</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTeamOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTeam}>Update Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goals Dialog */}
      <Dialog open={isEditGoalsOpen} onOpenChange={setIsEditGoalsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team Goals</DialogTitle>
            <DialogDescription>Set monthly and quarterly goals for {selectedTeam?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Monthly Goals</h4>
              <div>
                <Label>Sales Target</Label>
                <Input
                  type="number"
                  value={goalForm.monthly.sales}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    monthly: { ...goalForm.monthly, sales: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Revenue Target ($)</Label>
                <Input
                  type="number"
                  value={goalForm.monthly.revenue}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    monthly: { ...goalForm.monthly, revenue: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Leads Target</Label>
                <Input
                  type="number"
                  value={goalForm.monthly.leads}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    monthly: { ...goalForm.monthly, leads: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Quarterly Goals</h4>
              <div>
                <Label>Sales Target</Label>
                <Input
                  type="number"
                  value={goalForm.quarterly.sales}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    quarterly: { ...goalForm.quarterly, sales: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Revenue Target ($)</Label>
                <Input
                  type="number"
                  value={goalForm.quarterly.revenue}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    quarterly: { ...goalForm.quarterly, revenue: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label>Leads Target</Label>
                <Input
                  type="number"
                  value={goalForm.quarterly.leads}
                  onChange={(e) => setGoalForm({
                    ...goalForm,
                    quarterly: { ...goalForm.quarterly, leads: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGoalsOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateGoals}>Update Goals</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditShiftOpen} onOpenChange={setIsEditShiftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Work Shift</DialogTitle>
            <DialogDescription>Update shift schedule for {selectedMember?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={shiftForm.startTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={shiftForm.endTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Timezone</Label>
              <Select value={shiftForm.timezone} onValueChange={(value) => setShiftForm({ ...shiftForm, timezone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Working Days</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={shiftForm.workingDays.includes(day)}
                      onCheckedChange={(checked) => handleWorkingDayChange(day, !!checked)}
                    />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditShiftOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateShift}>Update Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
