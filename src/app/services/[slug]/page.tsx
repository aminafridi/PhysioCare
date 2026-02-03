import { services as staticServices } from '@/data/services';
import ServiceClient from './ServiceClient';

export async function generateStaticParams() {
    return staticServices.map((service) => ({
        slug: service.id,
    }));
}

export default function ServiceDetailPage() {
    return <ServiceClient />;
}
