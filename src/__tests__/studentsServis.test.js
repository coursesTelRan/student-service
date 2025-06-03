// src/__tests__/controller/studentsServis.test.js

import { jest } from '@jest/globals';

// 🧠 ESM-специфичный способ замокать модуль
jest.unstable_mockModule('../repository/studentRepository.js', () => ({
    findStudentsByMinScore: jest.fn()
}));

// 🧠 Импортируем только после mockModule
const studentRepository = await import('../repository/studentRepository.js');
const { findByMinScore } = await import('../services/studentService.js');

const mockStudentsData = [
    {
        name: 'Alice',
        password: '123',
        scores: { math: 90, physics: 85 }
    },
    {
        name: 'Bob',
        password: '456',
        scores: { math: 85, physics: 92 }
    },
];

describe('StudentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findByMinScore', () => {
        it('должен вернуть студентов с удалёнными паролями', async () => {
            studentRepository.findStudentsByMinScore.mockResolvedValue(mockStudentsData);

            const expectedStudents = mockStudentsData.map(student => ({
                ...student,
                password: undefined
            }));

            const result = await findByMinScore('math', 80);

            expect(studentRepository.findStudentsByMinScore).toHaveBeenCalledWith('math', 80);
            expect(result).toEqual(expectedStudents);
            expect(Array.isArray(result)).toBe(true);
            result.forEach(student => {
                expect(student.password).toBeUndefined();
                expect(student.name).toBeDefined();
                expect(student.scores).toBeDefined();
            });
        });

        it('должен вернуть пустой массив, если студентов нет', async () => {
            studentRepository.findStudentsByMinScore.mockResolvedValue([]);

            const result = await findByMinScore('math', 100);

            expect(studentRepository.findStudentsByMinScore).toHaveBeenCalledWith('math', 100);
            expect(result).toEqual([]);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('должен корректно обработать предметы с разными оценками', async () => {
            studentRepository.findStudentsByMinScore.mockResolvedValue(mockStudentsData);

            const result = await findByMinScore('physics', 90);

            expect(studentRepository.findStudentsByMinScore).toHaveBeenCalledWith('physics', 90);
            expect(Array.isArray(result)).toBe(true);
            result.forEach(student => {
                expect(student.scores).toHaveProperty('physics');
                expect(student.password).toBeUndefined();
            });
        });

        it('должен выбросить ошибку при некорректных входных данных', async () => {
            await expect(findByMinScore(null, 80)).rejects.toThrow();
            await expect(findByMinScore('math', null)).rejects.toThrow();
            await expect(findByMinScore('', 80)).rejects.toThrow();
        });
    });
});
