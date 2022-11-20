import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

type LastWeek = {
    start: Date
    end: Date
}

export function getLastWeeksDates(weeksAgo = 1): LastWeek {
    const today = dayjs()
    const startOfLastWeek = today.startOf('isoWeek').subtract(weeksAgo, 'week')
    const endOfLastWeek = today.endOf('isoWeek').subtract(weeksAgo, 'week')
    return {
        start: startOfLastWeek.toDate(),
        end: endOfLastWeek.toDate(),
    }
}
