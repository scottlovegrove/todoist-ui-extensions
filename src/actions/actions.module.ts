import { ActionsService } from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { ActionsModule as SnippetActionsModule } from '../snippet-helper/actions/actions.module'

import { DummyActionService } from './dummy-action.service'

@Module({
    imports: [SnippetActionsModule],
    providers: [
        DummyActionService,
        {
            provide: ActionsService,
            useExisting: DummyActionService,
        },
    ],
    exports: [ActionsService, SnippetActionsModule],
})
export class ActionsModule {}
