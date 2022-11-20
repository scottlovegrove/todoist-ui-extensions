import { AppTokenService } from '@doist/ui-extensions-server'

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'

import { TODOIST_API_BASE_URL } from './todoist.consts'

import type { Project, ProjectData, Task } from './todoist.types'

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

    async getArchivedItems(projectId: Project['id']): Promise<Task[]> {
        const { data: archivedData } = await lastValueFrom(
            this.httpService.get<{ items: Task[] }>(
                new URL('archive/items', TODOIST_API_BASE_URL).toString(),
                {
                    params: {
                        project_id: projectId,
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
}
