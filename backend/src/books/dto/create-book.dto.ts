import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(3, 100, {
    message: 'Title must be between 3 and 100 characters long',
  })
  title: string;

  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  @Length(3, 50, {
    message: 'Author must be between 3 and 50 characters long',
  })
  author: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @Length(1, 1000, {
    message: 'Description must be between 10 and 1000 characters long',
  })
  description: string;
}
