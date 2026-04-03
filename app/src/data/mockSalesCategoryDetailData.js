import { times } from 'lodash'

const months = times(12).map(m => `${m + 1}/1/17`)

export default months.map(month => ({
  date: month,
  sales: Math.floor(Math.random() * 10000) / 100,
  tx_id: Math.random().toString(36).substring(2, 9).toUpperCase(),
  total: `${Math.floor((Math.random() * 5) + 1)}.00 g`,
  price_per_gram: Math.floor(Math.random() * 1000) / 100,
}))
