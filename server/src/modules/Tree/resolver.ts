import { Arg, Query, Resolver } from "type-graphql";
import { Tree } from "./TreeObject";

@Resolver()
export class TreeResolver {
  @Query(() => Tree)
  tree(
    @Arg("path", () => String) path: string,
    @Arg("depth", () => Number) depth: number = 1
  ): Tree {
    return new Tree(path, depth, "H:/js-py", false);
  }

  @Query(() => Tree)
  directoryTree(
    @Arg("path", () => String) path: string,
    @Arg("depth", () => Number) depth: number = 1
  ): Tree {
    return new Tree(path, depth, "H:/js-py", true);
  }
}
