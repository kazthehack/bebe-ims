import moment from 'moment-timezone'

const generateDateRangeUTC = ({
  startDate, endDate, timezone, returnType = 'string',
}) => {
  const startDateUTC = moment.tz(startDate, timezone).startOf('day').utc()
  const endDateUTC = moment.tz(endDate, timezone).endOf('day').utc()
  if (returnType === 'date') {
    return {
      startDate: startDateUTC.toDate(),
      endDate: endDateUTC.toDate(),
    }
  }
  return {
    startDate: startDateUTC.toISOString(),
    endDate: endDateUTC.toISOString(),
  }
}

export default generateDateRangeUTC
