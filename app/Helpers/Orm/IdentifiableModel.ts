import { column, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class IdentifiableModel extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @beforeCreate()
  public static async createUUID(identifiableModel: IdentifiableModel) {
    identifiableModel.id = uuid()
  }
}
