import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 1. Mock AI config using unstable_mockModule for ES Modules
jest.unstable_mockModule('../configs/ai.js', () => {
  return {
    default: {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    },
  };
});

// 2. Mock Resume model
jest.unstable_mockModule('../models/Resume.js', () => {
  return {
    default: {
      create: jest.fn(),
    },
  };
});

// 3. Dynamically import dependencies
const ai = (await import('../configs/ai.js')).default;
const Resume = (await import('../models/Resume.js')).default;
const app = (await import('../server.js')).default;

describe('AI API Endpoints', () => {
  let token;
  const mockUserId = 'user_123';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    process.env.OPENAI_MODEL = 'models/gemini-flash-latest';
    token = jwt.sign({ userId: mockUserId }, 'test_secret');
  });

  describe('POST /api/ai/enhance-pro-sum', () => {
    it('AI-01: should enhance professional summary successfully', async () => {
      const mockOpenAIResponse = {
        choices: [
          {
            message: {
              content: 'Enhanced professional summary with relevant keywords.',
            },
          },
        ],
      };

      ai.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      const response = await request(app)
        .post('/api/ai/enhance-pro-sum')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userContent: 'This is my basic professional summary.',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('enhancedContent', 'Enhanced professional summary with relevant keywords.');
      expect(ai.chat.completions.create).toHaveBeenCalled();
    });

    it('should return 400 if userContent is missing', async () => {
      const response = await request(app)
        .post('/api/ai/enhance-pro-sum')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });
  });

  describe('POST /api/ai/enhance-job-desc', () => {
    it('AI-02: should enhance job description successfully', async () => {
      const mockOpenAIResponse = {
        choices: [
          {
            message: {
              content: 'Enhanced job description text.',
            },
          },
        ],
      };

      ai.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      const response = await request(app)
        .post('/api/ai/enhance-job-desc')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userContent: 'Worked on React and Javascript.',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('enhancedContent', 'Enhanced job description text.');
    });
  });

  describe('POST /api/ai/upload-resume', () => {
    it('AI-03: should extract resume text and create a resume document', async () => {
      const mockExtractedJson = JSON.stringify({
        professional_summary: 'Extract summary',
        skills: ['React', 'Node'],
        personal_info: { full_name: 'Jane Doe' },
        experience: [],
        project: [],
        education: [],
      });

      const mockOpenAIResponse = {
        choices: [
          {
            message: {
              content: mockExtractedJson,
            },
          },
        ],
      };

      ai.chat.completions.create.mockResolvedValue(mockOpenAIResponse);
      Resume.create.mockResolvedValue({ _id: 'new_resume_123' });

      const response = await request(app)
        .post('/api/ai/upload-resume')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeText: 'Jane Doe Resume Text...',
          title: 'My Uploaded Resume',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resumeId', 'new_resume_123');
    });
  });

  describe('POST /api/ai/calculate-ats-score', () => {
    it('AI-04: should calculate ATS score and return parsing structure', async () => {
      const mockAtsResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 85,
                matchingKeywords: ['React', 'JavaScript'],
                missingKeywords: ['Redux'],
                sectionScore: 90,
                formattingScore: 80,
                contentScore: 85,
                improvementTips: ['Add Redux'],
              }),
            },
          },
        ],
      };

      ai.chat.completions.create.mockResolvedValue(mockAtsResponse);

      const response = await request(app)
        .post('/api/ai/calculate-ats-score')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeText: 'React Developer with Javascript experience.',
          jobDescription: 'Looking for a React and Redux Developer.',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score', 85);
      expect(response.body).toHaveProperty('sectionScore', 90);
      expect(response.body.matchingKeywords).toContain('React');
      expect(response.body.missingKeywords).toContain('Redux');
    });

    it('AI-05: should fallback to default mock structure when OpenAI fails (e.g., rate-limit)', async () => {
      ai.chat.completions.create.mockRejectedValue(new Error('Rate Limit Exceeded'));

      const response = await request(app)
        .post('/api/ai/calculate-ats-score')
        .set('Authorization', `Bearer ${token}`)
        .send({
          resumeText: 'Fallback Test Resume Content',
          jobDescription: 'Fallback Job Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score', 70);
      expect(response.body.improvementTips[0]).toContain('temporarily exhausted');
    });
  });
});
