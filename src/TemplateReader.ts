import fs from "fs";
import path from "path";
import {nameConfigFile} from "./_config";
import {readdir} from "fs/promises";
import {ITemplateFileInfo, ITemplateReader} from "./_definitions/ITemplateReader";
import {ErrorList} from "./ErrorList";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";

export class TemplateReader implements ITemplateReader{


  static getTemplateConfigFile(templatePath) : Error | ITemplateConfigFile {
    const configFilePath = `${templatePath}/${nameConfigFile}`
    try {
      if (!fs.existsSync(configFilePath))
        return new Error(ErrorList.CONFIG_FIlE_MISS(templatePath))

      const fileBuffer = fs.readFileSync(path.resolve(configFilePath))
      return JSON.parse(fileBuffer.toString()) as ITemplateConfigFile
    }
    catch (err){
      return new Error(ErrorList.UNEXPECTED_ERROR(err))
    }
  }


  static checkConfigFileProperties(configFile:ITemplateConfigFile) : void | Error {

    const errors : string[] = []
    if(!configFile.template)
      errors.push(ErrorList.CONFIG_FILE_INVALID('template',"string"))
    else if(!configFile.componentWorkDir)
      errors.push(ErrorList.CONFIG_FILE_INVALID('componentWorkDir',"string || Object "))
    else if(typeof configFile.componentWorkDir === "object"){
      if(!configFile.componentWorkDir.extensionWorkDir)
        errors.push(ErrorList.CONFIG_FILE_INVALID('componentWorkDir.extensionWorkDir',"string"))
      else if(!configFile.componentWorkDir.extensionWorkDir)
        errors.push(ErrorList.CONFIG_FILE_INVALID('componentWorkDir.extensionWorkDir',"string"))
    }

    if(errors.length)
      return new Error(errors.join("\n"))
  }

  public templateDirName: string
  constructor(
    public templateName: string,
    public templatePath: string,
  ) {
    const matchResult = templateName.match(/([^\/]*)\/*$/) as Array<string>
    this.templateDirName = matchResult[1]
  }




  async getTemplateFiles() : Promise<Error |ITemplateFileInfo[]> {
    try {
      const result = await readdir(this.templatePath, { withFileTypes: true })
      return result
        .filter(file => file.isFile() && file.name !== nameConfigFile)
        .map(file => ({
          fileName : file.name,
          filePath : `${this.templatePath}/${file.name}`,
        }))
    }
    catch (err){
      return new Error(ErrorList.UNEXPECTED_ERROR(err))
    }
  }



}


