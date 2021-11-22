import {ITemplateMetadata, ITemplateRepository} from "./_definitions/ITemplateRepository";
import {TemplateReader} from "./TemplateReader";
import {ErroMsgs} from "./_constantes/ErroMsgs";
import Conf from "conf";
import {Initializer} from "./commands/Initializer";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";
import fs from "fs";
import {IInitializer} from "./_definitions/IInitializer";
import {InfoMsgs} from "./_constantes/InfoMsgs";


class TEMPLATE_NOT_FOUND extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TEMPLATE_NOT_FOUND_ERROR"
  }
}


class TemplateRepository implements ITemplateRepository{

  constructor(
    private Store : Conf,
    private initialiser : IInitializer
  ) {
  }

  clear() {
    this.Store.clear()
  }

  saveTemplate(templateName: string, templatePath: string): void  {
    this.Store.set(templateName,templatePath)
  }

  async getOneMetadata(templateName: string) : Promise<ITemplateMetadata  | Error> {

    let metadataResult = this._getMetadata(templateName)

    if(metadataResult instanceof TEMPLATE_NOT_FOUND){
      const reloadResult = await this._reloadCLI(templateName)
      if(reloadResult instanceof Error)
        return reloadResult

      return reloadResult
    }
    else if(metadataResult instanceof Error)
      return metadataResult

    else {
      const consistencyResult = this._checkTemplateConsistency(
        templateName,
        metadataResult.configFile
      )
      if(consistencyResult instanceof Error)
        return consistencyResult
      else if(consistencyResult === true)
        return metadataResult

      const reloadResult = await this._reloadCLI(templateName)
      if(reloadResult instanceof Error)
        return reloadResult

      return reloadResult
    }

  }

  async getAllMetadata() : Promise<ITemplateMetadata[]  | Error> {

    const reloadResult = await this.initialiser.execute()
    if(reloadResult instanceof Error)
      return reloadResult

    const entriesResult : Array<[string,string]> = Object.entries(this.Store.store as any)

    let metadatas : ITemplateMetadata[] = []
    for(const entry of entriesResult){
      const templateName = entry[0]
      const templateDirPath = entry[1]

      const configFileResult = TemplateReader.getTemplateConfigFile(templateDirPath)
      if(configFileResult instanceof Error)
        return configFileResult

      metadatas.push({
        path : templateDirPath,
        configFile : configFileResult
      })

    }
    return metadatas
  }

  private async _reloadCLI(templateName) : Promise<Error|ITemplateMetadata>{
    const reloadResult = await this.initialiser.execute()
    if(reloadResult instanceof Error)
      return reloadResult
    const metadataResult = this._getMetadata(templateName)
    if(metadataResult instanceof Error)
      return metadataResult
    const consistencyResult = this._checkTemplateConsistency(
      templateName,
      metadataResult.configFile
    )
    if(consistencyResult instanceof Error)
      return consistencyResult
    else if (consistencyResult === false)
      return new Error(ErroMsgs.CACHE_UNEXPECTED_INCONSISTENCY)

    return metadataResult
  }


  private _checkTemplateConsistency(cacheTempName:string, configFile:ITemplateConfigFile) : boolean | Error {
    const checkingResult = TemplateReader.checkConfigFileProperties(configFile)
    if(checkingResult instanceof Error)
      return checkingResult
    return configFile.template === cacheTempName
  }

  private _getMetadata(templateName) : ITemplateMetadata | Error {
    const path = this.Store.get(templateName) as string

    if(!path || !fs.existsSync(path))
      return new TEMPLATE_NOT_FOUND(ErroMsgs.TEMPLATE_NOT_EXIST(templateName))

    const configFileResult = TemplateReader.getTemplateConfigFile(path)
    if(configFileResult instanceof Error)
      return configFileResult

    return {path, configFile : configFileResult}

  }

}

export const TemplateRepo : ITemplateRepository  = new TemplateRepository(new Conf(),new Initializer(InfoMsgs.SUCCESS_RELOAD,false))