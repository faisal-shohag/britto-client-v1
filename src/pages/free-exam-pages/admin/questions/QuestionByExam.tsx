import { useState } from "react";
import { useParams } from "react-router";
import { QuestionList } from "./QuestionList";
import { QuestionForm } from "./QuestionForm"; // Import the QuestionForm component
import { useCreateQuestion } from "@/hooks/free-exam-hooks/use-questions";
import type { CreateQuestionData } from "@/hooks/free-exam-hooks/use-questions";
import api from "@/lib/api";

const QuestionByExam = () => {
  const { id } = useParams() as { id: string }; // Type the params properly
  //   const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const createQuestionMutation = useCreateQuestion();

  // Handle form submission
  const handleCreateQuestion = (data: CreateQuestionData) => {
    createQuestionMutation.mutate(
      { ...data }, // Include examId in the data
      {
        onSuccess: async (response) => {
          const { data } = response.data;
          await api.post(`/freeExam/exams/${id}/questions/${data.id}`);
          setShowForm(false); // Hide form on success
        },
        onError: (error) => {
          console.error("Failed to create question:", error);
        },
      }
    );
  };

  // Handle form cancellation
  const handleCancel = () => {
    setShowForm(false);
  };

  // Handle create question button click
  const handleCreateQuestionClick = () => {
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen">
      {showForm ? (
        <QuestionForm
          onSubmit={handleCreateQuestion}
          onCancel={handleCancel}
          isLoading={createQuestionMutation.isPending}
          submitLabel="Create Question"
        />
      ) : (
        <QuestionList
          examId={Number(id)}
          showExplanation={true}
          showOptions={true}
          onCreateQuestion={handleCreateQuestionClick} // Pass handler to QuestionList
        />
      )}
    </div>
  );
};

export default QuestionByExam;
