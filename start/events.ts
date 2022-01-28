import Event from '@ioc:Adonis/Core/Event'

Event.on('new:question', 'Question.onNewQuestion')
Event.on('new:answer', 'Answer.onNewAnswer')
