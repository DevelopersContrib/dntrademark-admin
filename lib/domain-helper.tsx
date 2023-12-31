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