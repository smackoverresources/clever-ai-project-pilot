import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ID } from '@/lib/types';

interface Notification {
  id: ID;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  userId: ID;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultView: 'list' | 'board' | 'calendar';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  taskView: {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    groupBy: string | null;
  };
}

interface PreferencesState {
  notifications: Notification[];
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: ID) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: ID) => void;
  clearAllNotifications: () => void;

  // Preferences actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;

  // Status actions
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  sidebarCollapsed: false,
  defaultView: 'list',
  notifications: {
    email: true,
    push: true,
    desktop: true,
  },
  taskView: {
    sortBy: 'dueDate',
    sortDirection: 'asc',
    groupBy: null,
  },
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notifications: [],
      preferences: defaultPreferences,
      isLoading: false,
      error: null,

      // Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        })),

      clearAllNotifications: () =>
        set({
          notifications: [],
        }),

      // Preferences actions
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      resetPreferences: () =>
        set({
          preferences: defaultPreferences,
        }),

      toggleTheme: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme:
              state.preferences.theme === 'light'
                ? 'dark'
                : state.preferences.theme === 'dark'
                ? 'system'
                : 'light',
          },
        })),

      toggleSidebar: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: !state.preferences.sidebarCollapsed,
          },
        })),

      // Status actions
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'preferences-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        notifications: state.notifications.filter((n) => !n.read),
      }),
    }
  )
); 