import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeSubscriptionIdToUuid extends BaseSchema {
  protected tableName = 'subscriptions'

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
