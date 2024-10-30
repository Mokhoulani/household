import { CompletedTask, Task } from './types';

export const emojies = ['🦊', '🐷', '🐸', '🐥', '🐙', '🐬', '🦉', '🦄'];

export const colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#FFA500',
  '#800080',
] as const;

export const tasks: Task[] = [
  {
    id: '1',
    Title: 'Clean the house',
    Difficulty: 3,
    lastCompletedDate: '2023-10-20',
    emoji: emojies[0],
    color: colors[0],
  },
  {
    id: '2',
    Title: 'Go for a run',
    Difficulty: 4,
    lastCompletedDate: '2023-10-18',
    emoji: emojies[1],
    color: colors[1],
  },
  {
    id: '3',
    Title: 'Walk the dog',
    Difficulty: 3,
    lastCompletedDate: '2023-10-15',
    emoji: emojies[2],
    color: colors[2],
  },
  {
    id: '4',
    Title: 'Prepare dinner',
    Difficulty: 2,
    lastCompletedDate: '2023-10-14',
    emoji: emojies[3],
    color: colors[3],
  },
];

export const completedTasks: CompletedTask[] = [
  {
    Profile: {
      id: '1',
      Avatar: { id: '1', icon: emojies[0], color: colors[0] },
      Name: 'John Doe',
    },
    Task: tasks[0],
  },
  {
    Profile: {
      id: '2',
      Avatar: { id: '2', icon: emojies[1], color: colors[1] },
      Name: 'Jane Smith',
    },
    Task: tasks[1],
  },
  {
    Profile: {
      id: '3',
      Avatar: { id: '3', icon: emojies[2], color: colors[2] },
      Name: 'Alice Johnson',
    },
    Task: tasks[2],
  },
  {
    Profile: {
      id: '4',
      Avatar: { id: '4', icon: emojies[3], color: colors[3] },
      Name: 'Bob Brown',
    },
    Task: tasks[3],
  },
];
