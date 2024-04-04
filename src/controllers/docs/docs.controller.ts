import Document from '../../models/doc.entity'
import { Request, Response } from 'express'

export default class DocsController {
    static async store(req: Request, res: Response){
        const { number, type } = req.body
        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        if (!number || !type){
            return res.status(400).json({erro: 'Numerodo documento e seu tipo são obrigatórios!'})
        }

        const doc = new Document()
        doc.number = number
        doc.type = type
        doc.userId = Number(userId)

        await doc.save()

        return res.status(201).json(doc)
    }

    static async index(req: Request, res: Response){
        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
            const docs = await Document.find({where: { userId: Number(userId) }})

        return res.status(200).json(docs)
    }

    static async show (req: Request, res: Response){
        const { id } = req.params 
        const { userId } = req.headers

        if (!id || isNaN(Number(id))) 
	        return res.status(400).json({erro: 'O id é obrigatório'})

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        const doc = await Document.findOneBy({id: Number(id), userId: Number(userId)})
        
        if (!doc) 
	        return res.status(404)

        return res.json(doc)    
    }

    static async delete (req: Request, res: Response) {
        const { id } = req.params
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
    
        const doc = await Document.findOneBy({id: Number(id), userId: Number(userId)})
        if (!doc) {
          return res.status(404).json({ error: 'Documento não encontrado' })
        }
    
        await doc.remove()
        return res.status(204).json()
      }

      static async update (req: Request, res: Response) {
        const { id } = req.params
        const { number, type } = req.body
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
    
        const doc = await Document.findOneBy({id: Number(id), userId: Number(userId)})
        if (!doc) {
          return res.status(404).json({ error: 'Documento não encontrado' })
        }
    
        doc.number = number ?? doc.number
        doc.type = type ?? doc.type
        await doc.save()
    
        return res.json(doc)
      }
}