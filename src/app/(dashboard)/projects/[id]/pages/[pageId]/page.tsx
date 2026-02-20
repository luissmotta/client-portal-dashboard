import { getPageById } from "@/app/actions/pages";
import PageValidationClient from "@/components/features/validation/page-validation-client";

export const revalidate = 0;

export default async function PageValidationPage({ params }: { params: { id: string; pageId: string } }) {
    const page = await getPageById(params.pageId);

    if (!page) {
        return <div className="p-8 text-center text-white">Página não encontrada ou erro ao carregar.</div>;
    }

    return <PageValidationClient page={page} projectId={params.id} />;
}
