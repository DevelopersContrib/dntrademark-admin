export type Stats = {
    stats: {
        domainsCount:number;
	    hitsCount: number;
        noHitsCount:number;
        domainsAtRiskCount:number;
    }
    
}

export type Stat = {
    domainsCount:number;
    hitsCount: number;
    noHitsCount:number;
    domainsAtRiskCount:number;
    investorSpaceCount:number;
}