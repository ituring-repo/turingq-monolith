import { DateTime } from 'luxon'
import { beforeCreate, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Answer from 'App/Models/Answer'
import User from 'App/Models/User'

import IdentifiableModel from 'App/Helpers/Orm/IdentifiableModel'

export default class Question extends IdentifiableModel {
  @column()
  public title: string

  @column()
  public body: string

  @column()
  public views: number

  @column()
  public authorId: string

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @hasMany(() => Answer)
  public answers: HasMany<typeof Answer>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public computeView() {
    if (!this.views) {
      this.views = 0
    }
    this.views++
  }

  @beforeCreate()
  public static initViews(question) {
    if (!question.views) {
      question.views = 0
    }
  }
}
