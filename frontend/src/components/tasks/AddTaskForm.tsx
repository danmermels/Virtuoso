import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskFormData } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Task title is required"),
});

type AddTaskFormProps = {
  onAdd: (data: TaskFormData) => void;
};

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: TaskFormData) => {
    onAdd(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mt-4">
      <Input
        {...register("title")}
        placeholder="Add a new task..."
        className={errors.title ? "border-red-500" : ""}
        disabled={isSubmitting}
        autoComplete="off"
      />
      <Button type="submit" disabled={isSubmitting}>
        Add
      </Button>
    </form>
  );
};
