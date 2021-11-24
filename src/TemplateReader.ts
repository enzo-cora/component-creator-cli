import fs from "fs";
import path from "path";
import {nameConfigFile} from "./_constantes/config";
import {readdir} from "fs/promises";
import {ITemplateFileInfo, ITemplateReader} from "./_definitions/ITemplateReader";
import {ErrorMsgs} from "./_constantes/ErrorMsgs";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";

export class TemplateReader implements ITemplateReader{


  static getTemplateConfigFile(templatePath) : Error | ITemplateConfigFile {
    const configFilePath = `${templatePath}/${nameConfigFile}`
    try {
      if (!fs.existsSync(configFilePath)){
        const matchResult = templatePath.match(/([^\/]*)\/*$/) as Array<string>
        return new Error(ErrorMsgs.CONFIG_FIlE_MISS(matchResult[1]))
      }


      const fileBuffer = fs.readFileSync(path.resolve(configFilePath))
      return JSON.parse(fileBuffer.toString()) as ITemplateConfigFile
    }
    catch (err){
      return new Error(ErrorMsgs.UNEXPECTED_ERR("la récupération du fichier de configuration",err))
    }
  }


  static checkConfigFileProperties(configFile:ITemplateConfigFile) : void | Error {

    const errors: string[] = []
    if (!configFile.template || typeof (configFile.template) !== "string")
      errors.push(ErrorMsgs.CONFIG_FILE_INVALID('template', "string(min: 1 char)"))


    if (!configFile.componentWorkDir)
      errors.push(ErrorMsgs.CONFIG_FILE_INVALID('componentWorkDir', "string(min: 1 char) | Object "))

    if (typeof configFile.componentWorkDir === "object") {
      if (!configFile.componentWorkDir.rootWorkDir || typeof configFile.componentWorkDir.rootWorkDir !== "string")
        errors.push(ErrorMsgs.CONFIG_FILE_INVALID('componentWorkDir.rootWorkDir', "string(min: 1 char)"))
      else if(configFile.componentWorkDir.rootWorkDir.startsWith("/"))
        errors.push( ErrorMsgs.ROOT_PATH_INVALID_VALUE(configFile.componentWorkDir.rootWorkDir) )

      if (!configFile.componentWorkDir.hasOwnProperty("extensionWorkDir") || typeof configFile.componentWorkDir.extensionWorkDir !== "string")
        errors.push(ErrorMsgs.CONFIG_FILE_INVALID('componentWorkDir.extensionWorkDir', "string(min: 0 char)"))
      else if(configFile.componentWorkDir.extensionWorkDir.startsWith("/"))
        errors.push( ErrorMsgs.EXTENTION_PATH_INVALID_VALUE(configFile.componentWorkDir.extensionWorkDir) )
    }
    else if (typeof configFile.componentWorkDir !== "string")
      errors.push(ErrorMsgs.CONFIG_FILE_INVALID('componentWorkDir', "string(min: 1 char) | Object "))

    if(typeof configFile.componentWorkDir === "string" && configFile.componentWorkDir.startsWith("/"))
      errors.push(ErrorMsgs.PROJECT_PATH_INVALID_VALUE(configFile.componentWorkDir))


    if (errors.length)
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
      return new Error(ErrorMsgs.UNEXPECTED_ERR("la récupération des fichiers du template",err))
    }
  }



}


