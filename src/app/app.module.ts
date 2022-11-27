import {
    AppController,
    CoreModule,
    createWorkflowInitialActionMiddleware,
    ErrorModule,
    useEndpoint,
    WorkflowInitialActionMap,
} from '@doist/ui-extensions-server'

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { ActionsModule } from '../actions/actions.module'
import { SnippetCardAction } from '../snippet-helper/actions/action.consts'

const workflowInitialActionMap: WorkflowInitialActionMap = {
    'snippet-helper': {
        actionType: 'submit',
        actionId: SnippetCardAction.Initial,
    },
}

@Module({
    imports: [
        CoreModule,
        ErrorModule.forRoot({
            errorCardOptions: {
                helpCenterLink: 'https://tbd.com',
            },
        }),
        ActionsModule,
    ],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                createWorkflowInitialActionMiddleware({
                    workflowInitialActionMap,
                    queryStringFieldName: 'extension',
                }),
            )
            .forRoutes(useEndpoint('process'))
    }
}
