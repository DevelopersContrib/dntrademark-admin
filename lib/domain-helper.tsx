export const getDomains = async (search:string,limit:number,page:number,sortBy:string,orderBy:string) => {
  try {
    const res = await fetch('/api/domain/list', {
      method: 'POST',
      body: JSON.stringify({ search: search, limit: limit, page:page,sortBy:sortBy,orderBy:orderBy })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

export const getItemProtests = async (item_id:number,search:string,limit:number,page:number,sortBy:string,orderBy:string) => {
  try {
    const res = await fetch('/api/item/protest', {
      method: 'POST',
      body: JSON.stringify({ item_id:item_id,search: search, limit: limit, page:page,sortBy:sortBy,orderBy:orderBy })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

export const getDomainsWithHits = async (search:string,limit:number,page:number,sortBy:string,orderBy:string) => {
  try {
    const res = await fetch('/api/domain/withhits', {
      method: 'POST',
      body: JSON.stringify({ search: search, limit: limit, page:page,sortBy:sortBy,orderBy:orderBy })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};


export const getDomainsWithOutHits = async (search:string,limit:number,page:number,sortBy:string,orderBy:string) => {
  try {
    const res = await fetch('/api/domain/withouthits', {
      method: 'POST',
      body: JSON.stringify({ search: search, limit: limit, page:page,sortBy:sortBy,orderBy:orderBy })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};


export const getDomainItems = async (id:number,search:string,limit:number,page:number,sortBy:string,orderBy:string) => {
  try {
    const res = await fetch('/api/domain/items', {
      method: 'POST',
      body: JSON.stringify({ id:id, search: search, limit: limit, page:page,sortBy:sortBy,orderBy:orderBy })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};




export const deleteDomains = async (domains:Array<number>) => {
  try {
    const res = await fetch('/api/domain/delete', {
      method: 'POST',
      body: JSON.stringify({ domains: domains })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

export const rescanDomain = async (id:number) => {
  try {
    const res = await fetch('/api/domain/scan', {
      method: 'POST',
      body: JSON.stringify({ id: id })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

/** Email the trademark report for a domain to the signed-in user. */
export const emailReport = async (id:number) => {
  try {
    const res = await fetch('/api/domain/report-email', {
      method: 'POST',
      body: JSON.stringify({ id: id })
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

/** Load the monitoring list + summary counts. */
export const getMonitor = async () => {
  const res = await fetch('/api/domain/monitor', { method: 'POST' });
  if (res.status === 401) return { unauthenticated: true } as const;
  return res.json();
};

/** Poll current status for a set of domain ids. */
export const pollStatus = async (ids:Array<number>) => {
  const res = await fetch('/api/domain/status', {
    method: 'POST',
    body: JSON.stringify({ ids: ids })
  });
  if (res.status === 401) return { unauthenticated: true } as const;
  return res.json();
};

/** Load the current user's plan/package + usage. */
export const getPlan = async () => {
  const res = await fetch('/api/user/plan', { method: 'POST' });
  if (res.status === 401) return { unauthenticated: true } as const;
  return res.json();
};

/** Add domains (comma/newline separated string or array). Returns created rows. */
export const addMonitorDomains = async (domains:string) => {
  const res = await fetch('/api/domain/monitor-add', {
    method: 'POST',
    body: JSON.stringify({ domains: domains })
  });
  if (res.status === 401) return { unauthenticated: true } as const;
  return res.json();
};