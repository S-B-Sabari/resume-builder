import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 1. Mock the Mongoose User model using unstable_mockModule for ES Modules
jest.unstable_mockModule('../models/User.js', () => {
  return {
    default: {
      findOne: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    },
  };
});

// 2. Dynamically import dependencies so the mock is registered beforehand
const User = (await import('../models/User.js')).default;
const app = (await import('../server.js')).default;

describe('Authentication API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('POST /api/users/register', () => {
    it('AUTH-01: should register a new user successfully', async () => {
      const mockUser = {
        _id: 'mock_user_123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(User.create).toHaveBeenCalled();
    });

    it('AUTH-02: should fail registration if email already exists', async () => {
      const mockExistingUser = {
        _id: 'mock_user_123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      User.findOne.mockResolvedValue(mockExistingUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
      expect(User.create).not.toHaveBeenCalled();
    });

    it('AUTH-03: should fail registration if fields are missing', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'John Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Missing required fields');
      expect(User.findOne).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/users/login', () => {
    it('AUTH-04: should login successfully with correct credentials', async () => {
      const mockUser = {
        _id: 'mock_user_123',
        name: 'John Doe',
        email: 'john@example.com',
        comparePassword: jest.fn().mockReturnValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('john@example.com');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    });

    it('AUTH-05: should fail login with incorrect password or non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      let response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');

      const mockUser = {
        _id: 'mock_user_123',
        name: 'John Doe',
        email: 'john@example.com',
        comparePassword: jest.fn().mockReturnValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('GET /api/users/data', () => {
    it('AUTH-06: should return user details when valid token is provided', async () => {
      const mockUser = {
        _id: 'mock_user_123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      User.findById.mockResolvedValue(mockUser);

      const token = jwt.sign({ userId: 'mock_user_123' }, 'test_secret');

      const response = await request(app)
        .get('/api/users/data')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user._id).toBe('mock_user_123');
      expect(User.findById).toHaveBeenCalledWith('mock_user_123');
    });

    it('AUTH-07: should reject profile request when no token is provided', async () => {
      const response = await request(app)
        .get('/api/users/data');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
