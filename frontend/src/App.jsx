import React from "react";
import { AddTaskForm } from "@/components/tasks/task-list"; // adjust import as needed


export default function App({
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