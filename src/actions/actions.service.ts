import { ActionsService as ActionsServiceBase, Submit } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { AdaptiveCardsService, CardInputs } from '../adaptivecards/adaptivecards.service'
import { TodoistService } from '../todoist/todoist.service'

import { SnippetCardAction } from './action.consts'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
    TodoistContextMenuData,
} from '@doist/ui-extensions-core'
import type { SnippetOptions } from '../snippet/snippet.service'

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
        const { weeksAgo, ...snippetOptions } = this.getOptions(request)
        const projectData = await this.todoistService.getProjectData(projectId, weeksAgo)

        if (projectData.completedTasks.length === 0 && projectData.items.length === 0) {
            return {
                card: this.adaptiveCardsService.noTasksCard(weeksAgo),
            }
        }
        return {
            card: this.adaptiveCardsService.snippetPreviewCard({
                projectData,
                snippetOptions,
            }),
        }
    }

    private getOptions(
        request: DoistCardRequest<DoistCardAction>,
    ): SnippetOptions & { weeksAgo: number } {
        const { inputs } = request.action
        return {
            groupBySection: inputs?.[CardInputs.GroupBySection] === 'true',
            weeksAgo: Number(inputs?.[CardInputs.TimeFrame] ?? 1),
        }
    }
}
