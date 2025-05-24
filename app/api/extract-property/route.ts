import { NextRequest, NextResponse } from "next/server"
import { ApifyClient } from "apify-client"
import { createClient } from "@/lib/supabase"

// Handler POST /api/extract-property
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  console.log("[EXTRACT-PROPERTY] URL reçue:", url)
  if (!url) {
    console.error("[EXTRACT-PROPERTY] Erreur: URL manquante")
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
  })

  const input = {
    products_url: url,
    feature: "product_details",
    phone_min_delay: 10,
    list_cookies: [],
    proxyConfiguration: {
      useApifyProxy: true,
      apifyProxyGroups: ["RESIDENTIAL"],
      apifyProxyCountry: "FR",
    },
  }
  console.log("[EXTRACT-PROPERTY] Input envoyé à Apify:", input)

  try {
    // Lance l'actor et attend la fin
    const run = await client.actor("fidBLTpxnz3Owo6Zm").call(input)
    // Récupère les résultats du dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    console.log("[EXTRACT-PROPERTY] Items du dataset:", items)

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Aucune donnée extraite" }, { status: 404 })
    }

    // Prend le premier item et mappe explicitement chaque champ
    const apify = items[0]
    function parseDate(val: any) {
      if (typeof val === 'string' || typeof val === 'number') return new Date(val)
      return null
    }
    const property = {
      list_id: apify.list_id,
      first_publication_date: parseDate(apify.first_publication_date),
      expiration_date: parseDate(apify.expiration_date),
      index_date: parseDate(apify.index_date),
      status: apify.status,
      category_id: apify.category_id,
      category_name: apify.category_name,
      subject: apify.subject,
      body: apify.body,
      brand: apify.brand,
      ad_type: apify.ad_type,
      url: apify.url,
      price: apify.price,
      price_cents: apify.price_cents,
      owner: apify.owner,
      options: apify.options,
      has_phone: apify.has_phone,
      attributes_listing: apify.attributes_listing,
      is_boosted: apify.is_boosted,
      similar_data: apify.similar,
      counters: apify.counters,
      attributes: apify.attributes,
      country_id: apify.country_id,
      region_id: apify.region_id,
      region_name: apify.region_name,
      department_id: apify.department_id,
      city_label: apify.city_label,
      city: apify.city,
      zipcode: apify.zipcode,
      lat: apify.lat,
      lng: apify.lng,
      source: apify.source,
      provider: apify.provider,
      is_shape: apify.is_shape,
      images: apify.images,
      nb_images: apify.nb_images,
      thumb_image: apify.thumb_image,
      search_url: apify.search_url,
      transport: apify.transport,
      point_of_interests: apify.point_of_interests,
      // raw_data: apify, // à activer si tu veux garder le JSON complet
      created_at: new Date(),
      updated_at: new Date(),
    }
    console.log("[EXTRACT-PROPERTY] Objet inséré:", property)

    // Insertion dans Supabase
    const supabase = createClient()
    const { error } = await supabase.from("properties").insert([property])
    if (error) {
      console.error("[EXTRACT-PROPERTY] Erreur insertion Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, property })
  } catch (err: any) {
    console.error("[EXTRACT-PROPERTY] Erreur Apify:", err)
    return NextResponse.json({ error: err.message || "Erreur Apify" }, { status: 500 })
  }
} 