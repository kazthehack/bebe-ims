const randomSales = () => Math.floor((Math.random() * 99) + 1) * 1000
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default months.map(month => ({
  month,
  sales: randomSales(),
}))
