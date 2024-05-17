import * as chrono from 'chrono-node'
import { dayjs } from '.'

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
