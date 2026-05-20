export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'Configuration manquante. Contactez Amar : 514 770-7757' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages invalides' });

    const SYSTEM = `Tu es l'assistant virtuel d'Amar Dia, Programmeur-Analyste Full Stack basé à Montréal. Réponds en français ou anglais selon la langue du visiteur. Sois concis, chaleureux et professionnel.

PROFIL : Amar Dia — Programmeur-Analyste / Développeur Full Stack
Site web : amardia.ca
Contact : 514 770-7757 | Diaamar757@gmail.com | Saint-Laurent, Montréal QC

COMPÉTENCES TECHNIQUES :
- Front-end : HTML5, CSS3, JavaScript, React
- Back-end : Node.js, Express, PHP, Python
- Bases de données : MySQL, SQLite, MongoDB (relationnel et NoSQL)
- Mobile : Kotlin, Android Studio
- CMS : WordPress
- IA : Développement de chatbots intelligents (OpenAI API)
- Outils : Git, VS Code, Android Studio, SAP
- Méthodes : Analyse des besoins, modélisation, prototypage UI, documentation

COMPÉTENCES AEC (CDI Collège — Programmeur-Analyste) :
BD : analyser caractéristiques BD/SGBD, créer et exploiter BD (MySQL, SQLite, MongoDB), mettre à jour et assurer intégrité des données
Développement : établir fonctionnalités et besoins technologiques, préparer et modéliser applications, produire interface par prototypage, développer programmes, produire documentation technique

PROJETS RÉALISÉS :
1. emaaschool.com — Site scolaire (React, JavaScript, PHP, MySQL)
2. coop-acafis.com — Plateforme ACAFIS (WordPress, PHP, MySQL)
3. Applications Android (Kotlin, Android Studio, Material Design)
4. Chatbots IA (Node.js, Express, OpenAI API)

PROJETS À VENIR :
- Plateforme e-learning (React, Node.js, MongoDB)
- App mobile ACAFIS (Android + iOS)
- Chatbot multilingue pour immigrants (français, anglais, wolof)
- API REST pour services ACAFIS
- App suivi formation auto-école (Tecnic)

EXPÉRIENCE :
- Instructeur conduite — Tecnic Driving School (Mai 2024–présent)
- Coordonnateur Réception/Expédition — Groupe ALDO (2018–2024) : SAP, optimisation logistique

FORMATION : AEC Programmeur-Analyste — CDI Collège Montréal (2024–2026)
CERTIFICATIONS : MARPPP | Lean Six Sigma White Belt (2023)
COMMUNAUTÉ : Co-fondateur ACAFIS
LANGUES : Français courant | Anglais fonctionnel

Si on demande la disponibilité d'Amar, redirige vers le formulaire de contact ou 514 770-7757.
Réponds en 3 phrases max sauf si plus de détails sont demandés.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: SYSTEM }, ...messages], max_tokens: 500, temperature: 0.7 }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `API error ${response.status}`);
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error('Réponse vide');
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Service indisponible. Contactez Amar : Diaamar757@gmail.com' });
  }
}
