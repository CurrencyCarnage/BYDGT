import { notFound } from "next/navigation";
import ProductDetailTemplate from "@/components/catalog/ProductDetailTemplate";
import { getModelById } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function ModelDetailPage({
  params,
}: {
  params: { model: string; locale: string };
}) {
  const model = await getModelById(params.model);

  if (!model) {
    notFound();
  }

  return <ProductDetailTemplate model={model} locale={params.locale} />;
}
