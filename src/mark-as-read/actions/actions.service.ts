import {
    ActionsService as ActionsServiceBase,
    DoistCardBridgeFactory,
} from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { TodoistService } from '../../todoist/todoist.service'
import { AdaptiveCardsService, CardInputs } from '../adaptive-cards/adaptivecards.service'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
    TodoistContextMenuData,
} from '@doist/ui-extensions-core'

@Injectable()
export class ActionsService extends ActionsServiceBase {
    constructor(
        private readonly adaptiveCardService: AdaptiveCardsService,
        private readonly todoistService: TodoistService,
    ) {
        super()
    }

    getInitialView(_request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        return Promise.resolve({
            card: this.adaptiveCardService.homeCard(),
        })
    }

    async markAsCompleted(request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        const { sourceId: projectId } = request.action.params as TodoistContextMenuData

        const includeSections = request.action.inputs?.[CardInputs.IncludeAllSections] === 'true'

        await this.todoistService.markProjectAsCompleted(projectId, includeSections)

        return {
            bridges: [
                DoistCardBridgeFactory.requestSync({
                    text: 'Project marked as completed',
                    type: 'success',
                }),
                DoistCardBridgeFactory.finished,
            ],
        }
    }
}
