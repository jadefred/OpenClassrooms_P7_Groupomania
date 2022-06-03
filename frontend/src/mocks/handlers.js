// src/mocks/handlers.js
import { rest } from 'msw'
import Cookies from 'js-cookie'

//mock post data
const allPost = [
  {
    _id: 'id of post 1',
    userId: 'user1',
    username: 'normal_user1',
    title: 'Cutest dog',
    content: 'Bla bla bla....',
    imageUrl:
      'https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg',
    like: 1,
    likeUserId: ['user1', 'user2'],
    totalComment: 1,
    comment: [{ userId: 'user1', commentBody: 'I love dog' }],
  },
  {
    _id: 'id of post 2',
    userId: 'user2',
    username: 'normal_user2',
    title: 'Cutest cat',
    content: 'Bla bla bla....',
    imageUrl: '',
    like: 12,
    likeUserId: ['user1', 'user2'],
    totalComment: 2,
    comment: [
      { userId: 'user1', commentBody: 'dog is the best' },
      { userId: 'user2', commentBody: 'cutie pie' },
    ],
  },
]

export const handlers = [
  ///////////////////login///////////////////
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email } = req.body

    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'user not exist' }))
    }

    return res(
      ctx.status(200),
      ctx.json({
        _id: 'user1',
        username: 'doge',
        token: 'jwt',
        accessToken: 'this-is-an-accessToken',
        refreshToken: 'this-is-a-refreshToken',
      })
    )
  }),

  rest.post('/api/auth/refresh', (req, res, ctx) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Refresh token not found, try again' })
      )
    }
    return res(ctx.json({ accessToken: 'refreshed new access token' }))
  }),

  //check if the
  rest.post('/api/auth/protected', (req, res, ctx) => {
    let token = req.headers.headers['authorization']
    if (!token) {
      return res(ctx.status(401), ctx.json({ message: 'Access token expired' }))
    }
    return res(ctx.json({ message: 'protected content' }))
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
    const isAuthenticated = Cookies.get('accessToken')
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
    return res(ctx.status(200), ctx.json(allPost))
  }),
]
