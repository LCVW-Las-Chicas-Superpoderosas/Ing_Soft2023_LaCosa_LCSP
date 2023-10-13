import { setupWorker } from 'msw'
import { handlers } from './handlers'
import { cardHandlers } from './cardHandlers'

export const worker = setupWorker(...handlers, ...cardHandlers);