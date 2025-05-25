import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const runtime = "nodejs"

// CORS handler
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await context.params
  console.log(`[SCORER][API] OPTIONS call at ${new Date().toISOString()} for tenantId=${tenantId}`)
  return withCORS(new NextResponse(null, { status: 204 }))
}

export async function POST(_req: NextRequest, context: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await context.params
  console.log(`[SCORER][API] POST call at ${new Date().toISOString()} for tenantId=${tenantId}`)
  console.log("[SCORER] Handler POST appelé")
  if (!tenantId) {
    console.error('[SCORER][ERROR] tenantId manquant ou invalide')
    return withCORS(NextResponse.json({ error: "Missing tenantId" }, { status: 400 }))
  }

  const supabase = createClient()

  // 1. Récupérer le profil du tenant
  const { data: tenant, error: tenantError } = await supabase
    .from("tenant_profiles")
    .select("*")
    .eq("id", tenantId)
    .single()
  console.log('[SCORER] Résultat requête tenant:', { tenant, tenantError })
  if (tenantError || !tenant) {
    console.error('[SCORER][ERROR] Tenant introuvable ou erreur:', tenantError)
    return withCORS(NextResponse.json({ error: tenantError?.message || "Tenant not found" }, { status: 404 }))
  }

  // 2. Récupérer les préférences du propriétaire (le seul owner de la base)
  const { data: ownerPrefs, error: ownerError } = await supabase
    .from("owner_preferences")
    .select("*")
    .limit(1)
    .single()
  if (ownerError || !ownerPrefs) {
    return withCORS(NextResponse.json({ error: ownerError?.message || "Owner preferences not found" }, { status: 404 }))
  }

  // Log des infos utilisées (formatées)
  console.log("[SCORER] Profil du locataire utilisé pour le scoring :\n" + JSON.stringify(tenant, null, 2))
  console.log("[SCORER] Préférences du propriétaire utilisées pour le scoring :\n" + JSON.stringify(ownerPrefs, null, 2))

  // 3. Construire le prompt pour OpenAI (multi-lignes, consignes renforcées)
  const prompt = [
    "Tu es un agent de scoring pour la location immobilière.",
    "Voici le profil du locataire :",
    JSON.stringify(tenant, null, 2),
    "",
    "Voici les préférences du propriétaire :",
    JSON.stringify(ownerPrefs, null, 2),
    "",
    "Consignes :",
    "- Pénalise énormément le score si le locataire ne correspond pas aux attentes du propriétaire ou s'il y a un dealbreaker (dealbreakers dans les préférences du propriétaire).",
    "- Génère un score de compatibilité sur 100 (nombre entier).",
    "- Donne aussi 3 points positifs (Pros) et 3 points négatifs (Cons) sur la compatibilité, sous forme de bullet points.",
    "- Important: si un des documents n'est pas valide, le score devrait être de 0 même si tout le reste est bon, cette condition est prioritaire sur toutes les autres. La validité des documents est dans les champs tenant_document_id_valid et tenant_document_income_valid. Attention, le document prevous rental n'est pas important, il est juste pour information.",
    "- Important: si le revenu est tres haut, le score devrait aussi etre tres haut (si le revenu est plus de 5000, le score devrait etre 90, si le revenue est à 8000 ou plus, le score devrait etre quasi 100)",
    "Format de réponse attendu (en ANGLAIS) :",
    "Score: <nombre entre 0 et 100>",
    "Pros:",
    "- ...",
    "- ...",
    "- ...",
    "Cons:",
    "- ...",
    "- ...",
    "- ..."
  ].join("\n")

  // 4. Appeler OpenAI
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return withCORS(NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 }))
  }
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es un agent de scoring pour la location immobilière." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.2,
    }),
  })
  if (!openaiRes.ok) {
    const err = await openaiRes.text()
    return withCORS(NextResponse.json({ error: "OpenAI error: " + err }, { status: 500 }))
  }
  const openaiData = await openaiRes.json()
  console.log("[SCORER] Réponse brute du LLM:", JSON.stringify(openaiData, null, 2))
  const content = openaiData.choices?.[0]?.message?.content?.trim() || ""

  // Extraction du score et des bullet points
  const scoreMatch = content.match(/Score\s*:\s*(\d{1,3})/i)
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : NaN
  const prosMatch = content.match(/Pros\s*:\s*([\s\S]*?)(Cons\s*:|$)/i)
  const consMatch = content.match(/Cons\s*:\s*([\s\S]*)/i)
  const pros = prosMatch ? prosMatch[1].trim() : ""
  const cons = consMatch ? consMatch[1].trim() : ""
  console.log("[SCORER] Pros générés par le LLM :\n" + pros)
  console.log("[SCORER] Cons générés par le LLM :\n" + cons)
  console.log("[SCORER] SCORE généré par le LLM :", score)

  if (isNaN(score) || score < 0 || score > 100) {
    return withCORS(NextResponse.json({ error: "Invalid score from OpenAI: " + content }, { status: 500 }))
  }

  // 5. Mettre à jour le score, pros et cons dans Supabase
  const { error: updateError } = await supabase
    .from("tenant_profiles")
    .update({ score, pros, cons })
    .eq("id", tenantId)
  if (updateError) {
    return withCORS(NextResponse.json({ error: updateError.message }, { status: 500 }))
  }

  // 6. Retourner le score
  return withCORS(NextResponse.json({ success: true, score, pros, cons }))
} 