import { createContext, useContext, useState, ReactNode } from "react";
import { defaultTasks } from "../default-tasks";
import { Task, TaskStatus } from "../tasks.types";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

let nextId = defaultTasks.length + 1;

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  setTaskStatus: (id: number, status: TaskStatus) => void;
  deleteTask: (id: number) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  useCopilotReadable({
    description: "The state of our tasks",
    value: tasks,
  });

  useCopilotAction({
    name: "addTask",
    description: "Add a new task to the list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task to create",
        required: true,
      },
    ],
    handler: ({ title }) => {
      addTask(title);
      console.log("Task created successfully: ", title);
    },
  });

  useCopilotAction({
    name: "deleteTask",
    description: "Delete a task from the list",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The ID of the task to delete",
        required: true,
      },
    ],
    handler: ({ id }) => {
      deleteTask(id);
      console.log("Task deleted successfully: ", id);
    },
  });

  useCopilotAction({
    name: "setTaskStatus",
    description: "Set the status of a task",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The ID of the task to update",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description: "The new status of the task",
        required: true,
      },
    ],
    handler: ({ id, status }) => {
      const validStatus = status as TaskStatus;
      setTaskStatus(id, validStatus);
      console.log("Task status updated successfully: ", id, status);
    },
  });

  const addTask = (title: string) => {
    setTasks([...tasks, { id: nextId++, title, status: TaskStatus.todo }]);
  };

  const setTaskStatus = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, setTaskStatus, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
