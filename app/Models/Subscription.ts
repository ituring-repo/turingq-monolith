import { DateTime } from 'luxon'
import { column, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

import Question from 'App/Models/Question'
import User from 'App/Models/User'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class Subscription extends IdentifiableModel {
  @column()
  public userId: string

  @column()
  public questionId: string

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @hasOne(() => Question, { foreignKey: 'questionId' })
  public question: HasOne<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
