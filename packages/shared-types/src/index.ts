export interface WebsiteConfig {
    id: string;
    name: string;
    baseUrl: string;
    allowedDomains: string[];
    seedUrls: string[];
    maxDepth: number;
    maxPages: number;
    maxConcurrencyPerDomain: number;
    crawlDelayMs: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum UrlStatus {
    DISCOVERED = "DISCOVERED",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    RETRY_WAIT = "RETRY_WAIT",
}

export interface DiscoveredUrl {
    id: string;
    websiteId: string;
    url: string;
    normalizedUrl: string;
    depth: number;
    status: UrlStatus;
    retryCount: number;
    discoveredFromUrl?: string;
    lastAttemptAt?: Date;
    createdAt: Date;
}

export interface ProcessedDocument {
    id: string;
    urlId: string;
    url: string;
    title: string;
    description?: string;
    headings: string[];
    content: string;
    links: string[];
    contentHash: string;
    contentLength: number;
    httpStatus: number;
    fetchedAt: Date;
}

export interface SearchQueryRequest {
    query: string;
    limit?: number;
    offset?: number;
    domainFilter?: string;
}

export interface SearchResultItem {
    documentId: number;
    title: string;
    url: string;
    snippet: string;
    score: number;
    rank: number;
}

export interface SearchQueryResponse {
    query: string;
    totalResults: number;
    tookMs: number;
    results: SearchResultItem[];
}

export interface HealthStatus {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    uptimeSeconds: number;
    services: {
        postgres: { status: "up" | "down"; latencyMs?: number; error?: string };
        redis: { status: "up" | "down"; latencyMs?: number; error?: string };
    };
}
