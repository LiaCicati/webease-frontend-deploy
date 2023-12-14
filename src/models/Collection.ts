import { Attribute } from "./Attribute";

export interface Collection {
  id?: string;
  name: string;
  description: string;
  attributes?: Attribute[]
}
