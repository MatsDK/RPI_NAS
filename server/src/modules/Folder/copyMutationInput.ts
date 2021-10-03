import { Field, InputType, ObjectType } from "type-graphql";
import { Type } from "../../types";

@InputType()
export class CopyDestinationObject {
  @Field(() => Number)
  dataStoreId: number;

  @Field(() => String)
  path: string;
}

@InputType()
export class CopyDataObject {
  @Field(() => String)
  type: Type;

  @Field(() => String)
  path: string;
}

@InputType()
export class CopyInput {
  @Field(() => Number)
  dataStoreId: number;

  @Field(() => CopyDestinationObject)
  destination: CopyDestinationObject;

  @Field(() => [CopyDataObject])
  data: CopyDataObject[];
}
