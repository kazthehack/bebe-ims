const categories = [
  'Flower',
  'Concentrate',
  'Edibles',
  'Pre-rolls',
  'Plants',
  'Topicals',
  'Merch',
]

export default categories.map(category => ({
  category,
  sales: Math.floor(Math.random() * 100),
  total: Math.random() * 10000,
}))
