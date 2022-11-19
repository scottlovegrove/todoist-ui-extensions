import { ActionsService as ActionsServiceBase, Submit } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { AdaptiveCardsService } from '../adaptivecards/adaptivecards.service'
import { TodoistService } from '../todoist/todoist.service'

import { SnippetCardAction } from './action.consts'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
    TodoistContextMenuData,
} from '@doist/ui-extensions-core'

@Injectable()
export class ActionsService extends ActionsServiceBase {
    constructor(
        private readonly adaptiveCardsService: AdaptiveCardsService,
        private readonly todoistService: TodoistService,
    ) {
        super()
    }

    getInitialView(_request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        return Promise.resolve({
            card: this.adaptiveCardsService.homeCard(),
        })
    }

    @Submit({ actionId: SnippetCardAction.GenerateSnippet })
    async generateSnippet(request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        const { sourceId: projectId } = request.action.params as TodoistContextMenuData
        const projectData = await this.todoistService.getProjectData(projectId)
        return {
            card: this.adaptiveCardsService.snippetPreviewCard({ projectData }),
        }
    }
}
