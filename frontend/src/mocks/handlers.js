// src/mocks/handlers.js
import { rest } from 'msw'

//mock post data
const allPost = [
  {
    _id: 'post1',
    userId: 'user1',
    username: 'normal_user1',
    title: 'Cutest dog',
    content: 'Bla bla bla....',
    imageUrl: '',
    like: 10,
    likeUserId: ['user1', 'user2'],
  },
  {
    _id: 'post2',
    userId: 'user2',
    username: 'normal_user2',
    title: 'Cutest cat',
    content: 'Bla bla bla....',
    imageUrl: '',
    like: 12,
    likeUserId: ['user1', 'user2'],
  },
]

export const handlers = [
  ///////////////////login///////////////////
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email } = req.body

    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'user not exist' }))
    }

    return res(ctx.json({ username: 'doge', token: 'jwt' }))
  }),

  ///////////////////signup///////////////////
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email } = req.body
    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'signup failed' }))
    }

    return res(ctx.json({ message: 'signup success' }))
  }),

  ///////////////////all posts///////////////////
  rest.get('/api/posts', (req, res, ctx) => {
    const isAuthenticated = localStorage.getItem('authentication')
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        })
      )
    }
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json({ allPost }))
  }),
]
