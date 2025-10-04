import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetQuizById } from "@/hooks/course/use-quiz";
import MarkdownEditor from "@/pages/free-exam-pages/components/MarkdownEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import {
  useAddQuestionToQuiz,
  useAddQuizContext,
} from "@/hooks/course/use-question";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";

import QuizQuestionViewer from "./QuizQuestionViewer";

const Quize = () => {
  const { quizId } = useParams();
  const { data: quizData, isLoading } = useGetQuizById(Number(quizId));
  if (isLoading) return <div>Loading...</div>;
//   console.log(quizData);
  const { content, contexts } = quizData;

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center px-5 bg-muted py-2">
          <CardTitle className="flex items-center gap-1 text-sm">
            Courses <ChevronRight size={15} /> Modules
            <ChevronRight size={15} /> Content <ChevronRight size={15} />{" "}
            {content.title} <ChevronRight size={15} /> Quiz{" "}
            <ChevronRight size={15} /> {quizData.title}
          </CardTitle>
        </div>
        <CardContent className="space-y-2">
          {
            <div className="grid grid-cols-2 gap-1">
              <Tabs defaultValue="question">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="question">Add Question</TabsTrigger>
                  <TabsTrigger value="context">Add Context</TabsTrigger>
                </TabsList>
                <TabsContent value="question">
                  <QuestionAddForm quizId={quizData.id} contexts={contexts} />
                </TabsContent>
                <TabsContent value="context">
                  <ContextAddForm quizId={quizData.id} />
                </TabsContent>
              </Tabs>

              <div className="pl-2">
                <QuizQuestionViewer quizData={quizData} />
              </div>
            </div>
          }

          <div className=" space-y-2"></div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuestionAddForm = ({ quizId, contexts }) => {
  const [questionText, setQuestionText] = useState("");
  const [optionOne, setOptionOne] = useState("");
  const [optionTwo, setOptionTwo] = useState("");
  const [optionThree, setOptionThree] = useState("");
  const [optionFour, setOptionFour] = useState("");
  const [explanation, setExplanation] = useState("");
  const createQuestionToQuiz = useAddQuestionToQuiz();
  const [selectOption, setSelectOption] = useState("0");
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = [
      questionText,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
    ];
    if (formData.some((item) => item.trim() === "")) {
      toast.error("Please fill all the fields");
      return;
    }
    const options = [optionOne, optionTwo, optionThree, optionFour];
    const formatedOptions = options.map((option, index) => {
      return {
        title: option,
        isCorrect: index === Number(selectOption),
      };
    });
    const question = {
      quizId,
      question: questionText,
      options: {
        create: formatedOptions,
      },
      explanation,
    };
    createQuestionToQuiz.mutate({
      data: { ...question },
    });
  };

  const isQuestionAdding = createQuestionToQuiz.isPending;

  const handleOpenAddQuestionToContextDialog = () => {
    const formData = [
      questionText,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
    ];
    if (formData.some((item) => item.trim() === "")) {
      toast.error("Please fill all the fields");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <div className="border-r">
        <h2 className="text-lg font-semibold">Add Questions</h2>
        <Separator className="my-2" />

        <form onSubmit={onSubmit} className="grid gap-4 pr-5">
          <div className="grid gap-3">
            <Label htmlFor="question">Question</Label>
            <MarkdownEditor text={questionText} setText={setQuestionText} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="question">Option 1</Label>
            <MarkdownEditor text={optionOne} setText={setOptionOne} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="question">Option 2</Label>
            <MarkdownEditor text={optionTwo} setText={setOptionTwo} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="question">Option 3</Label>
            <MarkdownEditor text={optionThree} setText={setOptionThree} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="question">Option 4</Label>
            <MarkdownEditor text={optionFour} setText={setOptionFour} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="question">Explanation</Label>
            <MarkdownEditor text={explanation} setText={setExplanation} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="correct_option">Correct Option</Label>
            <Select
              onValueChange={(value) => setSelectOption(value)}
              name="correct_option"
              defaultValue="0"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content type"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Correct option</SelectLabel>
                  <SelectItem value="0">Option 1</SelectItem>
                  <SelectItem value="1">Option 2</SelectItem>
                  <SelectItem value="2">Option 3</SelectItem>
                  <SelectItem value="3">Option 4</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-green-600"
              type="submit"
              disabled={isQuestionAdding}
              variant={"secondary"}
            >
              {isQuestionAdding && <Spinner />} Submit
            </Button>
            <Button
              onClick={handleOpenAddQuestionToContextDialog}
              type="button"
              variant={"outline"}
            >
              Add to the context
            </Button>
          </div>
        </form>
      </div>

      <AddQuestionToContextDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contexts={contexts}
        quizId={quizId}
        questionData={{
          questionText,
          optionOne,
          optionTwo,
          optionThree,
          optionFour,
          explanation,
          selectOption,
        }}
      />
    </>
  );
};

const ContextAddForm = ({ quizId }) => {
  const [contextText, setContextText] = useState("");
  const addQuizContext = useAddQuizContext();

  const onSubmit = (e) => {
    e.preventDefault();
    const context = {
      quizId,
      contextText,
    };
    addQuizContext.mutate({
      data: { ...context },
    });
  };

  const isContextAdding = addQuizContext.isPending;

  return (
    <div className="border-r">
      <h2 className="text-lg font-semibold">Add Context</h2>
      <Separator className="my-2" />

      <form onSubmit={onSubmit} className="grid gap-4 pr-5">
        <div className="grid gap-3">
          <Label htmlFor="context">Context</Label>
          <MarkdownEditor text={contextText} setText={setContextText} />
        </div>
        <Button
          type="submit"
          disabled={isContextAdding}
          variant={"destructive"}
          className="w-full"
        >
          {isContextAdding && <Spinner />} Submit
        </Button>
      </form>
    </div>
  );
};

const AddQuestionToContextDialog = ({
  isOpen,
  setIsOpen,
  contexts,
  quizId,
  questionData,
}) => {
  const createQuestionToQuiz = useAddQuestionToQuiz();
  const onSubmit = (e) => {
    e.preventDefault();
    const contextId = e.target.context.value;
    const {
      questionText,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
      explanation,
      selectOption,
    } = questionData;
    const options = [optionOne, optionTwo, optionThree, optionFour];
    const formatedOptions = options.map((option, index) => {
      return {
        title: option,
        isCorrect: index === Number(selectOption),
      };
    });
    const question = {
      quizId,
      question: questionText,
      options: {
        create: formatedOptions,
      },
      contextId: Number(contextId),
      explanation,
    };
    createQuestionToQuiz.mutate(
      {
        data: { ...question },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  const isQuestionAdding = createQuestionToQuiz.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add This Question to the context</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <RadioGroup name="context">
            {contexts.map((context) => (
              <div
                key={context.id}
                className="flex items-center gap-3 border py-3 px-2 rounded-lg relative"
              >
                <div className="bg-red-500 w-5 h-5 absolute rounded-full -right-1 -top-2 flex justify-center items-center text-xs">
                  {context.questions.length}
                </div>
                <RadioGroupItem
                  value={context.id}
                  id={`context-${context.id}`}
                />
                <Label
                  className="line-clamp-2"
                  htmlFor={`context-${context.id}`}
                >
                  {context.contextText}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {" "}
              {isQuestionAdding && <Spinner />} Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Quize;
