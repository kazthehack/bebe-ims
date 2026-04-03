import { truncate } from 'lodash'

/* eslint-disable prefer-template */
const printQRCode = (objQRCode) => {
  const version = '1'
  const SOH = '_01'
  const STX = '_02'
  const DLE = '_10'
  const RS = '_1E'
  const EOT = '_04'
  const CHECKSUM = '5b1e0c' // TODO: just a placeholder for now
  const prodType = objQRCode.prePackaged ? 'p' : 'd'
  const uOM = objQRCode.flower ? 'g' : 'ea'
  const wght = `${objQRCode.wght},${uOM}`
  const right = 150 // to shift texts vertically
  let top = 40 // to shift texts horizontally
  const qrcodeString = '^FO30,30^FH^FDA,' + DLE + SOH + prodType + version +
    DLE + RS + CHECKSUM +
    DLE + STX + objQRCode.UUID +
    DLE + RS + wght +
    DLE + RS + objQRCode.tag +
    DLE + EOT + '^FS'
  const prodName = truncate(objQRCode.prodName, { length: 40 })
  const nameString = `^FO${right},${top}^FD${prodName}^FS`
  const priceString = objQRCode.price ? `^FO${right},${top += 27}^FD$${objQRCode.price}^FS` : ''
  const weightString = (objQRCode.wght && objQRCode.wght !== '0') ? `^FO${right},${top += 27}^FD${objQRCode.wght}${uOM}^FS` : ''
  const uuidString = `^FO${right},${top += 27}^FD${objQRCode.UUID}^FS`
  const tagString = objQRCode.tag ? `^FO${right},${top += 27}^FD${objQRCode.tag}^FS` : ''
  const content = ('^XA') // starting
    .concat('^MD20^FWN') // ^MD command adjusts the darkness color, ^FW = rotated (N is normal)
    .concat(`^PQ${objQRCode.qrCodes || 1},0,0,Y^CF0,14`) // ^PQ = Print Quantity,  ^CF command sets the default font used in the printer
    .concat(nameString)
    .concat(priceString)
    .concat(weightString)
    .concat(uuidString)
    .concat(tagString)
    .concat('^BQN,2,3,H') // QR Code size, position and inclination
    .concat(qrcodeString)
    .concat('^XZ') // ending
  const url = `http://${objQRCode.printerAddress}/pstprnt`
  const request = new XMLHttpRequest()
  request.open('POST', url, true)
  request.send(content)
}

export default printQRCode
