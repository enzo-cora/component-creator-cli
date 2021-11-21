import {ITemplateReader} from "./ITemplateReader";
import {ITemplateConfigFile} from "./ITemplateConfigFile";

export interface IComponentFileInfo {
  fileName : string,
  data : string
}


export interface ITemplateExtractor {
  templateReader:ITemplateReader,
  replaceVal:string,
  subdomain? : string
  getComponentDirName() : string
  getComponentFiles() : Promise<IComponentFileInfo[] | Error>
  getComponentWrkDirPath(compWrkDirPath : ITemplateConfigFile['componentWorkDir']) : string | Error
}
