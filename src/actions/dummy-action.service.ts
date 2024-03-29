import { ActionsService, Submit } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { AICastingCallAction } from '../ai-casting-call/actions/action.consts'
import { ActionsService as AICastingCallActionService } from '../ai-casting-call/actions/actions.service'
import { MarkAsCompleteCardAction } from '../mark-as-read/actions/action.consts'
import { ActionsService as CompleteActionService } from '../mark-as-read/actions/actions.service'
import { SnippetCardAction } from '../snippet-helper/actions/action.consts'
import { ActionsService as SnippetActionService } from '../snippet-helper/actions/actions.service'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
} from '@doist/ui-extensions-core'

@Injectable()
export class DummyActionService extends ActionsService {
    constructor(
        private readonly snippetActionService: SnippetActionService,
        private readonly completeActionService: CompleteActionService,
        private readonly aiCastingCallActionService: AICastingCallActionService,
    ) {
        super()
    }

    getInitialView(_request: DoistCardRequest<DoistCardAction>): Promise<DoistCardResponse> {
        throw new Error('Method not implemented.')
    }

    @Submit({ actionId: SnippetCardAction.Initial })
    getSnippetInitialView(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.snippetActionService.getInitialView(request)
    }

    @Submit({ actionId: SnippetCardAction.GenerateSnippet })
    generateSnippet(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.snippetActionService.generateSnippet(request)
    }

    @Submit({ actionId: SnippetCardAction.Help })
    snippetHelp(_request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.snippetActionService.help()
    }

    @Submit({ actionId: MarkAsCompleteCardAction.Initial })
    getCompleteInitialView(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.completeActionService.getInitialView(request)
    }

    @Submit({ actionId: MarkAsCompleteCardAction.MarkAsComplete })
    markAsComplete(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.completeActionService.markAsCompleted(request)
    }

    @Submit({ actionId: AICastingCallAction.Initial })
    getAICastingCallInitialView(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.aiCastingCallActionService.getInitialView(request)
    }

    @Submit({ actionId: AICastingCallAction.Create })
    createEpisode(request: DoistCardRequest): Promise<DoistCardResponse> {
        return this.aiCastingCallActionService.createEpisode(request)
    }
}
