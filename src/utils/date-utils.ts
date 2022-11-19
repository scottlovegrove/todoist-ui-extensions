import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

type LastWeek = {
    start: Date
    end: Date
}

export function getLastWeeksDates(): LastWeek {
    const today = dayjs()
    const startOfLastWeek = today.startOf('isoWeek').subtract(1, 'week')
    const endOfLastWeek = today.endOf('isoWeek').subtract(1, 'week')
    return {
        start: startOfLastWeek.toDate(),
        end: endOfLastWeek.toDate(),
    }
}
