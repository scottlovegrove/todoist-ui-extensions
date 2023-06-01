import { randomUUID } from 'crypto'

import {
    ActionsService as ActionsServiceBase,
    DoistCardBridgeFactory,
    Submit,
} from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { TodoistService } from '../../todoist/todoist.service'
import { AdaptiveCardsService, CardInputs } from '../adaptivecards/adaptivecards.service'

import { AICastingCallAction } from './action.consts'

import type {
    DoistCardRequest,
    DoistCardResponse,
    TodoistContextMenuData,
} from '@doist/ui-extensions-core'
import type { Task } from '../../todoist/todoist.types'

@Injectable()
export class ActionsService extends ActionsServiceBase {
    constructor(
        private readonly adaptiveCardsService: AdaptiveCardsService,
        private readonly todoistService: TodoistService,
    ) {
        super()
    }

    @Submit({ actionId: AICastingCallAction.Initial })
    getInitialView(_request: DoistCardRequest): Promise<DoistCardResponse> {
        const card = this.adaptiveCardsService.homeCard()
        return Promise.resolve({
            card,
        })
    }

    @Submit({ actionId: AICastingCallAction.Create })
    async createEpisode(request: DoistCardRequest): Promise<DoistCardResponse> {
        const { inputs } = request.action
        const { sourceId: projectId } = request.action.params as TodoistContextMenuData
        const episodeName = inputs?.[CardInputs.EpisodeName] as string
        const epiosdeTasks = this.createEpisodeTasks({ episodeName, projectId })

        await this.todoistService.addTasks(epiosdeTasks)

        const notificationBridge = DoistCardBridgeFactory.requestSync({
            text: 'Episode created',
            type: 'success',
        })

        return {
            bridges: [notificationBridge, DoistCardBridgeFactory.finished],
        }
    }

    private createEpisodeTasks({
        episodeName,
        projectId,
    }: {
        episodeName: string
        projectId: string
    }): Partial<Task>[] {
        const parentTask: Partial<Task> = {
            content: episodeName,
            labels: ['ai-casting-call'],
            project_id: projectId,
            id: randomUUID(),
        }

        const recordedTask: Partial<Task> = {
            content: 'Record episde',
            labels: ['ai-casting-call'],
            project_id: projectId,
            parent_id: parentTask.id,
            id: randomUUID(),
        }

        const editTask: Partial<Task> = {
            content: 'Edit episode',
            labels: ['ai-casting-call'],
            project_id: projectId,
            parent_id: parentTask.id,
            id: randomUUID(),
        }

        const publishTask: Partial<Task> = {
            content: 'Publish episode',
            labels: ['ai-casting-call'],
            project_id: projectId,
            parent_id: parentTask.id,
            id: randomUUID(),
        }

        return [parentTask, recordedTask, editTask, publishTask]
    }
}
