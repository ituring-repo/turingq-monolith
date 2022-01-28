import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import RegistrationValidator from 'App/Validators/RegistrationValidator'

export default class RegistrationsController {
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(RegistrationValidator)

    const user = new User()
    user.name = payload.name
    user.email = payload.email
    user.password = payload.password

    await user.save()

    return response.created(user.toJSON())
  }
}
