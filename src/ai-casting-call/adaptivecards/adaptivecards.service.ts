import { DoistCard, SubmitAction, TextBlock, TextInput } from '@doist/ui-extensions-core'
import { AdaptiveCardService as AdaptiveCardServiceBase } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { AICastingCallAction } from '../actions/action.consts'

export enum CardInputs {
    EpisodeName = 'TextInput.EpisodeName',
}

@Injectable()
export class AdaptiveCardsService extends AdaptiveCardServiceBase {
    homeCard(): DoistCard {
        return DoistCard.fromWithItems({
            doistCardVersion: '0.6',
            autoFocusId: CardInputs.EpisodeName,
            items: [
                TextBlock.from({
                    text: 'AI Casting Call',
                    weight: 'bolder',
                    size: 'large',
                }),
                TextInput.from({
                    label: 'Episode Name',
                    id: CardInputs.EpisodeName,
                    placeholder: 'Enter episode name',
                    inlineAction: SubmitAction.from({
                        id: AICastingCallAction.Create,
                        title: 'Create episode',
                        style: 'positive',
                        loadingText: 'Creating episode tasks...',
                    }),
                }),
            ],
        })
    }
}
