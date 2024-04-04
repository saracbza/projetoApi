import { Router } from 'express'
import TaskController from '../../controllers/task/task.controller'
import DocsController from '../../controllers/docs/docs.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const docsRoutes = Router()

docsRoutes.post('/', authMiddleware, DocsController.store)
docsRoutes.get('/', authMiddleware, DocsController.index)
docsRoutes.get('/:id', authMiddleware, DocsController.show)
docsRoutes.delete('/:id', authMiddleware, DocsController.delete)
docsRoutes.put('/:id', authMiddleware, DocsController.update)

export default docsRoutes