export type AuthFeature = {
  title: string;
  description: string;
  icon: 'shield' | 'bell' | 'globe' | 'dashboard';
};

export const AUTH_FEATURES: AuthFeature[] = [
  {
    title: 'Global trademark monitoring',
    description: 'Scan your domains against major trademark databases worldwide.',
    icon: 'globe',
  },
  {
    title: 'Instant hit alerts',
    description: 'Get notified the moment a potential conflict is detected.',
    icon: 'bell',
  },
  {
    title: 'Domain portfolio dashboard',
    description: 'Manage all domains, hits, and protest workflows in one place.',
    icon: 'dashboard',
  },
  {
    title: 'Brand protection built in',
    description: 'Reduce legal risk before conflicts escalate into disputes.',
    icon: 'shield',
  },
];

export const AUTH_COPY = {
  signin: {
    headline: 'Welcome back',
    subheadline: 'Sign in to monitor your domains and stay ahead of trademark conflicts.',
    panelTitle: 'Protect every domain you own',
    panelSubtitle:
      'DNTrademark helps teams and investors catch conflicts early with automated monitoring and alerts.',
  },
  signup: {
    headline: 'Create your account',
    subheadline: 'Start monitoring your domains against global trademark databases in minutes.',
    panelTitle: 'Start protecting your portfolio',
    panelSubtitle:
      'Join teams using DNTrademark to monitor domains, receive alerts, and act on potential hits faster.',
  },
} as const;
