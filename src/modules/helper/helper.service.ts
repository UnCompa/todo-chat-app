import { prisma } from '@lib/prisma.js';
export class HelperService {
  static async createNewAnswer(userId: string, answer: string, question: string) {
    const feedbackExists = await prisma.feedback.findFirst({
      where: { userId },
    });
    if (feedbackExists) {
      await prisma.feedbackAnswer.create({
        data: { answer, question, feedbackId: feedbackExists.id },
      });
    } else {
      const newFeedback = await prisma.feedback.create({
        data: { userId },
        select: {
          id: true,
        },
      });
      await prisma.feedbackAnswer.create({
        data: { answer, question, feedbackId: newFeedback.id },
      });
    }
  }
}
