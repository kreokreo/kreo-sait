'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/services';
import ServicePageTemplate from '@/components/sections/ServicePageTemplate';

export default function ServicePage({ params }) {
    const { slug } = use(params);
    const service = getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return <ServicePageTemplate service={service} />;
}

