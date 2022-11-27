import { ActionsService, Submit } from '@doist/ui-extensions-server'

import { Injectable } from '@nestjs/common'

import { SnippetCardAction } from '../snippet-helper/actions/action.consts'
import { ActionsService as SnippetActionService } from '../snippet-helper/actions/actions.service'

import type {
    DoistCardAction,
    DoistCardRequest,
    DoistCardResponse,
} from '@doist/ui-extensions-core'

@Injectable()
export class DummyActionService extends ActionsService {
    constructor(private readonly snippetActionService: SnippetActionService) {
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
}
