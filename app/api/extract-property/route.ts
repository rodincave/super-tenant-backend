import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// Handler POST /api/extract-property
export const runtime = "edge"

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Clé API Gemini manquante" }, { status: 500 })
  }

  // Prompt adapté à la structure attendue
  const prompt = `
Tu es un assistant qui extrait des données d'annonces immobilières.
Utilise UNIQUEMENT les informations trouvées via la recherche Google (web search) à propos de l'annonce suivante : ${url}
Ne tente jamais d'accéder à l'URL directement, ni d'utiliser une version .json ou une API.
Si tu ne trouves pas d'informations fiables via la recherche web, retourne un objet JSON avec tous les champs à null.
Sinon, retourne un objet JSON strict avec exactement ces champs :
title (string), price (number), charges (number), surface (number), rooms (number), bedrooms (number), location (string), postal_code (string), property_type (string), furnished (boolean), description (string), available_from (string), energy_class (string), ges (string), floor (string), elevator (boolean), balcony (boolean), terrace (boolean), parking (boolean), garden (boolean), photos (array de string), contact_name (string), contact_phone (string).
Ne retourne rien d'autre que cet objet JSON, sans texte autour.
`

  // Appel REST Gemini avec grounding (web search)
  let geminiResponse
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        tools: [
          { googleSearchRetrieval: {} }
        ]
      })
    })
    geminiResponse = await res.json()
    console.log("[GEMINI RAW RESPONSE]", JSON.stringify(geminiResponse, null, 2))
    if (!res.ok) {
      return NextResponse.json({ error: geminiResponse.error?.message || "Erreur Gemini" }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur appel Gemini" }, { status: 500 })
  }

  // Extraction du texte de la réponse
  const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || ""
  console.log("[GEMINI RESPONSE TEXT]", content)

  // Parsing et insertion Supabase
  let property
  try {
    property = JSON.parse(content || "{}")
  } catch (e) {
    return NextResponse.json({ error: "Erreur de parsing JSON Gemini", raw: content }, { status: 500 })
  }

  const supabase = createClient()
  const { error } = await supabase.from("properties").insert([{ ...property, url }])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, property })
} 