const request = require('supertest')

const server = require('../server')
const db = require('../db/posts')
// const dbUsers = require('../db/users')
// const auth0 = require('../routes/auth')
const log = require('../logger')

jest.mock('../logger')
// jest.mock('../db/gardens')
// jest.mock('../db/users')
jest.mock('../db/posts')
// jest.mock('../routes/auth')

const mockPost = {
  id: 1,
  garden_id: 1,
  author: 1,
  title: 'Test Post',
  content: 'This is a test post'
  // created_on: '' I think this should auto complete?
}

const mockPostsForGarden = [
  {
    id: 1,
    garden_id: 1,
    author: 1,
    first_name: 'Admin',
    last_name: 'User',
    title: 'Test Post',
    content: 'This is a test post',
    created_on: '29/11/2021'
  },
  {
    id: 2,
    garden_id: 1,
    author: 1,
    first_name: 'Admin',
    last_name: 'User',
    title: 'Test Post 2',
    content: 'This is test post 2',
    created_on: '29/11/2021'
  }
]

describe('POST /api/v1/posts/:gardenid', () => {
  it('responds with blog posts for the specific garden', () => {
    db.getPostsByGardenId.mockImplementation(() => Promise.resolve(mockPostsForGarden))
    return request(server)
      .post('/api/v1/posts/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body.posts).toEqual(mockPostsForGarden)
        expect(res.body.posts).toHaveLength(2)
        return null
      })
  })

  it('responds with 500 and correct error object on DB error', () => {
    db.getPostsByGardenId.mockImplementation(() => Promise.reject(
      new Error('mock getPostsByGardenId error')
    ))
    return request(server)
      .get('/api/v1/posts/1')
      .expect('Content-Type', /json/)
      .expect(500)
      .then(res => {
        expect(log).toHaveBeenCalledWith('mock getPostsByGardenId error')
        expect(res.body.error.title).toBe('Unable to retrieve posts')
        return null
      })
  })
})
