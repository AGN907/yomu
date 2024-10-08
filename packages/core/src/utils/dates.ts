import * as chrono from 'chrono-node'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)

dayjs.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow at] LT',
    lastWeek: 'dddd',
    nextWeek: 'MMM D, YYYY',
    sameElse: 'MMM D, YYYY',
  },
})

export const parseReleaseDate = (time: string) => {
  return chrono.parseDate(time)
}

export const formatReleaseDate = (date: Date) => {
  return dayjs(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: function (now: dayjs.Dayjs) {
      return `${now.diff(this as dayjs.Dayjs, 'day')} days ago`
    },
    sameElse: 'MMM D, YYYY',
  })
}

export const toCalendar = (date: string) => {
  return dayjs(date).calendar()
}

export { dayjs }
