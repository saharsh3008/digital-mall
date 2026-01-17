import { fetchAPI } from './api';

export enum AnalyticsEventType {
    STORE_VIEW = 'STORE_VIEW',
    EVENT_VIEW = 'EVENT_VIEW',
    SEARCH_QUERY = 'SEARCH_QUERY',
    OFFER_CLICK = 'OFFER_CLICK',
}

export const trackEvent = (
    eventType: AnalyticsEventType,
    entityId?: string,
    metadata?: Record<string, any>
) => {
    // Use navigator.sendBeacon if available for better reliability on page unload
    // otherwise fallback to fire-and-forget fetch
    try {
        const payload = { eventType, entityId, metadata };

        // Beacon API (Robust for navigation events)
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/analytics/event`;

        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
        } else {
            // Standard Fetch
            fetchAPI('/analytics/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.warn('Analytics Tracking Failed', err));
        }
    } catch (error) {
        // Fail silently to never impact user experience
        console.warn('Analytics Error:', error);
    }
};
