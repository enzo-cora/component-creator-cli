import fs from "fs";
import path from "path";
import {nameConfigFile} from "./_constantes/config";
import {readdir} from "fs/promises";
import {ITemplateFileInfo, ITemplateReader} from "./_definitions/ITemplateReader";
import {ErroMsgs} from "./_constantes/ErroMsgs";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";

export class TemplateReader implements ITemplateReader{


  static getTemplateConfigFile(templatePath) : Error | ITemplateConfigFile {
    const configFilePath = `${templatePath}/${nameConfigFile}`
    try {
      if (!fs.existsSync(configFilePath))
        return new Error(ErroMsgs.CONFIG_FIlE_MISS(templatePath))

      const fileBuffer = fs.readFileSync(path.resolve(configFilePath))
      return JSON.parse(fileBuffer.toString()) as ITemplateConfigFile
    }
    catch (err){
      return new Error(ErroMsgs.UNEXPECTED_ERROR(err))
    }
  }


  static checkConfigFileProperties(configFile:ITemplateConfigFile) : void | Error {

    const errors : string[] = []
    if(!configFile.template)
      errors.push(ErroMsgs.CONFIG_FILE_INVALID('template',"string"))
    else if(!configFile.componentWorkDir)
      errors.push(ErroMsgs.CONFIG_FILE_INVALID('componentWorkDir',"string || Object "))
    else if(typeof configFile.componentWorkDir === "object"){
      if(!configFile.componentWorkDir.extensionWorkDir)
        errors.push(ErroMsgs.CONFIG_FILE_INVALID('componentWorkDir.extensionWorkDir',"string"))
      else if(!configFile.componentWorkDir.extensionWorkDir)
        errors.push(ErroMsgs.CONFIG_FILE_INVALID('componentWorkDir.extensionWorkDir',"string"))
    }

    if(errors.length)
      return new Error(errors.join("\n"))
  }

  public templateDirName: string
  constructor(
    public templateName: string,
    public templatePath: string,
  ) {
    const matchResult = templatePath.match(/([^\/]*)\/*$/) as Array<string>
    this.templateDirName = matchResult[1]
  }




  async getTemplateFiles() : Promise<Error |ITemplateFileInfo[]> {
    try {
      const result = await readdir(this.templatePath, { withFileTypes: true })
      const files = result.filter(file => file.isFile() && file.name !== nameConfigFile)

      return files.map(file => {
        const filePath = `${this.templatePath}/${file.name}`
        const fileBuffer = fs.readFileSync(path.resolve(filePath))
        return {
          fileName : file.name,
          filePath,
          fileData :  fileBuffer.toString()
        }
        })
    }
    catch (err){
      return new Error(ErroMsgs.UNEXPECTED_ERROR(err))
    }
  }



}


