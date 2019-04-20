import { Field, InputType } from 'type-graphql';
import { Length, IsBoolean } from 'class-validator';

@InputType()
export class CreateTagInput {
  @Field()
  @Length(1, 50)
  name: string;

  @Field()
  @IsBoolean()
  isAvailable: boolean = true;

  @Field()
  @IsBoolean()
  isVisible: boolean = true;
}
