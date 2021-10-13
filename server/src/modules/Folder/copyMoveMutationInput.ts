import { Field, InputType, ObjectType } from "type-graphql";
import { Type } from "../../types/Context";

@InputType()
export class CopyMoveDestinationObject {
  @Field(() => Number)
  dataStoreId: number;

  @Field(() => String)
  path: string;
}

@InputType()
export class CopyMoveDataObject {
  @Field(() => String)
  type: Type;

  @Field(() => String)
  path: string;
}

@InputType()
export class CopyMoveInput {
  @Field(() => Number)
  dataStoreId: number;

  @Field(() => CopyMoveDestinationObject)
  destination: CopyMoveDestinationObject;

  @Field(() => [CopyMoveDataObject])
  data: CopyMoveDataObject[];
}
