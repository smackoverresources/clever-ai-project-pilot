import { create } from 'zustand';
import { Team, Resource, ID } from '@/lib/types';

interface TeamFilters {
  search?: string;
  status?: string;
}

interface ResourceFilters {
  type?: string;
  category?: string;
  search?: string;
  projectId?: string;
  teamId?: string;
}

interface TeamsState {
  teams: Team[];
  selectedTeam: Team | null;
  teamFilters: TeamFilters;
  resources: Resource[];
  selectedResource: Resource | null;
  resourceFilters: ResourceFilters;
  isLoading: boolean;
  error: string | null;

  // Team actions
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: ID, team: Partial<Team>) => void;
  deleteTeam: (id: ID) => void;
  setSelectedTeam: (team: Team | null) => void;
  setTeamFilters: (filters: TeamFilters) => void;

  // Resource actions
  setResources: (resources: Resource[]) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: ID, resource: Partial<Resource>) => void;
  deleteResource: (id: ID) => void;
  setSelectedResource: (resource: Resource | null) => void;
  setResourceFilters: (filters: ResourceFilters) => void;

  // Status actions
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTeamsStore = create<TeamsState>()((set) => ({
  teams: [],
  selectedTeam: null,
  teamFilters: {},
  resources: [],
  selectedResource: null,
  resourceFilters: {},
  isLoading: false,
  error: null,

  // Team actions
  setTeams: (teams) => set({ teams }),
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  updateTeam: (id, updatedTeam) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id ? { ...team, ...updatedTeam } : team
      ),
    })),
  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
    })),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setTeamFilters: (filters) => set({ teamFilters: filters }),

  // Resource actions
  setResources: (resources) => set({ resources }),
  addResource: (resource) =>
    set((state) => ({ resources: [...state.resources, resource] })),
  updateResource: (id, updatedResource) =>
    set((state) => ({
      resources: state.resources.map((resource) =>
        resource.id === id ? { ...resource, ...updatedResource } : resource
      ),
    })),
  deleteResource: (id) =>
    set((state) => ({
      resources: state.resources.filter((resource) => resource.id !== id),
    })),
  setSelectedResource: (resource) => set({ selectedResource: resource }),
  setResourceFilters: (filters) => set({ resourceFilters: filters }),

  // Status actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 