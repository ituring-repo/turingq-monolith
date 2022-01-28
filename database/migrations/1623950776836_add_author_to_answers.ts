import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddAuthorToAnswers extends BaseSchema {
  protected tableName = 'answers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('author_id').notNullable().unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('author_id')
    })
  }
}
