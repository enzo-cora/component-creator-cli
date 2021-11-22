import {ITemplateConfigFile} from "./ITemplateConfigFile";

export type ITemplateMetadata = { path:string, configFile: ITemplateConfigFile}

export interface ITemplateRepository {
  clear() : void
  saveTemplate(templateName: string, templatePath: string) : void
  getOneMetadata(templateName:string) : Promise<ITemplateMetadata  | Error>
  getAllMetadata() : Promise<ITemplateMetadata[]  | Error>
}