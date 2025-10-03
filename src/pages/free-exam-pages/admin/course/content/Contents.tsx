import {
  useCreateContent,
  useDeleteContent,
  useGetContentByModuleId,
  useUpdateContent,
} from "@/hooks/course/use-content";
import { useParams } from "react-router";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  Edit2,
  Plus,
  ShieldQuestionIcon,
  TextIcon,
  Trash,
  VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";
import { useState } from "react";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { contentIcon } from "@/utils/course-utilities";
import DeleteAlert from "@/pages/free-exam-pages/components/DeleteAlertDialog";
import MarkdownEditor from "@/pages/free-exam-pages/components/MarkdownEditor";

const Contents = () => {
  const { moduleId } = useParams();
  const { data: contentData, isLoading } = useGetContentByModuleId(
    Number(moduleId)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [currentContent, setcurrentContent] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const deleteContent = useDeleteContent()

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const { module, contents } = contentData;

  const handleDeleteModule = () => {
    if (!currentId) return;

    deleteContent.mutate(currentId, {
      onSuccess: () => {
        setIsOpenDelete(false);
        setCurrentId(null);
      },
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center px-5 bg-muted py-2">
          <CardTitle className="flex items-center gap-1 text-sm">
            Courses <ChevronRight size={15} /> Modules{" "}
            <ChevronRight size={15} /> {module.title}
          </CardTitle>
          <Button
            onClick={() => setIsOpen(true)}
            size={"icon"}
            variant={"outline"}
          >
            <Plus />
          </Button>
        </div>
        <CardContent>
          {!contents.length && (
            <div className="text-center text-muted-foreground">
              No contents yet.
            </div>
          )}
          {contents.map((content) => (
            <div
              key={content.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <h2 className="text-lg font-semibold">
                {content.title}{" "}
                <Badge variant={"outline"}>
                  {contentIcon(content.type)} {content.type}
                </Badge>
              </h2>
              <div className="space-x-3">
                <Button
                  onClick={() => {
                    setIsOpenEdit(true);
                    setcurrentContent(content);
                  }}
                  size={"icon"}
                  variant={"outline"}
                >
                  <Edit2 />
                </Button>
                <Button
                      onClick={() => {
                        setIsOpenDelete(true);
                        setCurrentId(module.id);
                      }}
                      size={"icon"}
                      variant={"destructive"}
                    >
                      <Trash />
                    </Button>
                {/* <Link to={`/free/admin/contents/${module.id}`}>
                    <Button size={'icon'}><ArrowRight/></Button>
                    </Link> */}
              </div>
            </div>
          ))}
          <div className=" space-y-2"></div>
        </CardContent>
      </Card>

      <ContentAddDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        moduleId={moduleId}
      />
      {currentContent && (
        <ContentEditDialog
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          currentContent={currentContent}
        />
      )}
      {currentId && (
        <DeleteAlert
          isOpen={isOpenDelete}
          setIsOpen={setIsOpenDelete}
          handleDelete={handleDeleteModule}
        />
      )}

            
    </>
  );
};

const ContentAddDialog = ({ isOpen, setIsOpen, moduleId }) => {
const [text, setText] = useState("")
const [selectOption, setSelectOption] = useState('VIDEO')

  const createModule = useCreateContent();
  const isModuleCreating = createModule.isPending;
  const onSubmit = (e) => {
    e.preventDefault();
    const content = {
      title: e.target.title.value,
      order: Number(e.target.order.value),
      type: e.target.type.value,
      textContent: text,
      videoUrl: e.target.video.value
    };
    console.log(content);

    createModule.mutate(
      {
        ...content,
        moduleId: Number(moduleId),
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Content Title"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="order">Order</Label>
              <Input
                type="number"
                id="order"
                name="order"
                placeholder="Content Order"
                required
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="order">Type</Label>
              <Select onValueChange={(value) => setSelectOption(value)} name="type" defaultValue="VIDEO">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select content type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Content types</SelectLabel>
                    <SelectItem value="VIDEO">
                      <VideoIcon /> Video
                    </SelectItem>
                    <SelectItem value="TEXT">
                      <TextIcon /> Text
                    </SelectItem>
                    <SelectItem value="QUIZ">
                      <ShieldQuestionIcon /> Quiz
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectOption === 'VIDEO' && <div className="grid gap-3">
              <Label htmlFor="video">Video</Label>
              <Input
                id="video"
                name="video"
                placeholder="Video URL"
                required
              />
            </div>}

            {selectOption === 'TEXT' && <MarkdownEditor text={text} setText={setText} />}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {" "}
              {isModuleCreating && <Spinner />} Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ContentEditDialog = ({ isOpen, setIsOpen, currentContent }) => {
    const [text, setText] = useState(currentContent.textContent || "")
const [selectOption, setSelectOption] = useState(currentContent.type)
  const updateContent = useUpdateContent();
  const isContentUpdating = updateContent.isPending;
  const onSubmit = (e) => {
    e.preventDefault();
    const content = {
      title: e.target.title.value,
      order: Number(e.target.order.value),
      type: e.target.type.value,
    };

    updateContent.mutate(
      {
        id: currentContent.id,
        data: { ...content },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                defaultValue={currentContent.title}
                id="title"
                name="title"
                placeholder="Content Title"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="order">Order</Label>
              <Input
                defaultValue={currentContent.order}
                type="number"
                id="order"
                name="order"
                placeholder="Content Order"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="order">Type</Label>
              <Select  onValueChange={(value) => setSelectOption(value)} name="type" defaultValue={currentContent.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select content type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Content types</SelectLabel>
                    <SelectItem value="VIDEO">
                      <VideoIcon /> Video
                    </SelectItem>
                    <SelectItem value="TEXT">
                      <TextIcon /> Text
                    </SelectItem>
                    <SelectItem value="QUIZ">
                      <ShieldQuestionIcon /> Quiz
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
                {selectOption === 'VIDEO' && <div className="grid gap-3">
              <Label htmlFor="video">Video</Label>
              <Input
                id="video"
                name="video"
                placeholder="Video URL"
                required
              />
            </div>}

            {selectOption === 'TEXT' && <MarkdownEditor text={text} setText={setText} />}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isContentUpdating && <Spinner />} Edit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Contents;
