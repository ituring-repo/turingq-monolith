import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// TODO: add missing tests
export default class AuthController {
  public async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    // Please note that the expired tokens are not removed from the database.
    // See https://docs.adonisjs.com/guides/auth/api-tokens-guard#managing-tokens-expiry for details.

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: Env.get('AUTH_TOKEN_EXPIRATION_MINUTES') + 'mins',
    })
    return token
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
