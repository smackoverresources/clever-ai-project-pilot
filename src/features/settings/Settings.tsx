import React from 'react';
import {
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Mail,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsItem({ icon, title, description, children }: SettingsItemProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4">
      <div className="flex gap-4">
        <div className="mt-0.5 rounded-full bg-primary/10 p-2">
          {icon}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-10">
        <SettingsSection
          title="Account"
          description="Manage your account settings and preferences."
        >
          <SettingsItem
            icon={<User className="h-4 w-4 text-primary" />}
            title="Personal Information"
            description="Update your personal details and profile information."
          >
            <button className="text-sm text-primary hover:underline">Edit</button>
          </SettingsItem>
          <SettingsItem
            icon={<Mail className="h-4 w-4 text-primary" />}
            title="Email Settings"
            description="Manage your email preferences and notifications."
          >
            <button className="text-sm text-primary hover:underline">Edit</button>
          </SettingsItem>
          <SettingsItem
            icon={<Lock className="h-4 w-4 text-primary" />}
            title="Password"
            description="Change your password and security settings."
          >
            <button className="text-sm text-primary hover:underline">Change</button>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection
          title="Preferences"
          description="Customize your workspace experience."
        >
          <SettingsItem
            icon={<Bell className="h-4 w-4 text-primary" />}
            title="Notifications"
            description="Configure how you receive notifications."
          >
            <button className="text-sm text-primary hover:underline">Configure</button>
          </SettingsItem>
          <SettingsItem
            icon={<Globe className="h-4 w-4 text-primary" />}
            title="Language & Region"
            description="Set your preferred language and regional settings."
          >
            <select className="rounded-md border bg-background px-2 py-1 text-sm">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </SettingsItem>
          <SettingsItem
            icon={<Palette className="h-4 w-4 text-primary" />}
            title="Appearance"
            description="Customize the look and feel of your workspace."
          >
            <select className="rounded-md border bg-background px-2 py-1 text-sm">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection
          title="Security"
          description="Manage your security settings and privacy."
        >
          <SettingsItem
            icon={<Shield className="h-4 w-4 text-primary" />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
          >
            <button className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Enable
            </button>
          </SettingsItem>
          <SettingsItem
            icon={<HelpCircle className="h-4 w-4 text-primary" />}
            title="Security Log"
            description="View your account's security activity."
          >
            <button className="text-sm text-primary hover:underline">View</button>
          </SettingsItem>
        </SettingsSection>
      </div>
    </div>
  );
} 