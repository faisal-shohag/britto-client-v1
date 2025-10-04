export function formatQuiz(quizData) {
  const { questions, contexts } = quizData;

  // 1. Separate standalone questions (no contextId)
  const standaloneQuestions = questions
    .filter(q => q.contextId === null)
    .map(q => ({
      question: {
        id: q.id,
        title: q.question,
        imageUrl: q.imageUrl || "",
        correctOption: q.options?.find(o => o.isCorrect)?.id || null,
        options: q.options?.map(o => ({
          id: o.id,
          title: o.title,
          imageUrl: o.imageUrl || "",
          isCorrect: o.isCorrect
        })) || []
      }
    }));

  // 2. Transform context-based questions
  const contextBlocks = contexts.map(ctx => ({
    quizContext: {
      contextText: ctx.contextText,
      contextImageUrl: ctx.contextImageUrl || "",
      questions: ctx.questions.map(q => ({
        id: q.id,
        title: q.question,
        imageUrl: q.imageUrl || "",
        correctOption: q.options?.find(o => o.isCorrect)?.id || null,
        options: q.options?.map(o => ({
          id: o.id,
          title: o.title,
          imageUrl: o.imageUrl || "",
          isCorrect: o.isCorrect
        })) || []
      }))
    }
  }));

  return [...standaloneQuestions, ...contextBlocks];
}
