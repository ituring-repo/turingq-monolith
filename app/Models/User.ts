import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Answer from 'App/Models/Answer'
import Question from 'App/Models/Question'
import Subscription from 'App/Models/Subscription'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class User extends IdentifiableModel {
  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Question, { foreignKey: 'authorId' })
  public questions: HasMany<typeof Question>

  @hasMany(() => Answer, { foreignKey: 'authorId' })
  public answers: HasMany<typeof Answer>

  @hasMany(() => Subscription, { foreignKey: 'userId' })
  public subscriptions: HasMany<typeof Subscription>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
