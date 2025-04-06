import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Organization } from '@/lib/types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setOrganization: (organization: Organization | null) => void;
  setOrganizations: (organizations: Organization[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      organizations: [],
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setOrganization: (organization) => set({ organization }),
      setOrganizations: (organizations) => set({ organizations }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () =>
        set({
          user: null,
          organization: null,
          organizations: [],
          error: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        organizations: state.organizations,
      }),
    }
  )
); 