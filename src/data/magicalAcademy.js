export const academyHouses = [
  {
    key: 'gryffindor',
    name: 'Gryffindor',
    values: ['Bravery', 'Discipline', 'Consistency'],
    summary: 'For bold ritual-builders who thrive on courageous consistency and intense focus.',
    colors: ['#ef4444', '#f59e0b', '#facc15'],
    banner: 'linear-gradient(135deg, rgba(127,29,29,0.98), rgba(185,28,28,0.86), rgba(245,158,11,0.72))',
    emblem: 'Lion Sigil',
    icon: 'L',
    theme: 'fitness-orange',
    achievementTone: 'from-red-500 via-amber-500 to-yellow-400',
  },
  {
    key: 'ravenclaw',
    name: 'Ravenclaw',
    values: ['Intelligence', 'Analytics', 'Optimization'],
    summary: 'For curious strategists who turn health data into insight, mastery, and elegant optimization.',
    colors: ['#60a5fa', '#2563eb', '#22d3ee'],
    banner: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,64,175,0.88), rgba(34,211,238,0.68))',
    emblem: 'Raven Sigil',
    icon: 'R',
    theme: 'midnight-blue',
    achievementTone: 'from-sky-400 via-blue-500 to-cyan-400',
  },
  {
    key: 'hufflepuff',
    name: 'Hufflepuff',
    values: ['Balance', 'Wellness', 'Lifestyle'],
    summary: 'For grounded healers who value balance, joyful routines, and long-term wellness momentum.',
    colors: ['#facc15', '#84cc16', '#22c55e'],
    banner: 'linear-gradient(135deg, rgba(113,63,18,0.96), rgba(202,138,4,0.84), rgba(34,197,94,0.64))',
    emblem: 'Badger Sigil',
    icon: 'B',
    theme: 'cyber-green',
    achievementTone: 'from-yellow-400 via-lime-400 to-emerald-400',
  },
  {
    key: 'slytherin',
    name: 'Slytherin',
    values: ['Ambition', 'Transformation', 'Dominance'],
    summary: 'For elite performers chasing transformation, relentless ambition, and total goal domination.',
    colors: ['#34d399', '#14b8a6', '#0f766e'],
    banner: 'linear-gradient(135deg, rgba(6,78,59,0.98), rgba(5,150,105,0.84), rgba(20,184,166,0.66))',
    emblem: 'Serpent Sigil',
    icon: 'S',
    theme: 'cyber-green',
    achievementTone: 'from-emerald-400 via-teal-400 to-cyan-500',
  },
]

export const magicalRanks = [
  { key: 'muggle', label: 'Muggle', minXp: 0, glyph: '✦' },
  { key: 'half-blood', label: 'Half-Blood', minXp: 250, glyph: '✧' },
  { key: 'pure-blood', label: 'Pure-Blood', minXp: 600, glyph: '✶' },
  { key: 'arcane-apprentice', label: 'Arcane Apprentice', minXp: 1100, glyph: '✺' },
  { key: 'potion-scholar', label: 'Potion Scholar', minXp: 1700, glyph: '✹' },
  { key: 'nutrition-mage', label: 'Nutrition Mage', minXp: 2400, glyph: '❈' },
  { key: 'grand-alchemist', label: 'Grand Alchemist', minXp: 3400, glyph: '❂' },
  { key: 'archmage-of-wellness', label: 'Archmage of Wellness', minXp: 4700, glyph: '✵' },
]

export const magicalMealLabels = {
  Breakfast: 'Morning Potion',
  Lunch: 'Midday Feast',
  Dinner: 'Evening Elixir',
  Snacks: 'Arcane Snacks',
  Water: 'Hydration Charm',
  Supplements: 'Arcane Enhancements',
  'Protein Shake': 'Strength Elixir',
}

export const magicalAchievementTitles = {
  '7 Day Logging Streak': 'Potion Master',
  'Protein Master': 'Macro Sorcerer',
  'Hydration Hero': 'Hydration Wizard',
  'Nutrition Consistency Champion': 'Consistency Mage',
}
