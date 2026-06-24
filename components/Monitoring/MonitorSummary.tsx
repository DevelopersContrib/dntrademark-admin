import React from "react";
import { FaGlobe, FaCircleCheck, FaTriangleExclamation, FaCircleNotch } from "react-icons/fa6";
import CardDataStats from "@/components/CardDataStats";
import { roundCount, type MonitorSummary as Summary } from "@/lib/monitor-status";

const MonitorSummary = ({ summary }: { summary: Summary }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <CardDataStats title="Monitored" total={String(roundCount(summary.monitored))} rate="">
        <FaGlobe className="h-5 w-5" />
      </CardDataStats>

      <CardDataStats title="Clear" total={String(roundCount(summary.clear))} rate="">
        <FaCircleCheck className="h-5 w-5 text-meta-3" />
      </CardDataStats>

      <CardDataStats title="Need review" total={String(roundCount(summary.needReview))} rate="">
        <FaTriangleExclamation className="h-5 w-5 text-[#b45309]" />
      </CardDataStats>

      <CardDataStats title="Scanning" total={String(roundCount(summary.scanning))} rate="">
        <FaCircleNotch className={`h-5 w-5 text-brand ${summary.scanning > 0 ? "animate-spin" : ""}`} />
      </CardDataStats>
    </div>
  );
};

export default MonitorSummary;
