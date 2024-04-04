import { Router } from 'express'
import taskRoutes from './task/task.routes'
import authRoutes from './auth/auth.routes'
import docsRoutes from './docs/docs.routes'

const routes = Router()

routes.use('/task',taskRoutes)
routes.use('/auth', authRoutes)
routes.use('/docs', docsRoutes)

export default routes