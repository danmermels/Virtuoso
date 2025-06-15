import React from "react";
import { AddTaskForm } from "@/components/tasks/task-list"; // adjust import as needed

// Example task type
type Task = {
  id: string;
  name: string;
  weight: number;
  type: "daily" | "monthly";
  completed: boolean;
};

function DailyHabitsCard({
  tasks,
  onAddTask,
  onToggleTask,
}: {
  tasks: Task[];
  onAddTask: (data: any) => void;
  onToggleTask: (id: string) => void;
}) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span>
        <span className="text-lg font-bold text-blue-900">Daily Habits</span>
      </div>
      <div className="border-t pt-4 space-y-2">
        {tasks.length === 0 && (
          <div className="text-gray-500 italic">No daily habits yet.</div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 bg-gray-50 rounded-lg px-3 py-2"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="w-5 h-5 accent-blue-600"
            />
            <span className={task.completed ? "line-through text-gray-400" : ""}>
              {task.name}
            </span>
            <span className="ml-auto text-yellow-500 text-xl">🌞</span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <AddTaskForm onAddTask={onAddTask} />
      </div>
    </section>
  );
}

export default function App() {
  // Example data, replace with your real state/props
  const dailyTasks: Task[] = [
    { id: "1", name: "Drink water", weight: 1, type: "daily", completed: false },
    { id: "2", name: "Exercise", weight: 1, type: "daily", completed: true },
  ];

  const handleAddTask = (data: any) => {
    console.log("Add task:", data);
    // Implement your add task logic here
  };

  const handleToggleTask = (id: string) => {
    console.log("Toggle task:", id);
    // Implement your toggle task logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <h1 className="text-3xl font-bold text-blue-900">Virtuoso</h1>
        </div>
        <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium">Settings</span>
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Daily Habits */}
        <DailyHabitsCard
          tasks={dailyTasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
        />
      </main>
    </div>
  );
}