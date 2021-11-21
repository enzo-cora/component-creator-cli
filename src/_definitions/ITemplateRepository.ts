import {ITemplateConfigFile} from "./ITemplateConfigFile";

export type ITemplateMetadata = { path:string, configFile: ITemplateConfigFile}

export interface ITemplateRepository {
  clear() : void
  saveTemplate(templateName: string, templatePath: string) : void
  getMetadata(templateName:string) : Promise<ITemplateMetadata  | Error>
}