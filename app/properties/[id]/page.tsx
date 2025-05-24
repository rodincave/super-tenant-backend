import { createClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: property, error } = await supabase.from("properties").select("*").eq("id", params.id).single();
  if (error || !property) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <Link href="/" className="mb-6 inline-block">
        <Button variant="outline">← Retour à la liste</Button>
      </Link>
      {/* Image principale */}
      {property.images && property.images.length > 0 && (
        <img src={property.images[0]} alt="photo principale" className="rounded-lg w-full h-72 object-cover mb-6 border" />
      )}
      {/* Infos principales */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.subject || property.title || "Annonce"}</h1>
        <div className="text-lg text-gray-600 mb-2">{property.city_label || property.city || property.location || property.postal_code || property.url}</div>
        <div className="flex flex-wrap gap-4 text-base mb-2">
          <span><b>Prix :</b> {property.price?.[0] || property.price_cents/100 || property.price || "-"} €</span>
          <span><b>Surface :</b> {property.attributes?.square || property.surface || "-"} m²</span>
          <span><b>Type :</b> {property.category_name || property.ad_type || "-"}</span>
          <span><b>Statut :</b> {property.status || "-"}</span>
        </div>
        <div className="text-sm text-gray-500">Publié le : {property.first_publication_date ? new Date(property.first_publication_date).toLocaleDateString() : "-"}</div>
      </div>
      {/* Description */}
      <div className="mb-6">
        <h2 className="font-semibold mb-1">Description</h2>
        <div className="whitespace-pre-line text-gray-800">{property.body || "-"}</div>
      </div>
      {/* Autres champs dynamiques */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold mb-2">Détails complémentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {Object.entries(property).map(([key, value]) => (
            ["id","created_at","updated_at","images","body","subject","title","city_label","city","location","postal_code","url","price","price_cents","attributes","surface","category_name","ad_type","first_publication_date","status","nb_images"].includes(key)
              ? null
              : (
                <div key={key} className="break-all">
                  <span className="font-semibold capitalize">{key.replace(/_/g, " ")} :</span> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              )
          ))}
        </div>
      </div>
    </div>
  );
} 