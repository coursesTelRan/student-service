import { jest } from '@jest/globals';

const mockAddStudent = jest.fn();

jest.mock('../../services/studentService.js', () => {
  const originalModule = jest.requireActual('../../services/studentService.js');
  return {
    ...originalModule,
    addStudent: mockAddStudent,
  };
});

import { addStudent } from '../../controller/studentController.js';

describe('StudentController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        id: 1,
        name: 'John Doe',
        password: 'pass123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  describe('addStudent', () => {
    jest.setTimeout(10000);

    it('should create a student successfully', async () => {
      mockAddStudent.mockResolvedValueOnce(true);

      await addStudent(req, res);

      expect(mockAddStudent).toHaveBeenCalledWith(req.body);
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it('should return 409 when student creation fails', async () => {
      mockAddStudent.mockResolvedValueOnce(false);

      await addStudent(req, res);

      expect(mockAddStudent).toHaveBeenCalledWith(req.body);
      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });

    it('should return 400 when validation fails', async () => {
      req.body = {};

      await addStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(mockAddStudent).not.toHaveBeenCalled();
    });
  });
});