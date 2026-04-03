import moment from 'moment-timezone'
import { getReportTimeRange } from './HomePageHOC'

describe('<HomePage />', () => {
  describe('getReportTimeRange()', () => {
    it('throws error when provided no arguments', () => {
      expect(() => {
        getReportTimeRange()
      }).toThrow()
    })

    it('produces time range values in UTC format', () => {
      const range = getReportTimeRange('America/Los_Angeles', '12:00:00')
      const { startTime, endTime } = range
      expect(moment.utc(startTime).format()).toEqual(startTime)
      expect(moment.utc(endTime).format()).toEqual(endTime)
    })

    it('given "timezone" and "runReportsAt" values, produces expected timerange', () => {
      const range = getReportTimeRange('America/Los_Angeles', '12:00:00')
      const { startTime, endTime } = range
      const startMoment = moment(startTime)
      const endMoment = moment(endTime)
      const diff = endMoment.diff(startMoment)
      expect(diff).toEqual(1000 * 60 * 60 * 24) // 1 day
    })

    it('uses runReportAt time to select start-time for timezone', () => {
      const nowMoment = moment.tz('2019-01-01T12:00:00', 'America/Los_Angeles')
      const range = getReportTimeRange('America/Los_Angeles', '5:10:15', nowMoment)
      const { startTime } = range
      expect(startTime).toEqual(moment.tz('2019-01-01T05:10:15', 'America/Los_Angeles').utc().format())
    })

    it('sets report start-time to previous day if report has not yet been run today', () => {
      const nowMoment = moment.tz('2019-01-02T11:00:00', 'America/Los_Angeles')
      const range = getReportTimeRange('America/Los_Angeles', '12:00:00', nowMoment)
      const { startTime } = range
      expect(startTime).toEqual(moment.tz('2019-01-01T12:00:00', 'America/Los_Angeles').utc().format())
    })
  })
})
