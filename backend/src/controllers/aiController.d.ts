import type { Request, Response } from 'express';
export declare const chatWithTutor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const summarizeNotes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateQuiz: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateFlashcards: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=aiController.d.ts.map