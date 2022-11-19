import { ActionsService as ActionsServiceBase, Submit } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { AdaptiveCardsService } from '../adaptivecards/adaptivecards.service'

import { SnippetCardAction } from './action.consts'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
} from '@doist/ui-extensions-core'

@Injectable()
export class ActionsService extends ActionsServiceBase {
    constructor(private readonly adaptiveCardsService: AdaptiveCardsService) {
        super()
    }

    getInitialView(_request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        return Promise.resolve({
            card: this.adaptiveCardsService.homeCard(),
        })
    }

    @Submit({ actionId: SnippetCardAction.GenerateSnippet })
    generateSnippet(_request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        return Promise.resolve({
            card: this.adaptiveCardsService.homeCard(),
        })
    }
}
