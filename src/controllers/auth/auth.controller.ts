import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../../models/user.entity'
import Token from '../../models/token.entity'

export default class AuthController{
    static async store (req: Request, res: Response){
        const {name,email,password} = req.body

        if(!name) return res.status(400).json({error: "Nome obrigatório!"})
        if(!email) return res.status(400).json({error: "Email obrigatório!"})
        if(!password) return res.status(400).json({error: "Senha obrigatório!"})

        // verificao se o email ja existe
        const userCheck = await User.findOneBy({ email })
        if (userCheck) return res.status(400).json({ error: 'Email já cadastrado' })

        const user = new User()
        user.name = name
        user.email = email
        user.password = bcrypt.hashSync(password, 10)
        await user.save()

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email
        }) 
    }

    static async login (req: Request, res: Response){
        const {email, password} = req.body

        if (!email || !password) return res.status(400).json({error: "Email e senha são obrigatórios"})

        const user = await User.findOneBy ({email})
        if (!user) return res.status(401).json({error: "Usuário não encontrado"})

        const passwCheck = bcrypt.compareSync(password, user.password)
        if (!passwCheck) return res.status(401).json({error: "Senha inválida"})

        await Token.delete({user: {id: user.id}})

        const token = new Token()
        
        const stringRand = user.id + new Date().toString() 
        token.token = bcrypt.hashSync(stringRand, 1).slice(-20)

        token.expiredAt = new Date (Date.now()+60*60*1000) //expirar token em 1 hora

        token.refreshToken = bcrypt.hashSync(stringRand+2, 1).slice(-20)

        token.user = user
        await token.save()

        res.cookie('token', token.token, { httpOnly: true, secure: true, sameSite: 'none' })

        return res.json({
            token: token.token,
            expiredAt: token.expiredAt,
            refreshToken: token.refreshToken
        })
    }

    static async refresh (req: Request, res: Response) {
        const { authorization } = req.headers
    
        if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })
    
        const token = await Token.findOneBy({ refreshToken: authorization })
        if (!token) return res.status(401).json({ error: 'Refresh token inválido' })
    
        // verificao se o refresh token ainda é válido
        if (token.expiredAt < new Date()) {
          await token.remove()
          return res.status(401).json({ error: 'Refresh token expirado' })
        }
    
        // atualiza os tokens
        token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        token.expiredAt = new Date(Date.now() + 60 * 60 * 1000)
        await token.save()
    
        res.cookie('token', token.token, { httpOnly: true, secure: true, sameSite: 'none' })
        return res.json({
          token: token.token,
          expiresAt: token.expiredAt,
          refreshToken: token.refreshToken
        })
      }
    
      static async logout (req: Request, res: Response) {
        const { authorization } = req.headers
        
        if (!authorization) return res.status(400).json({ error: 'O token é obrigatório' })
    
        const userToken = await Token.findOneBy({ token: authorization })
        if (!userToken) return res.status(401).json({ error: 'Token inválido' })
    
        // remove o token
        await userToken.remove()
    
        // remove o cookie
        res.clearCookie('token')
    
        return res.status(204).json()
      }
}