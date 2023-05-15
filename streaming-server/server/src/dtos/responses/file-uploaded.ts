import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FileUploaded{
  @Field()
  status: string;

  @Field()
  message: string;

  @Field()
  location: string;
}