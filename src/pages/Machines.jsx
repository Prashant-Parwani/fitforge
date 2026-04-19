import { useState, useMemo } from 'react'
import MachineCard from '../components/MachineCard'
import { machines, machineCategories } from '../data/machines'

export default function Machines() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]                 = useState('')
  const [difficulty, setDifficulty]         = useState('all')

  const filtered = useMemo(() => {
    return machines.filter(m => {
      const matchCat    = activeCategory === 'all' || m.category === activeCategory
      const matchDiff   = difficulty === 'all' || m.difficulty === difficulty
      const matchSearch = search === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.muscles.some(mu => mu.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchDiff && matchSearch
    })
  }, [activeCategory, search, difficulty])

  return (
    <main className="pt-20 pb-16 min-h-screen">

      {/* Header */}
      <section className="bg-brown-800 text-cream py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">
            30+ Years of Experience
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-3">
            Machines Encyclopedia
          </h1>
          <p className="text-brown-300 text-lg max-w-2xl font-body">
            Every gym machine explained — proper form, targeted muscles, pro tips and how-to videos.
          </p>
          <div className="mt-6 relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search machines or muscles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-brown-700 border border-brown-600 text-cream placeholder-brown-400 focus:outline-none focus:border-brown-300 font-body text-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto py-5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === 'all'
                ? 'bg-brown-500 text-cream border-brown-500'
                : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
            }`}
          >All Machines</button>
          {machineCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat.id
                  ? 'bg-brown-500 text-cream border-brown-500'
                  : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm text-brown-500 font-body">
            <span className="font-semibold text-brown-700">{filtered.length}</span> machines found
          </p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  difficulty === d
                    ? 'bg-brown-500 text-cream border-brown-500'
                    : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
                }`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(machine => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-2xl text-brown-700 mb-2">No machines found</h3>
            <p className="text-brown-400 font-body">Try a different search or category</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setDifficulty('all') }}
              className="btn-outline mt-4 text-sm"
            >Clear Filters</button>
          </div>
        )}

        {/* Tip Banner */}
        <div className="mt-12 bg-brown-800 rounded-2xl p-6 sm:p-8 text-cream">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">Trainer's Golden Rules</h3>
              <p className="text-brown-300 font-body text-sm leading-relaxed">
                Always warm up 5–10 min before lifting. Focus on form before adding weight.
                Progressive overload (adding weight/reps weekly) is the key to growth.
                Rest 60–90 sec between sets. Log every workout to track progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
