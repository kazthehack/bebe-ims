//  Copyright (c) 2018 First Foundry LLC. All rights reserved.
//  @created: 01/23/2018
//  @author: Forest Belton <forest@firstfoundry.co>

import PropTypes from 'prop-types'
import React from 'react'
import Icon from './Icon'

export const ProductIconType = {
  archive2: 'archive2',
  bag: 'bag',
  beaker: 'beaker',
  beverage: 'beverage',
  box: 'box',
  calendar: 'calendar-full',
  candy: 'candy',
  capsules: 'capsules',
  cartridge: 'cartridge',
  cashier: 'cashier',
  'circle-minus': 'circle-minus',
  clipboard8: 'clipboard-alert',
  clock: 'clock3',
  cogs: 'cog',
  'combined-product': 'combined-product',
  concentrate: 'eye-dropper',
  connection7: 'wifi',
  cross: 'cross',
  dropDown: 'chevron-down-circle',
  edible: 'edible',
  error: 'warning',
  'eye-dropper': 'eye-dropper',
  'flower-nug': 'flower-nug',
  flower: 'flower-nug',
  food: 'edibles-top-level',
  hemp: 'Bl_35_Hemp_General',
  hempCannabinoidProduct: 'Bl_35_Hemp_General',
  hempConcentrate: 'Bl_35_Hemp_General',
  home: 'home5',
  info: 'question-circle',
  infoLock: 'lock',
  'infused-preroll': 'BI_34_Infused_Preroll',
  leaf: 'leaf',
  lighter: 'merch-lighter',
  loading: 'loading',
  lotus: 'lotus',
  envelope: 'envelope',
  menu: 'menu',
  merchandise: 'merch-shirt',
  'merch-bong': 'merch-bong',
  'merch-shirt': 'merch-shirt',
  'noninfused-preroll': 'preroll',
  notifications: 'alarm',
  other: 'pills',
  plant: 'plant-top-level',
  'plant-top-level': 'plant-top-level',
  'plus-circle': 'plus-circle',
  profile: 'profile',
  preroll: 'preroll', // TODO: remove when/if back-end stops using this for non-infused preroll
  reports: 'graph',
  rightArrow: 'chevron-right',
  search: 'magnifier',
  seeds: 'seeds',
  sublingual: 'sublingual',
  success: 'checkmark-circle',
  telephone: 'telephone',
  tincture: 'tincture',
  topical: 'topical',
  'transdermal-patch': 'transdermal-patch',
  trash: 'trash2',
  usableHemp: 'Bl_35_Hemp_General',
  users: 'users2',
  warning: 'notification-circle',
  weight2: 'scale2',
  write6: 'pencil5',
  star: 'star',
  shirt: 'shirt',
}

export const ProductIcon = ({ type, ...props }) => (
  <Icon name={ProductIconType[type]} {...props} />
)

const iconTypes = Object.keys(ProductIconType)
ProductIcon.propTypes = {
  type: PropTypes.oneOf(iconTypes).isRequired,
  ...Icon.propTypes,
  className: PropTypes.string,
}
