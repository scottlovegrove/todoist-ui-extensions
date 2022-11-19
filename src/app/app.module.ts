import { AppController, CoreModule, ErrorModule } from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { ActionsModule } from '../actions/actions.module'

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
export class AppModule {}
