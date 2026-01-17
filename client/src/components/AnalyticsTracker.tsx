'use client';

import { useEffect } from 'react';
import { trackEvent, AnalyticsEventType } from '@/lib/analytics';

export default function AnalyticsTracker({
    eventType,
    entityId,
    metadata,
}: {
    eventType: AnalyticsEventType;
    entityId?: string;
    metadata?: any;
}) {
    useEffect(() => {
        trackEvent(eventType, entityId, metadata);
    }, [eventType, entityId, metadata]);

    return null;
}
