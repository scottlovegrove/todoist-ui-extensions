import { HttpService } from '@nestjs/axios'
import { Controller, Get, Header } from '@nestjs/common'
import dayjs from 'dayjs'
import icalGenerator from 'ical-generator'
import ical, { type VCalendar, type VEvent } from 'node-ical'
import { lastValueFrom } from 'rxjs'

const COVENTRY_FIXTURES_URL =
    'https://calendar.google.com/calendar/ical/djlidj96t1u5h3b4cd1l1qfmrk%40group.calendar.google.com/private-a03a57c76547ba93c8ec576733646f45/basic.ics'

@Controller('coventry')
export class CoventryController {
    constructor(private readonly httpService: HttpService) {}

    @Get('fixtures')
    @Header('Content-Type', 'text/calendar')
    async getFixtures(): Promise<string> {
        const response = await lastValueFrom(this.httpService.get<string>(COVENTRY_FIXTURES_URL))

        const existingEvents = await ical.async.parseICS(response.data)
        const calendarDetails = Object.values(existingEvents).find(
            (x) => x.type === 'VCALENDAR',
        ) as VCalendar

        const existingFixtures = Object.values(existingEvents).filter(
            (x) => x.type === 'VEVENT',
        ) as VEvent[]

        const calendar = icalGenerator({ name: calendarDetails['WR-CALNAME'] })

        const now = dayjs()

        existingFixtures
            .filter(
                (event) =>
                    // Don't care about highlights
                    !event.summary.toLowerCase().includes('match highlights') &&
                    // Don't care about events that have already happened
                    !now.isAfter(dayjs(event.start)),
            )
            .forEach((event) => {
                calendar.createEvent({
                    start: event.start,
                    end: event.end,
                    summary: event.summary,
                    location: event.location,
                    description: event.description.substring(
                        0,
                        event.description.indexOf('| Join in'),
                    ),
                })
            })

        return calendar.toString()
    }
}
