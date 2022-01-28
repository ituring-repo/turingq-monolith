import Database from '@ioc:Adonis/Lucid/Database'
import * as faker from 'faker'
import test from 'japa'

import Question from 'App/Models/Question'
import User from 'App/Models/User'
import { Utils } from '../utils'

test.group('Entities -> Question', (group) => {
  let author: User

  group.beforeEach(async () => {
    const client = Database.connection()
    // The questions table should be truncated by cascade:
    await client.truncate('users', true)

    author = Utils.createUser()
    await author.save()
  })

  test('should save a new question', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()

    const savedQuestion = await Question.find(question.id)
    assert.notStrictEqual(savedQuestion, question)
  })

  test('should retrieve the correct question', async (assert) => {
    const question1 = Utils.createQuestion(author)
    await question1.save()

    const question2 = Utils.createQuestion(author)
    await question2.save()

    const retrievedQuestion1 = await Question.find(question1.id)
    const retrievedQuestion2 = await Question.find(question2.id)
    assert.deepEqual(question1.serialize(), retrievedQuestion1!.serialize())
    assert.deepEqual(question2.serialize(), retrievedQuestion2!.serialize())
  })

  test('should update a question', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()

    const savedQuestion = await Question.find(question.id)
    assert.isNotNull(savedQuestion)

    savedQuestion!.title = faker.lorem.sentence().replace(/\.$/, '?')
    await savedQuestion!.save()

    const updatedQuestion = await Question.find(question.id)
    assert.equal(updatedQuestion!.title, savedQuestion!.title)
  })

  test('should delete a question', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()

    const savedQuestion = await Question.find(question.id)
    assert.isNotNull(savedQuestion)

    await savedQuestion!.delete()

    const questionShouldNotExist = await Question.find(question.id)
    assert.isNull(questionShouldNotExist)
  })

  test('should ensure views are initialized with zero', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()

    assert.equal(question.views, 0)
  })

  test('should ensure question views are computed', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()

    question.computeView()
    question.computeView()
    await question.save()

    const savedQuestion = await Question.find(question.id)
    assert.equal(savedQuestion!.views, 2)
  })

  test('should load author through question', async (assert) => {
    const question = Utils.createQuestion(author)
    await question.save()
    await question.load('author')

    assert.nestedInclude(question.author.serialize(), author.serialize())
  })

  test('should load questions through author', async (assert) => {
    const question1 = Utils.createQuestion(author)
    await question1.save()

    const question2 = Utils.createQuestion(author)
    await question2.save()

    await author.load('questions')
    assert.lengthOf(author.questions, 2)
    assert.deepEqual(
      author.questions.map((q: Question) => q.serialize()),
      [question1.serialize(), question2.serialize()]
    )
  })

  test('should not save a question without an author', async (assert) => {
    const question = new Question()
    question.title = faker.lorem.sentence().replace(/\.$/, '?')
    question.body = faker.lorem.paragraphs(4)

    try {
      await question.save()
    } catch ({ message }) {
      assert.include(message, '"author_id" of relation "questions" violates not-null constraint')
    }
  })
})
