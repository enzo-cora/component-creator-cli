import {INamingConvention} from "./INamingConvention";

export interface Directory{
  name : string
  prefix: string,
  sufixe : string,
  namingConvention : INamingConvention
}
