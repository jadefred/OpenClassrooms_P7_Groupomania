// src/mocks/handlers.js
import { rest } from 'msw'
import Cookies from 'js-cookie'
import { allPost } from './data'

export const handlers = [
  //Usert
  //POST - login
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
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        admin: true,
        avatarUrl:
          'https://i.pinimg.com/originals/7f/a7/c8/7fa7c83d9fa9c44cb774a08b0b596219.jpg',
      })
    )
  }),

  //POST - refresh access token
  rest.post('/api/auth/refresh', (req, res, ctx) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Refresh token not found, try again' })
      )
    }
    return res(
      ctx.status(200),
      ctx.json({ accessToken: 'refreshed-new-access-token' })
    )
  }),

  //POST - confirm header is set
  rest.post('/api/auth/protected', (req, res, ctx) => {
    let token = req.headers.headers['authorization']
    if (!token) {
      return res(ctx.status(401), ctx.json({ message: 'Access token expired' }))
    }
    return res(ctx.json({ message: 'protected content' }))
  }),

  //POST - signup
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email } = req.body
    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'signup failed' }))
    }

    return res(ctx.json({ message: 'signup success' }))
  }),

  //GET - get all posts
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

  //GET - get one post
  rest.get('/api/posts/:id', (req, res, ctx) => {
    const postId = req.url.searchParams.get('id')
    console.log('entered')
    if (postId === 'post1') {
      return res(ctx.status(200), ctx.json({ messgae: 'success' }))
    }
  }),

  //POST - new post
  rest.post('/api/posts', (req, res, ctx) => {
    console.log(req.body)
    return res(ctx.status(200), ctx.json({ message: 'created post' }))
  }),

  //PUT - modify one post :id
  rest.put('/api/posts', (req, res, ctx) => {
    const postId = req.url.searchParams.get('id')
    console.log(req.body)

    if (!postId) {
      return res(ctx.status(404), ctx.json({ message: 'Post not found' }))
    }
    return res(ctx.status(201), ctx.json({ message: 'post modified' }))
  }),

  //POST - Like post
  rest.post('/api/posts/like', (req, res, ctx) => {
    const like = req.body.like

    if (like === 1) {
      return res(ctx.status(200), ctx.json({ message: 'user liked' }))
    }
    if (like === 0) {
      return res(
        ctx.status(201),
        ctx.json({ message: 'user retrieved the like' })
      )
    }
    if (!like) {
      return res(ctx.status(401), ctx.json({ message: 'Like undefined' }))
    }
  }),

  //POST - delete comment
  rest.delete('/api/posts/comments', (req, res, ctx) => {
    if (req.body.commentId === '1') {
      return res(
        ctx.status(500),
        ctx.json({ message: 'failed to delete this comment' })
      )
    }

    return res(ctx.status(200), ctx.json({ message: 'comment deleted' }))
  }),
]
