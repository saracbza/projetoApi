import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../../models/user.entity'

export default class AuthController{
    static async store (req: Request, res: Response){
        const {name,email,password} = req.body

        if(!name) return res.status(400).json({error: "Nome obrigatório!"})
        if(!email) return res.status(400).json({error: "Email obrigatório!"})
        if(!password) return res.status(400).json({error: "Senha obrigatório!"})

        const user = new User()
        user.name = name
        user.email = email
        user.password = bcrypt.hashSync(password, 10)
        await user.save()

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email
        }) 
    }
}