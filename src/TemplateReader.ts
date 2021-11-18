import fs, {readdirSync} from "fs";
import path from "path";
import {
  separator,
  nameComponentConfigFile,
  nameConfigDir,
  keywordReplacement,
  ERR_TEMPLATE_DIR_NAME_PART1, ERR_TEMPLATE_DIR_NAME_PART2, regexDirectory, absolutePathConfigDir
} from "./_config";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";
import {readdir} from "fs/promises";


export type ITemplateDirInfos = {
  dirName : string,
  dirPath : string,
}

export type ITemplateFileInfo = {
  fileName : string,
  filePath : string
}


export interface ITemplateReader {
  templateName: string
  templateDirInfo : ITemplateDirInfos
  templateFilesInfo : ITemplateFileInfo[]
  templateConfigFile : ITemplateConfigFile | null
}


export class TemplateReader implements ITemplateReader{

  private constructor(
    public templateName: string,
    public templateDirInfo : ITemplateDirInfos,
    public templateFilesInfo : ITemplateFileInfo[],
    public templateConfigFile : ITemplateConfigFile | null
  ) {}


  static async build(wtedTemplateName : string) : Promise<ITemplateReader | Error> {

    const allTemplatesDirInfoResult = await this.getAllTemplateDirInfo()
    if(allTemplatesDirInfoResult instanceof Error)
      return  allTemplatesDirInfoResult

    let templateName
    const templateDirInfoResult = this.findWantedTemplate(wtedTemplateName,allTemplatesDirInfoResult)
    if(templateDirInfoResult instanceof Error)
      return templateDirInfoResult
    else
      templateName = wtedTemplateName

    const templateConfigFile = this.getTemplateConfigFile(templateDirInfoResult)
    const templateFilesInfosResult = await this.getAllTemplateFilesInfo(templateDirInfoResult.dirPath)

    if(templateFilesInfosResult instanceof Error)
      return templateFilesInfosResult

    return {
      templateName,
      templateDirInfo : templateDirInfoResult,
      templateFilesInfo : templateFilesInfosResult,
      templateConfigFile
    }
  }

  private static findWantedTemplate(wantedTemplateName : string, templatesDirsInfo : ITemplateDirInfos[]) :  ITemplateDirInfos | Error {
    const templateDirFound = templatesDirsInfo.find(tempDirInfo => this.getTemplateName(tempDirInfo.dirName)  === wantedTemplateName)
    if(!templateDirFound)
      return new Error(`Aucune template nommé "${wantedTemplateName}" n'as été trouvé`)
    else
      return templateDirFound

  }

  private static async getAllTemplateDirInfo() : Promise<ITemplateDirInfos[] | Error> {
    try {

      const result = await readdir(absolutePathConfigDir, { withFileTypes: true })
      const dirInfo = result
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ( {
          dirName : dirent.name,
          dirPath :`${absolutePathConfigDir}/${dirent.name}`
        } ))
      const checkingResult = this.checkAllTemplateDirInfo(dirInfo)

      return checkingResult instanceof Error ? checkingResult : dirInfo

    }
    catch (err){
      return new Error(`Une erreur innatendue s'est produite : ${err}`)
    }
  }

  static async getAllTemplateFilesInfo(templateDirPath) : Promise<ITemplateFileInfo[] | Error > {
    try {
      const result = await readdir(templateDirPath, { withFileTypes: true })
      return result
        .filter(file => file.isFile() && file.name !== nameComponentConfigFile)
        .map(file => ({
          fileName : file.name,
          filePath : `${templateDirPath}/${file.name}`,
        }))
    }
    catch (err){
      return new Error(`Une erreur innatendue s'est produite : ${err}`)
    }
  }

  private static checkAllTemplateDirInfo(templatesDirInfos : ITemplateDirInfos[]) : void | Error {
    const errors : string[] = []

    for(const templateDirInfos of templatesDirInfos){
      const templateDirName = templateDirInfos.dirName
      const templateDirNameParted = regexDirectory.exec(templateDirName)
      if( !templateDirNameParted || !templateDirNameParted[1] )
        errors.push(`Problème sur le template ${templateDirName} :\n ${ERR_TEMPLATE_DIR_NAME_PART1}`)
      else if(!templateDirNameParted || !templateDirNameParted[2])
        errors.push(`Problème sur le template ${templateDirName} : ${ERR_TEMPLATE_DIR_NAME_PART2}`)
    }
    if(errors.length){
      const textError = errors.join(`\n-----------------------------`)
      return new Error(textError)
    }

  }


  private static getTemplateName(templateDirName:string) : string {
    const templateDirNameParted = regexDirectory.exec(templateDirName) as RegExpExecArray
    return templateDirNameParted[1]
  }


  private static getTemplateConfigFile(templateDirInfos : ITemplateDirInfos) : ITemplateConfigFile | null {
    const templateDirPath = templateDirInfos.dirPath
    if(fs.existsSync(`${templateDirPath}/${nameComponentConfigFile}`)){
      const result = fs.readFileSync(path.resolve(`${templateDirPath}/${nameComponentConfigFile}`))
      return JSON.parse(result.toString()) as ITemplateConfigFile
    }
    else
      console.log(`Infos : Aucun fichier de configuration n'as été fourni avec le template : ${templateDirInfos.dirName}`)
    return null
  }

}


