import { redirect } from 'next/navigation';
import { domainTable } from '@/types/domainTable';
import { domainItems } from '@/types/domainItems';
import { protestTable } from '@/types/protestTable';

export function isUnauthenticated(data: unknown): boolean {
  return data === 'Unauthenticated.';
}

function isDomainTable(data: unknown): data is domainTable {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as domainTable).data)
  );
}

function isDomainItems(data: unknown): data is domainItems {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as domainItems).data)
  );
}

function isProtestTable(data: unknown): data is protestTable {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as protestTable).data)
  );
}

export type PageDataResult<T> = T | 'unauthenticated' | null;

function resolveData<T>(
  data: unknown,
  validator: (value: unknown) => value is T,
): PageDataResult<T> {
  if (isUnauthenticated(data)) {
    return 'unauthenticated';
  }

  if (data === undefined || data === null) {
    return null;
  }

  if (validator(data)) {
    return data;
  }

  return null;
}

export function resolveDomainList(data: unknown): PageDataResult<domainTable> {
  return resolveData(data, isDomainTable);
}

export function resolveDomainItems(data: unknown): PageDataResult<domainItems> {
  return resolveData(data, isDomainItems);
}

export function resolveProtestTable(data: unknown): PageDataResult<protestTable> {
  return resolveData(data, isProtestTable);
}

export function requireDomainTable(data: unknown): domainTable {
  const resolved = resolveDomainList(data);

  if (resolved === 'unauthenticated' || resolved === null) {
    redirect('/auth/signin');
  }

  return resolved;
}

export function requirePageData<T>(
  data: unknown,
  validator: (value: unknown) => value is T,
): T {
  const resolved = resolveData(data, validator);

  if (resolved === 'unauthenticated' || resolved === null) {
    redirect('/auth/signin');
  }

  return resolved;
}
