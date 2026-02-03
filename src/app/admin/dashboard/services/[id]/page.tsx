import { services as defaultServices } from '@/data/services';
import EditServiceClient from './AdminServiceEditClient';

export async function generateStaticParams() {
    return defaultServices.map((service) => ({
        id: service.id,
    }));
}

export default function EditServicePage() {
    return <EditServiceClient />;
}
