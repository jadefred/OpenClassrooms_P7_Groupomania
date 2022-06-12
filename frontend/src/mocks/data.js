export const allPost = [
  {
    postId: 'post1',
    userId: 'user1',
    username: 'username1',
    avatarUrl: 'https://cdn.wallpapersafari.com/82/44/1eWzS9.jpg',
    title: 'Cutest dog',
    content: 'Bla bla bla....',
    imageUrl:
      'https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg',
    like: 1,
    likeUserId: ['user1', 'user2'],
    totalComment: 1,
    comment: [
      {
        commentId: '1',
        userId: 'user2',
        commentBody: 'I love dog',
        username: 'user2',
        avatarUrl:
          'https://knowtechie.com/wp-content/uploads/2021/03/dogecoin-meme-1000x600.jpg',
        imageUrl:
          'https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg',
      },
    ],
  },
  {
    postId: 'post2',
    userId: 'user2',
    username: 'username2',
    avatarUrl:
      'https://knowtechie.com/wp-content/uploads/2021/03/dogecoin-meme-1000x600.jpg',
    title: 'Cutest cat',
    content: 'Bla bla bla....',
    imageUrl: '',
    like: 12,
    likeUserId: ['user12', 'user2'],
    totalComment: 2,
    comment: [
      {
        commentId: '2',
        userId: 'user1',
        commentBody: 'dog is life, dog is love',
        username: 'user1',
        avatarUrl: 'https://cdn.wallpapersafari.com/82/44/1eWzS9.jpg',
      },
      {
        commentId: '3',
        userId: 'user3',
        commentBody: 'cutie pie',
        username: 'user3',
        avatarUrl:
          'https://i.pinimg.com/originals/46/88/a7/4688a7597e5dd8b925da5374251d6df1.jpg',
      },
    ],
  },
]

export const allUsers = [
  {
    _id: 'user1',
    username: 'smart doge',
    avatarUrl:
      'https://www.rd.com/wp-content/uploads/2020/11/GettyImages-889552354-e1606774439626.jpg',
    email: 'email@email.com',
    password: 'PASSword1234',
    admin: false,
  },
  {
    _id: 'user2',
    username: 'cute dog',
    avatarUrl: '',
    email: 'test@email.com',
    password: 'PASSword1234',
    admin: false,
  },
  {
    _id: 'user3',
    username: 'hungry dog',
    avatarUrl: '',
    email: 'feedme@email.com',
    password: 'PASSword1234',
    admin: false,
  },
]
