export const allPost = [
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
    comment: [{ commentId: '1', userId: 'user2', commentBody: 'I love dog', username: 'user2', avatarUrl: 'https://knowtechie.com/wp-content/uploads/2021/03/dogecoin-meme-1000x600.jpg' }],
  },
  {
    _id: 'id of post 2',
    userId: 'user2',
    username: 'normal_user2',
    title: 'Cutest cat',
    content: 'Bla bla bla....',
    imageUrl: '',
    like: 12,
    likeUserId: ['user12', 'user2'],
    totalComment: 2,
    comment: [
      { commentId: '2', userId: 'user1', commentBody: 'dog is life, dog is love', username: 'user1', avatarUrl: 'https://cdn.wallpapersafari.com/82/44/1eWzS9.jpg' },
      { commentId: '3', userId: 'user3', commentBody: 'cutie pie', username: 'user3', avatarUrl: 'https://i.pinimg.com/originals/46/88/a7/4688a7597e5dd8b925da5374251d6df1.jpg' },
    ],
  },
]

export const allUsers = [
  {
    _id: 'user1',
    username: 'smart doge',
    avatarUrl: 'testavatar.img',
    email: 'email@email.com',
    password: 'PASSword1234',
  },
  {
    _id: 'user2',
    username: 'cute dog',
    avatarUrl: '',
    email: 'test@email.com',
    password: 'PASSword1234',
  },
  {
    _id: 'user3',
    username: 'hungry dog',
    avatarUrl: '',
    email: 'feedme@email.com',
    password: 'PASSword1234',
  },
]
