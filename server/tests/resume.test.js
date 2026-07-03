import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 1. Mock Resume model using unstable_mockModule for ES Modules
jest.unstable_mockModule('../models/Resume.js', () => {
  return {
    default: {
      create: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    },
  };
});

// 2. Dynamically import dependencies
const Resume = (await import('../models/Resume.js')).default;
const app = (await import('../server.js')).default;

describe('Resume API Endpoints', () => {
  let token;
  const mockUserId = 'user_123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    token = jwt.sign({ userId: mockUserId }, 'test_secret');
  });

  describe('POST /api/resume/create', () => {
    it('RES-01: should create a resume successfully when logged in', async () => {
      const mockNewResume = {
        _id: 'resume_abc',
        userId: mockUserId,
        title: 'Software Developer Resume',
        template: 'modern',
      };

      Resume.create.mockResolvedValue(mockNewResume);

      const response = await request(app)
        .post('/api/resume/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Software Developer Resume',
          template: 'modern',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Resume created successfully');
      expect(response.body.resume).toEqual(mockNewResume);
      expect(Resume.create).toHaveBeenCalledWith({
        userId: mockUserId,
        title: 'Software Developer Resume',
        template: 'modern',
      });
    });

    it('RES-02: should return 401 when trying to create resume without logging in', async () => {
      const response = await request(app)
        .post('/api/resume/create')
        .send({
          title: 'Unauthenticated Resume',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      expect(Resume.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/resume/get/:resumeId', () => {
    it('RES-03: should retrieve a resume successfully when owned by the user', async () => {
      const mockResume = {
        _id: 'resume_abc',
        userId: mockUserId,
        title: 'My Resume',
      };

      Resume.findOne.mockResolvedValue(mockResume);

      const response = await request(app)
        .get('/api/resume/get/resume_abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resume');
      expect(response.body.resume._id).toBe('resume_abc');
      expect(Resume.findOne).toHaveBeenCalledWith({ userId: mockUserId, _id: 'resume_abc' });
    });

    it('RES-04: should return 404 if resume is not found or owned by another user', async () => {
      Resume.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/resume/get/resume_other')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Resume not found');
    });
  });

  describe('PUT /api/resume/update', () => {
    it('RES-05: should update resume successfully', async () => {
      const mockUpdatedResume = {
        _id: 'resume_abc',
        userId: mockUserId,
        title: 'Updated Title',
        template: 'classic',
      };

      Resume.findOneAndUpdate.mockResolvedValue(mockUpdatedResume);

      const response = await request(app)
        .put('/api/resume/update')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeId: 'resume_abc',
          resumeData: {
            title: 'Updated Title',
            template: 'classic',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Saved successfully');
      expect(response.body.resume).toEqual(mockUpdatedResume);
      expect(Resume.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUserId, _id: 'resume_abc' },
        { title: 'Updated Title', template: 'classic' },
        { new: true }
      );
    });
  });

  describe('DELETE /api/resume/delete/:resumeId', () => {
    it('RES-06: should soft delete resume successfully (move to Recycle Bin)', async () => {
      Resume.findOneAndUpdate.mockResolvedValue({ _id: 'resume_abc', is_deleted: true });

      const response = await request(app)
        .delete('/api/resume/delete/resume_abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Resume moved to Recycle Bin');
      expect(Resume.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUserId, _id: 'resume_abc' },
        { is_deleted: true }
      );
    });
  });

  describe('PUT /api/resume/restore/:resumeId', () => {
    it('RES-07: should restore a soft-deleted resume successfully', async () => {
      Resume.findOneAndUpdate.mockResolvedValue({ _id: 'resume_abc', is_deleted: false });

      const response = await request(app)
        .put('/api/resume/restore/resume_abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Resume restored successfully');
      expect(Resume.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUserId, _id: 'resume_abc' },
        { is_deleted: false }
      );
    });
  });

  describe('DELETE /api/resume/permanent-delete/:resumeId', () => {
    it('RES-08: should permanently delete resume successfully', async () => {
      Resume.findOneAndDelete.mockResolvedValue({ _id: 'resume_abc' });

      const response = await request(app)
        .delete('/api/resume/permanent-delete/resume_abc')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Resume permanently deleted');
      expect(Resume.findOneAndDelete).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: 'resume_abc',
      });
    });
  });

  describe('GET /api/resume/public/:resumeId', () => {
    it('RES-09: should retrieve a public resume without auth token', async () => {
      const mockPublicResume = {
        _id: 'resume_public',
        title: 'Public Resume',
        public: true,
      };

      Resume.findOne.mockResolvedValue(mockPublicResume);

      const response = await request(app)
        .get('/api/resume/public/resume_public');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resume');
      expect(response.body.resume._id).toBe('resume_public');
      expect(Resume.findOne).toHaveBeenCalledWith({ public: true, _id: 'resume_public' });
    });
  });
});
