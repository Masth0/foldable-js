import { Foldable } from "./Foldable";
import { FoldableStatus } from "./types";

export { Foldable, FoldableStatus };

(<any>window).Foldable = Foldable;
(<any>window).FoldableStatus = FoldableStatus;