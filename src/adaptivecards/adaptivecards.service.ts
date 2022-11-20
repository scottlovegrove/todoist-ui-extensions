import {
    ActionSet,
    Choice,
    ChoiceSetInput,
    ClipboardAction,
    Container,
    createTextButton,
    DoistCard,
    SubmitAction,
    TextBlock,
    ToggleInput,
} from '@doist/ui-extensions-core'
import {
    AdaptiveCardService as AdaptiveCardServiceBase,
    CardActions,
    pageActions,
    ThemeService,
    TranslationService,
} from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

import { SnippetCardAction } from '../actions/action.consts'
import { SnippetOptions, SnippetService } from '../snippet/snippet.service'
import { getLastWeeksDates } from '../utils/date-utils'

import type { ProjectDataWithCompleted } from '../todoist/todoist.types'

export enum CardInputs {
    GroupBySection = 'ToggleInput.GroupBySection',
    TimeFrame = 'ChoiceSetInput.TimeFrame',
}

@Injectable()
export class AdaptiveCardsService extends AdaptiveCardServiceBase {
    constructor(
        private readonly snippetService: SnippetService,
        translationService: TranslationService,
        themeService: ThemeService,
    ) {
        super(translationService, themeService)
    }

    homeCard(): DoistCard {
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            items: [
                TextBlock.from({
                    text: 'Snippet options',
                    weight: 'bolder',
                }),
                ToggleInput.from({
                    title: 'Group tasks by section',
                    id: CardInputs.GroupBySection,
                    defaultValue: String(true),
                    spacing: 'medium',
                }),
                ChoiceSetInput.from({
                    id: CardInputs.TimeFrame,
                    label: 'Time frame',
                    defaultValue: '1',
                    choices: [
                        Choice.from({ title: 'This week', value: '0' }),
                        Choice.from({ title: 'Last week', value: '1' }),
                        Choice.from({ title: 'Two weeks ago', value: '2' }),
                        Choice.from({ title: 'Three weeks ago', value: '3' }),
                        Choice.from({ title: 'Four weeks ago', value: '4' }),
                    ],
                }),
                pageActions(
                    ActionSet.fromWithActions({
                        actions: [
                            SubmitAction.from({
                                id: SnippetCardAction.GenerateSnippet,
                                title: 'Generate snippet',
                                style: 'positive',
                                loadingText: 'Generating snippet...',
                            }),
                        ],
                    }),
                    { horizontalAlignment: 'left' },
                ),
            ],
        })
    }

    noTasksCard(weeksAgo: number): DoistCard {
        const { start: since, end: until } = getLastWeeksDates(weeksAgo)
        function formatDate(date: Date): string {
            return dayjs(date).format('MMMM D')
        }
        const dateRange = `${formatDate(since)} - ${formatDate(until)}`
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            items: [
                TextBlock.from({
                    text: `No tasks found for ${dateRange}`,
                    weight: 'bolder',
                    horizontalAlignment: 'center',
                }),
                createTextButton({
                    text: 'Try again?',
                    color: 'attention',
                    horizontalAlignment: 'center',
                    id: CardActions.GoHome,
                }),
            ],
        })
    }

    snippetPreviewCard({
        projectData,
        snippetOptions,
    }: {
        projectData: ProjectDataWithCompleted
        snippetOptions: SnippetOptions
    }): DoistCard {
        const snippet = this.snippetService.createSnippet(projectData, snippetOptions)
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            items: [
                TextBlock.from({
                    text: 'Snippet preview',
                    weight: 'bolder',
                }),
                Container.fromWithItems({
                    style: 'emphasis',
                    items: [
                        TextBlock.from({
                            text: snippet,
                            spacing: 'medium',
                        }),
                    ],
                }),
                pageActions(
                    ActionSet.fromWithActions({
                        actions: [
                            ClipboardAction.from({
                                title: 'Copy to clipboard',
                                text: snippet,
                                style: 'positive',
                            }),
                        ],
                    }),
                    { horizontalAlignment: 'left' },
                ),
            ],
        })
    }
}
