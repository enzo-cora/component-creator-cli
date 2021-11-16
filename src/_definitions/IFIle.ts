import {INamingConvention} from "./INamingConvention";

export interface File{
  name : string
  prefix: string,
  sufixe : string,
  extension : string
  preExtention : string
  namingConvention : INamingConvention
}
