import { useState } from 'react'

// Unique, verified Unsplash photos — each shows the actual exercise, not just dumbbells
const MACHINE_PHOTOS = {
  // CHEST
  'Flat Bench Press':        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&q=80',
  'Incline Bench Press':     'https://images.unsplash.com/photo-1652363722833-509b3aac287b?w=480&q=80',
  'Chest Fly Machine':       'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=480&q=80',
  'Cable Crossover':         'https://images.unsplash.com/photo-1598575472814-4b33b7b07fb8?w=480&q=80',
  'Dumbbell Pullover':       'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=480&q=80',

  // BACK
  'Lat Pulldown':            'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=480&q=80',
  'Seated Cable Row':        'https://images.unsplash.com/photo-1530822847156-5df684ec5933?w=480&q=80',
  'Deadlift':                'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=480&q=80',
  'T-Bar Row':               'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=480&q=80',
  'Pull-Up Bar':             'https://images.unsplash.com/photo-1598971639058-fab3c3109a52?w=480&q=80',

  // LEGS
  'Leg Press Machine':       'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=480&q=80',
  'Barbell Squat':           'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=480&q=80',
  'Leg Extension Machine':   'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=480&q=80',
  'Lying Leg Curl':          'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=480&q=80',
  'Standing Calf Raise':     'https://images.unsplash.com/photo-1632386823591-1bde4d8e2c34?w=480&q=80',
  'Hip Abductor Machine':    'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=480&q=80',

  // SHOULDERS
  'Overhead Press (OHP)':    'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=480&q=80',
  'Lateral Raise Machine':   'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=480&q=80',
  'Rear Delt Fly Machine':   'https://images.unsplash.com/photo-1616279969862-e411dd1fc3e7?w=480&q=80',
  'Dumbbell Shrug':          'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=480&q=80',

  // ARMS
  'Barbell Curl':            'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=480&q=80',
  'Preacher Curl Machine':   'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=480&q=80',
  'Tricep Pushdown (Cable)': 'https://images.unsplash.com/photo-1624618250880-a32f23ff6da0?w=480&q=80',
  'Skull Crusher (EZ Bar)':  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=480&q=80',
  'Hammer Curl':             'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=480&q=80',

  // CORE
  'Cable Crunch':            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80',
  'Ab Rollout Wheel':        'https://images.unsplash.com/photo-1602052577122-f73b9710adba?w=480&q=80',
  'Hanging Leg Raise':       'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=480&q=80',
  'Plank':                   'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=480&q=80',

  // CARDIO
  'Treadmill':               'https://images.unsplash.com/photo-1486218119243-13301543a1b4?w=480&q=80',
  'Rowing Machine':          'https://images.unsplash.com/photo-1580086319619-3ed498161c77?w=480&q=80',
  'Stationary Bike':         'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=480&q=80',
  'Stair Climber':           'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=480&q=80',
  'Battle Ropes':            'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=480&q=80',

  // FULL BODY
  'Smith Machine':           'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=480&q=80',
  'Barbell Clean & Press':   'https://images.unsplash.com/photo-1565728744382-61accd4aa148?w=480&q=80',
}

const FALLBACK = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&q=80'

const difficultyColor = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-rose-100 text-rose-700',
}
const typeColor = {
  'Machine':          'bg-blue-100 text-blue-700',
  'Free Weight':      'bg-orange-100 text-orange-700',
  'Cable':            'bg-purple-100 text-purple-700',
  'Bodyweight':       'bg-teal-100 text-teal-700',
  'Cardio Machine':   'bg-pink-100 text-pink-700',
  'Cardio':           'bg-pink-100 text-pink-700',
}

export default function MachineCard({ machine }) {
  const [expanded, setExpanded]   = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [imgError, setImgError]   = useState(false)

  const photo = imgError ? FALLBACK : (MACHINE_PHOTOS[machine.name] || FALLBACK)

  return (
    <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden card-lift flex flex-col">
      {/* Photo */}
      <div className="relative h-44 bg-brown-100 overflow-hidden flex-shrink-0">
        <img
          src={photo}
          alt={machine.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-1.5 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[machine.difficulty] || 'bg-gray-100 text-gray-600'}`}>
            {machine.difficulty}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[machine.type] || 'bg-gray-100 text-gray-600'}`}>
            {machine.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <h3 className="font-display text-base font-semibold text-brown-900 mb-0.5 leading-snug">{machine.name}</h3>
        <p className="text-xs text-brown-500 mb-2">{machine.sets}</p>
        <div className="flex flex-wrap gap-1">
          {machine.muscles.slice(0, 3).map(m => (
            <span key={m} className="text-xs bg-brown-100 text-brown-600 px-2 py-0.5 rounded-full">{m}</span>
          ))}
          {machine.muscles.length > 3 && (
            <span className="text-xs bg-brown-100 text-brown-500 px-2 py-0.5 rounded-full">+{machine.muscles.length - 3}</span>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => { setExpanded(!expanded); if (expanded) setShowVideo(false) }}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-brown-100 text-xs font-medium text-brown-600 hover:bg-brown-50 transition-colors"
      >
        <span>{expanded ? 'Hide Details' : 'View Form, Tips & Video'}</span>
        <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t border-brown-100 space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-1">🎯 Correct Position</div>
            <p className="text-sm text-brown-700 font-body leading-relaxed">{machine.position}</p>
          </div>
          <div className="bg-brown-50 rounded-xl p-3 border border-brown-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-1">💡 Pro Tip</div>
            <p className="text-sm text-brown-700 font-body leading-relaxed">{machine.tip}</p>
          </div>
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="w-full flex items-center justify-center gap-2 bg-brown-700 hover:bg-brown-800 text-cream rounded-xl py-2.5 text-sm font-medium transition-colors"
            >
              ▶ Watch How-To Video
            </button>
          ) : (
            <div className="rounded-xl overflow-hidden aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${machine.videoId}?autoplay=1&rel=0`}
                title={machine.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}