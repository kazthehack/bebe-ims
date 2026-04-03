import React from 'react'

import NavigationBar from 'components/common/navigation/NavigationBar'

const links = [
  { to: '/crm', content: 'Customers', exact: true },
  { to: '/crm/discounts', content: 'Discounts' },
  { to: '/crm/rewards', content: 'Rewards' },
  // Removed fo the 0.12.2
  // { to: '/crm/settings', content: 'CRM Settings' },
]

export default () => <NavigationBar links={links} />
