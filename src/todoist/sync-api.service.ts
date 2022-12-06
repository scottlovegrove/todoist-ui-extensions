import { randomUUID } from 'crypto'

import { AppTokenService } from '@doist/ui-extensions-server'

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'

import { TODOIST_API_BASE_URL } from './todoist.consts'

import type { Project, ProjectData, Section, Task } from './todoist.types'

type ArchivedRequest = {
    projectId?: Project['id']
    sectionId?: Section['id']
}

@Injectable()
export class SyncApiService {
    constructor(
        private readonly appTokenService: AppTokenService,
        private readonly httpService: HttpService,
    ) {}

    async getProject(projectId: Project['id']): Promise<ProjectData> {
        const { data: projectData } = await lastValueFrom(
            this.httpService.get<ProjectData>(
                new URL('projects/get_data', TODOIST_API_BASE_URL).toString(),
                {
                    params: {
                        project_id: projectId,
                    },
                    headers: {
                        Authorization: `Bearer ${this.appTokenService.appToken}`,
                    },
                },
            ),
        )

        return projectData
    }

    async getArchivedItems({ projectId, sectionId }: ArchivedRequest): Promise<Task[]> {
        const { data: archivedData } = await lastValueFrom(
            this.httpService.get<{ items: Task[] }>(
                new URL('archive/items', TODOIST_API_BASE_URL).toString(),
                {
                    params: {
                        project_id: projectId,
                        section_id: sectionId,
                        limit: 100,
                    },
                    headers: {
                        Authorization: `Bearer ${this.appTokenService.appToken}`,
                    },
                },
            ),
        )
        return archivedData.items
    }

    async getCompletedForProject({
        projectId,
        since,
        until,
    }: {
        projectId: Project['id']
        since: Date
        until: Date
    }): Promise<Task[]> {
        const { data: completedData } = await lastValueFrom(
            this.httpService.get<{ items: Task[] }>(
                new URL('completed/get_all', TODOIST_API_BASE_URL).toString(),
                {
                    params: {
                        project_id: projectId,
                        limit: 50,
                        since: since.toISOString(),
                        until: until.toISOString(),
                    },
                    headers: {
                        Authorization: `Bearer ${this.appTokenService.appToken}`,
                    },
                },
            ),
        )
        return completedData.items
    }

    async markTasksAsCompleted(tasks: Task[]): Promise<void> {
        await lastValueFrom(
            this.httpService.post(
                new URL('sync', TODOIST_API_BASE_URL).toString(),
                {
                    commands: this.createTaskCompleteCommands(tasks),
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.appTokenService.appToken}`,
                    },
                },
            ),
        )
    }

    private createTaskCompleteCommands(
        tasks: Task[],
    ): { type: 'item_complete'; uuid: string; args: { id: Task['id'] } }[] {
        return tasks.map((task) => ({
            type: 'item_complete',
            uuid: randomUUID(),
            args: {
                id: task.id,
            },
        }))
    }
}
