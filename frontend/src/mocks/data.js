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
      likeUserId: ['user12', 'user2'],
      totalComment: 2,
      comment: [
        { userId: 'user1', commentBody: 'dog is the best' },
        { userId: 'user2', commentBody: 'cutie pie' },
      ],
    },
  ]