import { useState } from 'react'
import { KNOWLEDGE_BASE, KnowledgeArticle } from '../data/knowledge'

function ArticleCard({
  article,
  onOpen,
}: {
  article: KnowledgeArticle
  onOpen: () => void
}) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-surface rounded-2xl p-5 flex items-start gap-4 hover:bg-surface-2 transition-colors"
    >
      <span className="text-3xl">{article.icon}</span>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-1">{article.title}</h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{article.summary}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <span className="text-muted text-lg mt-1">›</span>
    </button>
  )
}

function ArticleDetail({
  article,
  onClose,
}: {
  article: KnowledgeArticle
  onClose: () => void
}) {
  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button
          onClick={onClose}
          className="text-muted text-sm flex items-center gap-1 mb-6"
        >
          ← Retour
        </button>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{article.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{article.title}</h1>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-base leading-relaxed mb-8 border-l-2 border-accent pl-4">
          {article.summary}
        </p>

        <div className="space-y-6">
          {article.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-white font-semibold mb-3 text-base">{section.heading}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface rounded-2xl p-4">
          <p className="text-muted text-xs">
            Ces informations sont issues de la littérature médicale disponible. Elles ne remplacent pas un avis médical. En cas de symptômes importants, consulte un professionnel de santé.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Knowledge() {
  const [openArticle, setOpenArticle] = useState<KnowledgeArticle | null>(null)
  const [search, setSearch] = useState('')

  if (openArticle) {
    return <ArticleDetail article={openArticle} onClose={() => setOpenArticle(null)} />
  }

  const filtered = KNOWLEDGE_BASE.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold mb-2">Base de connaissances</h1>
        <p className="text-muted text-sm mb-6">Faits médicaux sur l'alcool et la récupération.</p>

        <input
          type="text"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-5 focus:outline-none focus:border-accent"
        />

        <div className="space-y-3">
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpen={() => setOpenArticle(article)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-muted text-sm text-center py-8">Aucun résultat.</p>
          )}
        </div>
      </div>
    </div>
  )
}
