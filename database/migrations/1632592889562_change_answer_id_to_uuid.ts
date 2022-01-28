import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeAnswerIdToUuid extends BaseSchema {
  protected tableName = 'answers'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.table(this.tableName, (table) => {
      table.string('id').primary().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id').primary().alter()
    })
  }
}
