import {
    ActionSet,
    DoistCard,
    SubmitAction,
    TextBlock,
    ToggleInput,
} from '@doist/ui-extensions-core'
import {
    AdaptiveCardService as AdaptiveCardServiceBase,
    pageActions,
} from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { SnippetCardAction } from '../actions/action.consts'

export enum CardInputs {
    GroupBySection = 'ToggleInput.GroupBySection',
}

@Injectable()
export class AdaptiveCardsService extends AdaptiveCardServiceBase {
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
                            }),
                        ],
                    }),
                    { horizontalAlignment: 'left' },
                ),
            ],
        })
    }
}
