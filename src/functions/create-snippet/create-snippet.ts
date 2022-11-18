import type { Handler } from '@netlify/functions'
import { isValidHeader } from '../../utils/header-utils'

export const handler: Handler = async (event, context) => {
    isValidHeader()
    return {
        statusCode: 200,
        body: JSON.stringify({}),
    }
}
