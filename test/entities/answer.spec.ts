import Database from '@ioc:Adonis/Lucid/Database'
import * as faker from 'faker'
import test from 'japa'

import Question from 'App/Models/Question'
import Answer from 'App/Models/Answer'
import User from 'App/Models/User'
import { Utils } from '../utils'

test.group('Entities -> Answer', (group) => {
  let questionAuthor: User
  let answerAuthor: User
  let question: Question

  group.beforeEach(async () => {
    const client = Database.connection()
    // The questions and answers tables should be truncated by cascade:
    await client.truncate('users', true)

    questionAuthor = Utils.createUser()
    await questionAuthor.save()

    answerAuthor = Utils.createUser()
    await answerAuthor.save()

    question = Utils.createQuestion(questionAuthor)
    await question.save()
  })

  test('should save a new answer', async (assert) => {
    const answer = Utils.createAnswer(answerAuthor, question)
    await answer.save()

    const savedAnswer = await Answer.find(answer.id)
    assert.notStrictEqual(savedAnswer, answer)
  })

  test('should retrieve the correct answer', async (assert) => {
    const answer1 = Utils.createAnswer(answerAuthor, question)
    await answer1.save()

    const answer2 = Utils.createAnswer(answerAuthor, question)
    await answer2.save()

    const retrievedAnswer1 = await Answer.find(answer1.id)
    const retrievedAnswer2 = await Answer.find(answer2.id)
    assert.deepEqual(answer1.serialize(), retrievedAnswer1!.serialize())
    assert.deepEqual(answer2.serialize(), retrievedAnswer2!.serialize())
  })

  test('should update an answer', async (assert) => {
    const answer = Utils.createAnswer(answerAuthor, question)
    await answer.save()

    const savedAnswer = await Answer.find(answer.id)
    assert.isNotNull(savedAnswer)

    savedAnswer!.body = faker.lorem.paragraphs(4)
    await savedAnswer!.save()

    const updatedAnswer = await Answer.find(answer.id)
    assert.equal(updatedAnswer!.body, savedAnswer!.body)
  })

  test('should delete an answer', async (assert) => {
    const answer = Utils.createAnswer(answerAuthor, question)
    await answer.save()

    const savedAnswer = await Answer.find(answer.id)
    assert.isNotNull(savedAnswer)

    await savedAnswer!.delete()

    const answerShouldNotExist = await Answer.find(answer.id)
    assert.isNull(answerShouldNotExist)
  })

  test('should load question through answer', async (assert) => {
    const answer = Utils.createAnswer(answerAuthor, question)
    await answer.save()
    await answer.load('question')

    assert.nestedInclude(answer.question.serialize(), question.serialize())
  })

  test('should load answers through question', async (assert) => {
    const answer1 = Utils.createAnswer(answerAuthor, question)
    await answer1.save()

    const answer2 = Utils.createAnswer(answerAuthor, question)
    await answer2.save()

    await question.load('answers')
    assert.lengthOf(question.answers, 2)
    assert.deepEqual(
      question.answers.map((a: Answer) => a.serialize()),
      [answer1.serialize(), answer2.serialize()]
    )
  })

  test('should not save an answer without a question', async (assert) => {
    const answer = new Answer()
    answer.body = faker.lorem.paragraphs(4)
    answer.authorId = answerAuthor.id

    try {
      await answer.save()
    } catch ({ message }) {
      assert.include(message, '"question_id" of relation "answers" violates not-null constraint')
    }
  })

  test('should not save an answer without an author', async (assert) => {
    const answer = new Answer()
    answer.body = faker.lorem.paragraphs(4)
    answer.questionId = question.id

    try {
      await answer.save()
    } catch ({ message }) {
      assert.include(message, '"author_id" of relation "answers" violates not-null constraint')
    }
  })

  test('should load author through answer', async (assert) => {
    const answer = Utils.createAnswer(answerAuthor, question)
    await answer.save()
    await answer.load('author')

    assert.nestedInclude(answer.author.serialize(), answerAuthor.serialize())
  })

  test('should load answers through author', async (assert) => {
    const answer1 = Utils.createAnswer(answerAuthor, question)
    await answer1.save()

    const answer2 = Utils.createAnswer(answerAuthor, question)
    await answer2.save()

    await answerAuthor.load('answers')
    assert.lengthOf(answerAuthor.answers, 2)
    assert.deepEqual(
      answerAuthor.answers.map((a: Answer) => a.serialize()),
      [answer1.serialize(), answer2.serialize()]
    )
  })
})
