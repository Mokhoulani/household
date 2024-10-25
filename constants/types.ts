import { Path } from 'react-hook-form';
import { emojies, colors } from './sampledata';

export interface Field<T> {
  fieldKey: Path<T>;
  placeholder: string;
  icon?: string;
  secureText?: boolean;
}

/// För sampledata bara
type Emoji = (typeof emojies)[number];
type Color = (typeof colors)[number];

interface Avatar {
  id: string;
  icon: Emoji;
  color: Color;
}

interface Profile {
  id: string;
  Avatar: Avatar;
  Name: string;
}

export interface Task {
  id: string;
  Title: string;
  Difficulty: number;
}

export interface CompletedTask {
  Profile: Profile;
  Task: Task;
}
