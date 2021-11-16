import {ComponentDispatcherInstance} from "./ComponentDispatcher";

type NamingConvention = 'camelCase' | "PascalCase" | "snake_case" | "kebab-case"

interface File{
  name : string
  prefix: string,
  sufixe : string,
  extension : string
  preExtention : string
  namingConvention : NamingConvention
}
interface Directory{
  name : string
  prefix: string,
  sufixe : string,
  namingConvention : NamingConvention
}

interface Handler {
  firectory : Directory
  files : File[]
}

export const wrkDir : string =  "src/core"

ComponentDispatcherInstance.addComponent('uc','application/use-cases')
ComponentDispatcherInstance.addComponent('entity','domain/entities')