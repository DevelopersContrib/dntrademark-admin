/**
 * User plan / package helpers — pure module (safe in client components).
 *
 * Plan limit = packages.end_limit (the legacy DomainController enforced
 * `domainsCount < package.end_limit`). Free plan = price 0 / null.
 */

export interface UserPlan {
  package_id: number | null;
  name: string | null;
  start_limit: number | null;
  end_limit: number | null;
  price: number | null;
  /** Domains the user currently has. */
  used: number;
  /** Remaining slots, or null when the plan is unlimited (end_limit null). */
  remaining: number | null;
  isFree: boolean;
  limitReached: boolean;
}

/** Whether to surface the upgrade CTA (free plan, at/over limit, or >=80% used). */
export function shouldShowUpgrade(plan?: UserPlan | null): boolean {
  if (!plan) return false;
  if (plan.limitReached) return true;
  if (plan.isFree) return true;
  if (plan.end_limit != null && plan.end_limit > 0 && plan.used / plan.end_limit >= 0.8) return true;
  return false;
}

/** "3 of 10 domains used" (or "3 domains monitored" when unlimited). */
export function planUsageLabel(plan: UserPlan): string {
  if (plan.end_limit == null) return `${plan.used} domains monitored`;
  return `${plan.used} of ${plan.end_limit} domains used`;
}

/** Usage as a 0-100 percentage (0 when unlimited). */
export function planUsagePercent(plan: UserPlan): number {
  if (!plan.end_limit || plan.end_limit <= 0) return 0;
  return Math.min(100, Math.round((plan.used / plan.end_limit) * 100));
}

/** Friendly plan name for display. */
export function planDisplayName(plan?: UserPlan | null): string {
  if (!plan) return "Free";
  if (plan.name && plan.name.trim()) return plan.name.trim();
  return plan.isFree ? "Free" : "Current";
}
