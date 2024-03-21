import Task from '../../models/Task'
import { Request, Response } from 'express'

export default class TaskController {
    static async store(req: Request, res: Response){
        const { title, completed } = req.body

        if (!title){
            return res.status(400).json({erro: 'Título é obrigatório!'})
        }

        const task = new Task()
        task.title = title
        task.completed = completed ?? false

        await task.save()

        return res.status(201).json(task)
    }

    static async index(req: Request, res: Response){

        const tasks = await Task.find()

        return res.status(200).json(tasks)
    }
}