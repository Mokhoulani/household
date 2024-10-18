import { Path } from 'react-hook-form';

export interface Field<T> {
  fieldKey: Path<T>;
  placeholder: string;
  icon?: string;
  secureText?: boolean;
}
