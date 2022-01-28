import * as faker from 'faker'

import User from 'App/Models/User'
import Question from 'App/Models/Question'
import Answer from 'App/Models/Answer'

export class Utils {
  public static createUser() {
    const user = new User()
    user.name = `${faker.name.firstName()} ${faker.name.lastName()}`
    user.email = faker.internet.email()
    user.password = faker.internet.password()

    return user
  }

  public static createQuestion(author: User) {
    if (!author.id) {
      throw new Error('Please save the author before creating a question')
    }
    const question = new Question()
    question.title = faker.lorem.sentence().replace(/\.$/, '?')
    question.body = faker.lorem.paragraphs(4)
    question.authorId = author.id
    return question
  }

  public static createAnswer(author: User, question: Question) {
    if (!author.id) {
      throw new Error('Please save the author before creating an answer')
    }
    if (!question.id) {
      throw new Error('Please save the question before creating an answer')
    }
    const answer = new Answer()
    answer.body = faker.lorem.paragraphs(4)
    answer.authorId = author.id
    answer.questionId = question.id
    return answer
  }
}
