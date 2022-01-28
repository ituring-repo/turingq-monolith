import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeQuestionIdToUuid extends BaseSchema {
  protected tableName = 'questions'

  public async up() {
    this.schema.alterTable('subscriptions', (table) => {
      table.dropForeign('question_id')
    })

    this.schema.alterTable('answers', (table) => {
      table.dropForeign('question_id')
    })

    this.schema.table(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.table(this.tableName, (table) => {
      table.string('id').primary().alter()
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.string('question_id').references('questions.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('answers', (table) => {
      table.string('question_id').references('questions.id').onDelete('CASCADE').alter()
    })
  }

  public async down() {
    this.schema.alterTable('subscriptions', (table) => {
      table.dropForeign('question_id')
    })

    this.schema.alterTable('answers', (table) => {
      table.dropForeign('question_id')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id').primary().alter()
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.integer('question_id').references('questions.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('answers', (table) => {
      table.integer('question_id').references('questions.id').onDelete('CASCADE').alter()
    })
  }
}
