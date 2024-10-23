import { CompletedTask, Task } from './types';

export const emojies = ['🦊', '🐷', '🐸', '🐥', '🐙', '🐬', '🦉', '🦄'];

export const colors = [
  '#FF0000', // Röd
  '#00FF00', // Grön
  '#0000FF', // Blå
  '#FFFF00', // Gul
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#FFA500', // Orange
  '#800080', // Lila
  '#A52A2A', // Brun
  '#808080', // Grå
  '#000000', // Svart
  '#FFFFFF', // Vit
] as const;

const tasks: Task[] = [
  {
    id: '1',
    Title: 'Clean the house',
    Difficulty: 3,
  },
  {
    id: '2',
    Title: 'Go for a run',
    Difficulty: 4,
  },
  {
    id: '3',
    Title: 'Walk the dog',
    Difficulty: 3,
  },
  {
    id: '4',
    Title: 'Prepare dinner',
    Difficulty: 3,
  },
  {
    id: '5',
    Title: 'Grocery shopping',
    Difficulty: 3,
  },
  {
    id: '6',
    Title: 'Finish project',
    Difficulty: 5,
  },
];

export const completedTasks: CompletedTask[] = [
  {
    Profile: {
      id: '1',
      Avatar: {
        id: '1',
        icon: emojies[0], // 🦊
        color: colors[0],
      },
      Name: 'John Doe',
    },
    Task: tasks[0], // Referens till "Clean the house"
  },
  {
    Profile: {
      id: '2',
      Avatar: {
        id: '2',
        icon: emojies[1], // 🐷
        color: colors[1],
      },
      Name: 'Jane Smith',
    },
    Task: tasks[1], // Referens till "Go for a run"
  },
  {
    Profile: {
      id: '3',
      Avatar: {
        id: '3',
        icon: emojies[2], // 🐸
        color: colors[2],
      },
      Name: 'Alice Johnson',
    },
    Task: tasks[1], // Referens till "Go for a run" (igen)
  },
  {
    Profile: {
      id: '4',
      Avatar: {
        id: '4',
        icon: emojies[3], // 🐥
        color: colors[3],
      },
      Name: 'Bob Brown',
    },
    Task: tasks[0], // Referens till "Clean the house"
  },
  {
    Profile: {
      id: '5',
      Avatar: {
        id: '5',
        icon: emojies[4], // 🐙
        color: colors[4],
      },
      Name: 'Charlie Davis',
    },
    Task: tasks[3], // Referens till "Prepare dinner"
  },
  {
    Profile: {
      id: '6',
      Avatar: {
        id: '6',
        icon: emojies[5], // 🐬
        color: colors[5],
      },
      Name: 'Eva Green',
    },
    Task: tasks[4], // Referens till "Grocery shopping"
  },
  {
    Profile: {
      id: '7',
      Avatar: {
        id: '7',
        icon: emojies[6], // 🦉
        color: colors[6],
      },
      Name: 'Frank Harris',
    },
    Task: tasks[5], // Referens till "Finish project"
  },
  {
    Profile: {
      id: '7',
      Avatar: {
        id: '7',
        icon: emojies[6], // 🦉
        color: colors[6],
      },
      Name: 'Frank Harris',
    },
    Task: tasks[4], // Referens till "Finish project"
  },
];
