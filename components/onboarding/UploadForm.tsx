'use client';
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import Papa from "papaparse";
import type { UserPlan } from "@/lib/plan";

const DOMAIN_HEADER_NAMES = ["domain", "domains", "domain_name", "domainname", "name", "url", "host"];

const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

function normalizeDomain(raw: string): string {
  return (raw || "")
    .trim()
    .toLowerCase()
    .replace(/^\xEF\xBB\xBF/, "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .trim();
}

function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, "");
}

interface ParsedDomains {
  domains: string[];
  warnings: string[];
}

function parseCsvDomains(raw: string): ParsedDomains {
  const text = stripBom(raw);
  const warnings: string[] = [];
  const seen = new Set<string>();
  const domains: string[] = [];

  const withHeader = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const headers = withHeader.meta?.fields ?? [];
  const domainCol = headers.find((h) => DOMAIN_HEADER_NAMES.includes(h));

  let rows: string[];

  if (domainCol && withHeader.data.length > 0) {
    rows = withHeader.data.map((r) => r[domainCol] ?? "");
  } else {
    const noHeader = Papa.parse<string[]>(text, {
      header: false,
      skipEmptyLines: true,
    });
    rows = noHeader.data.map((r) => r[0] ?? "");
  }

  for (const raw of rows) {
    const name = normalizeDomain(raw);
    if (!name) continue;
    if (!DOMAIN_RE.test(name)) {
      warnings.push(`${raw.trim()} — invalid domain format`);
      continue;
    }
    if (seen.has(name)) {
      warnings.push(`${name} — duplicate, skipped`);
      continue;
    }
    seen.add(name);
    domains.push(name);
  }

  return { domains, warnings };
}

interface UploadFormProps {
  plan?: UserPlan;
}

const UploadForm = ({ plan }: UploadFormProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  const handleUploadCSV = () => {
    setError('');
    setSuccess('');
    setParseWarnings([]);

    const fileInput = inputRef.current;
    if (!fileInput?.files?.length) {
      setError('Please select a CSV file.');
      return;
    }

    const [file] = Array.from(fileInput.files);
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a .csv file.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async ({ target }) => {
      if (!target?.result) {
        setError('Could not read the file.');
        setUploading(false);
        return;
      }

      const { domains, warnings } = parseCsvDomains(target.result as string);
      setParseWarnings(warnings);

      if (!domains.length) {
        setError(
          'No valid domains found in the CSV. Make sure the file contains one domain per row' +
          ' (optionally with a "domain" header column).'
        );
        setUploading(false);
        return;
      }

      if (plan?.end_limit != null && plan.remaining != null) {
        if (domains.length > plan.remaining) {
          setError(
            `Your ${plan.name || 'current'} plan allows ${plan.end_limit} domains` +
            ` (${plan.used} used, ${plan.remaining} remaining).` +
            ` The CSV contains ${domains.length} new domain${domains.length === 1 ? '' : 's'}.` +
            ` Please upgrade your plan or reduce the CSV to ${plan.remaining} domain${plan.remaining === 1 ? '' : 's'}.`
          );
          setUploading(false);
          return;
        }
      }

      try {
        const res = await fetch('/api/domain/add', {
          method: 'POST',
          body: JSON.stringify({ domains: domains.join(","), token: session?.token }),
        });

        const result = await res.json();

        if (!result.success) {
          setError(result.error || result.message || 'Failed to add domains. Please try again.');
        } else {
          const count = domains.length;
          setSuccess(
            result.message ||
            `${count} domain${count === 1 ? '' : 's'} added successfully.`
          );
          if (fileInput) fileInput.value = '';
        }
      } catch {
        setError('Network error — please check your connection and try again.');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      {success && (
        <div className="mb-4">
          <div className="flex w-full rounded-lg border-l-[6px] border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 text-lg font-semibold text-dark">{success}</h5>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border-l-[6px] border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-5 text-sm text-[rgb(220,53,69)]">
          <p className="font-medium">{error}</p>
          {plan && plan.end_limit != null && plan.remaining != null && plan.remaining < 1 && (
            <Link
              href="/pricing"
              className="mt-2 inline-flex items-center gap-1 text-primary underline hover:no-underline"
            >
              Upgrade your plan
            </Link>
          )}
        </div>
      )}

      {parseWarnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-4 text-sm dark:border-yellow-600 dark:bg-yellow-900/20">
          <p className="mb-1 font-medium text-yellow-800 dark:text-yellow-200">
            {parseWarnings.length} row{parseWarnings.length === 1 ? '' : 's'} skipped:
          </p>
          <ul className="list-inside list-disc text-yellow-700 dark:text-yellow-300">
            {parseWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <h4 className="page-header mb-4">Upload a CSV</h4>
      <p className="mb-3 text-sm text-body dark:text-bodydark">
        Upload a <code>.csv</code> file with one domain per row. A header row named
        &quot;domain&quot; is optional. Protocols (<code>http://</code>) and <code>www.</code> prefixes
        are stripped automatically.
      </p>
      <div className="mb-4">
        <input
          ref={inputRef}
          disabled={uploading}
          type="file"
          accept=".csv,text/csv"
          className="form-control"
        />
      </div>
      <button
        onClick={handleUploadCSV}
        disabled={uploading}
        className="bg-primary inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadForm;
