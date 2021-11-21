import {ITemplateMetadata, ITemplateRepository} from "./_definitions/ITemplateRepository";
import {TemplateReader} from "./TemplateReader";
import {ErrorList} from "./ErrorList";
import Conf from "conf";
import {initializer} from "./commands/Initialize";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";


class TEMPLATE_NOT_FOUND extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TEMPLATE_NOT_FOUND_ERROR"
  }
}


class TemplateRepository implements ITemplateRepository{

  constructor(private Store : Conf) {
  }

  clear() {
    this.Store.clear()
  }

  saveTemplate(templateName: string, templatePath: string): void  {
    this.Store.set(templateName,templatePath)
  }

  async getMetadata(templateName: string) : Promise<ITemplateMetadata  | Error> {

    let metadataResult = this._getTemplateMetadata(templateName)

    if(metadataResult instanceof TEMPLATE_NOT_FOUND){

      const reloadResult = await initializer.reload()
      if(reloadResult instanceof Error)
        return reloadResult
      metadataResult = this._getTemplateMetadata(templateName)
      if(metadataResult instanceof Error)
        return metadataResult
      const consistencyResult = this.checkTemplateConsistency(
        templateName,
        metadataResult.configFile
      )
      if(consistencyResult instanceof Error)
        return consistencyResult

      return metadataResult as ITemplateMetadata
    }

    else if(!(metadataResult instanceof Error)){
      const consistencyResult = await this.checkTemplateConsistency(
        templateName,
        metadataResult.configFile
      )
      if(consistencyResult)
        return metadataResult
      const reloadResult = await initializer.reload()
      if(reloadResult instanceof Error)
        return reloadResult
      metadataResult = this._getTemplateMetadata(templateName)
      if(metadataResult instanceof Error)
        return metadataResult

      return metadataResult as ITemplateMetadata
    }

    else
      return metadataResult as Error
  }

  private checkTemplateConsistency(cacheTempName:string, configFile:ITemplateConfigFile) : true | Error {

    const checkingResult = TemplateReader.checkConfigFileProperties(configFile)
    if(checkingResult instanceof Error)
      return checkingResult

    if(configFile.template === cacheTempName)
      return true

    return new Error(ErrorList.TEMPLATE_NOT_EXIST(cacheTempName))
  }

  private _getTemplateMetadata(templateName) : ITemplateMetadata | Error {
    const path = this.Store.get(templateName) as string
    if(!path)
      return new TEMPLATE_NOT_FOUND(ErrorList.TEMPLATE_NOT_EXIST(templateName))
    const configFileResult = TemplateReader.getTemplateConfigFile(path)
    if(configFileResult instanceof Error)
      return configFileResult

    return {path, configFile : configFileResult}

  }

}

export const TemplateRepo : ITemplateRepository  = new TemplateRepository(new Conf())