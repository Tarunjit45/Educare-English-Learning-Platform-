export enum ClassLevel {
    VIII = 'VIII',
    IX = 'IX',
    X = 'X',
    XI = 'XI',
    XII = 'XII',
    XI_SEM_1 = 'XI_SEM_1',
    XI_SEM_2 = 'XI_SEM_2',
    XII_SEM_3 = 'XII_SEM_3',
    XII_SEM_4 = 'XII_SEM_4',
}

export type PrimaryClass = ClassLevel.VIII | ClassLevel.IX | ClassLevel.X | ClassLevel.XI | ClassLevel.XII;

export interface MCQOption {
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    type: 'MCQ' | 'SAQ' | 'BROAD' | 'GRAMMAR';
    questionText: string;
    options?: MCQOption[];
    answer: string;
}

export interface Quiz {
    mcqs?: Question[] | null;
    saqs?: Question[] | null;
    broads?: Question[] | null;
    grammars?: Question[] | null;
}

export interface Result {
    score: number;
    feedback: string;
    detailedAnalysis: {
        questionId: string;
        studentAnswer: string;
        evaluation: string;
        correctAnswer: string;
    }[];
}