import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCreateModule,
  useDeleteModule,
  useGetModuleByCourseId,
  useUpdateModule,
} from "@/hooks/course/use-module";
import { ArrowRight, ChevronRight, Edit2, Plus, Trash } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Spinner } from "@/pages/free-exam-pages/components/Splash";
import DeleteAlert from "@/pages/free-exam-pages/components/DeleteAlertDialog";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const Modules = () => {
  const { courseId } = useParams();
  const { data: moduleData, isLoading } = useGetModuleByCourseId(
    Number(courseId),
    "content"
  );
  const deleteModule = useDeleteModule();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const { course, modules } = moduleData;
  // console.log(modules);

  const handleDeleteModule = () => {
    if (!currentId) return;

    deleteModule.mutate(currentId, {
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
            Courses <ChevronRight size={15} /> {course.title}
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
          <div className=" space-y-2">
            {modules.map((module) => (
              <Collapsible key={module.id}>
                <div className="border p-4 rounded-lg flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{module.title}</h2>
                  <div className="space-x-3">
                      <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-180 border p-[10px] rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform duration-200"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </CollapsibleTrigger>
 
                    <Button
                      onClick={() => {
                        setIsOpenEdit(true);
                        setCurrentModule(module);
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
                    <Link to={`/free/admin/contents/${module.id}`}>
                    <Button size={'icon'}><ArrowRight/></Button>
                    </Link>
                  </div>
                </div>
                <CollapsibleContent className="p-2 space-y-1 transition-transform duration-200">
                  {module.contents.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center gap-2 mt-1 border py-1 px-2 rounded-xl"
                    >
                      <div className="h-7 w-7 border rounded-full flex justify-center items-center">
                        {content.order}
                      </div>
                      <div className="font-bold text-sm">
                        {content.title}{" "}
                        <Badge variant={"outline"}>{content.type}</Badge>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <ModuleAddDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        courseId={courseId}
      />
      {currentModule && (
        <ModuleEditDialog
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          currentModule={currentModule}
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

const ModuleAddDialog = ({ isOpen, setIsOpen, courseId }) => {
  const createModule = useCreateModule();
  const isModuleCreating = createModule.isPending;
  const onSubmit = (e) => {
    e.preventDefault();
    const module = {
      title: e.target.title.value,
      order: Number(e.target.order.value),
    };

    createModule.mutate(
      {
        ...module,
        courseId: Number(courseId),
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Module Title"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="order">Order</Label>
              <Input
                type="number"
                id="order"
                name="order"
                placeholder="Module Order"
                required
              />
            </div>
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

const ModuleEditDialog = ({ isOpen, setIsOpen, currentModule }) => {
  const createModule = useUpdateModule();
  const isModuleCreating = createModule.isPending;
  const onSubmit = (e) => {
    e.preventDefault();
    const module = {
      title: e.target.title.value,
      order: Number(e.target.order.value),
    };
    createModule.mutate(
      {
        moduleId: currentModule.id,
        data: { ...module },
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                defaultValue={currentModule.title}
                id="title"
                name="title"
                placeholder="Module Title"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="order">Order</Label>
              <Input
                defaultValue={currentModule.order}
                type="number"
                id="order"
                name="order"
                placeholder="Module Order"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {" "}
              {isModuleCreating && <Spinner />} Edit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modules;
