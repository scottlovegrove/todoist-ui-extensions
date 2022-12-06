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

import { MarkAsCompleteCardAction } from '../actions/action.consts'

export enum CardInputs {
    IncludeAllSections = 'ToggleInput.IncludeAllSections',
}

@Injectable()
export class AdaptiveCardsService extends AdaptiveCardServiceBase {
    homeCard(): DoistCard {
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            items: [
                TextBlock.from({
                    text: 'Mark all tasks in this project as completed 🎉',
                    weight: 'bolder',
                }),
                ToggleInput.from({
                    spacing: 'medium',
                    id: CardInputs.IncludeAllSections,
                    title: 'Include tasks from all sections',
                    defaultValue: 'true',
                }),
                pageActions(
                    ActionSet.fromWithActions({
                        actions: [
                            SubmitAction.from({
                                title: 'Mark as completed',
                                id: MarkAsCompleteCardAction.MarkAsComplete,
                                style: 'positive',
                            }),
                        ],
                    }),
                ),
            ],
        })
    }
}
