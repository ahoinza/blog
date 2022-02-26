const request = require('supertest');

const app = require('../src/app');

describe('User tests', () => {
  let userId;

  it('POST /api/users/register should create a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'test',
        email: 'test@test.com',
        profilePic:
          'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
        password: 'test123',
      })
      .expect(201)
      .expect('Content-Type', /json/);

    userId = response.body.id;

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'User created successfully.',
        user: expect.objectContaining({
          username: 'test',
          email: 'test@test.com',
          profilePic:
            'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
          role: 'User',
          password: expect.not.toBe('test123'),
        }),
      })
    );
  });

  it('POST /api/users/login should return correct user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ username: 'test', password: 'test123' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Login sucessfull.',
        user: expect.objectContaining({
          username: 'test',
          email: 'test@test.com',
          profilePic:
            'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
          role: 'User',
        }),
      })
    );
  });

  it('GET /api/users should get all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: expect.any(String),
          email: expect.any(String),
          profilePic: expect.any(String),
        }),
      ])
    );
  });

  it('GET /api/users/:uid schould get specific user', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        profilePic: expect.any(String),
      })
    );
  });

  it('PUT /api/users/:uid should update user data', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        username: 'updated',
        email: 'updated@test.com',
        profilePic:
          'https://www.seekpng.com/png/detail/506-5061704_cool-profile-avatar-picture-cool-picture-for-profile.png',
        role: 'Admin',
        password: 'updated123',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'User data updated sucessfully.',
        user: expect.objectContaining({
          username: 'updated',
          email: 'updated@test.com',
          profilePic:
            'https://www.seekpng.com/png/detail/506-5061704_cool-profile-avatar-picture-cool-picture-for-profile.png',
          role: 'Admin',
          password: expect.not.toBe('updated123'),
        }),
      })
    );
  });

  it('DELETE /api/users/:uid', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(
      expect.objectContaining({ message: 'User deleted successfully.' })
    );
  });

  // ERRORS
  it('GET /incorrect/route should throw 404 error', async () => {
    const response = await request(app)
      .get('/incorrect/route')
      .expect(404)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual(expect.objectContaining({ message: 'Route not found.' }));
  });
});
