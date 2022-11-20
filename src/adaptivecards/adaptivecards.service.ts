import {
    ActionSet,
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
    pageActions,
    ThemeService,
    TranslationService,
} from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { SnippetCardAction } from '../actions/action.consts'
import { SnippetOptions, SnippetService } from '../snippet/snippet.service'

import type { ProjectDataWithCompleted } from '../todoist/todoist.types'

export enum CardInputs {
    GroupBySection = 'ToggleInput.GroupBySection',
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

    noTasksCard(): DoistCard {
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            items: [
                TextBlock.from({
                    text: 'No tasks found for last week.',
                    weight: 'bolder',
                    horizontalAlignment: 'center',
                }),
                createTextButton({
                    text: 'Try again?',
                    color: 'attention',
                    horizontalAlignment: 'center',
                    id: SnippetCardAction.GenerateSnippet,
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
