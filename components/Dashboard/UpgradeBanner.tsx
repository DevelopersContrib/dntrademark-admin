import React from "react";
import Link from "next/link";
import { FaCrown, FaArrowRight } from "react-icons/fa6";
import {
  shouldShowUpgrade,
  planUsageLabel,
  planUsagePercent,
  planDisplayName,
  type UserPlan,
} from "@/lib/plan";

interface Props {
  plan?: UserPlan | null;
  /** Force the banner to show even if the heuristic wouldn't (e.g. after a blocked add). */
  force?: boolean;
}

const UpgradeBanner = ({ plan, force }: Props) => {
  if (!plan) return null;
  if (!force && !shouldShowUpgrade(plan)) return null;

  const percent = planUsagePercent(plan);
  const atLimit = plan.limitReached;
  const headline = atLimit
    ? "You\u2019ve reached your plan limit"
    : `You\u2019re on the ${planDisplayName(plan)} plan`;
  const sub = atLimit
    ? "Upgrade to keep monitoring more domains for trademark conflicts."
    : "Upgrade for more domain slots, priority scans, and email alerts.";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#7c3aed] p-5 text-white shadow-card sm:p-6">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <FaCrown className="h-5 w-5 text-yellow-300" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-semibold tracking-tight sm:text-lg">{headline}</h4>
            <p className="mt-1 text-sm text-white/80">{sub}</p>

            {plan.end_limit != null && (
              <div className="mt-4 w-full max-w-sm">
                <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-white/90">
                  <span>{planUsageLabel(plan)}</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className={`h-full rounded-full transition-all ${atLimit ? "bg-yellow-300" : "bg-white"}`}
                    style={{ width: `${Math.max(6, percent)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/pricing"
          className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4f46e5] shadow-sm transition hover:bg-white/90 lg:self-center"
        >
          Upgrade plan
          <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default UpgradeBanner;
