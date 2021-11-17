import fs, {readdirSync} from "fs";
import path from "path";
import {
  separator,
  nameComponentConfigFile,
  nameConfigDir,
  keywordReplacement,
  ERR_TEMPLATE_DIR_NAME_PART1, ERR_TEMPLATE_DIR_NAME_PART2
} from "./_config";
import {IComponentConfigFile} from "./_definitions/IComponentConfigFile";
import {readdir} from "fs/promises";

export interface ITemplateReader {
  componentWorkDirPath: string
  templateDirInfos : ITemplateDirInfos
  templateFilesInfos : ITemplateFileInfo[]
  createComponentDirName (replaceValue : string) : string | Error
  createComponentFilesNames(replaceValue : string) : string[] | Error
  // createComponentFIlesData(replaceValue : string) : string | Error
}

export type ITemplateDirInfos = {
  templateName: string
  dirName : string,
  dirPath : string,
}

export type ITemplateFileInfo = {
  fileName : string,
  filePath : string
}

const regexDirectory =  new RegExp(`(^[\\w]+)${separator}([\\S]+)`)
const exempleMsg =  `(Exemple : ex: TemplateName${separator}Interface${keywordReplacement}Entity)`

export class TemplateReader implements ITemplateReader{


  componentWorkDirPath : string

  constructor(
    public templateDirInfos : ITemplateDirInfos,
    public templateFilesInfos : ITemplateFileInfo[],
  ) {
    const configFileResult = this.getTemplateConfigFile()
    if(!configFileResult)
      this.componentWorkDirPath = ""
    else
      this.componentWorkDirPath = configFileResult.componentWorkDir
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


  private static getTemplateName(templateDirName) : string {
    const templateDirNameParted = regexDirectory.exec(templateDirName) as RegExpExecArray
    return templateDirNameParted[1]
  }


  static async getAllTemplateDirInfo() : Promise<ITemplateDirInfos[] | Error> {
    try {
      const globalDirConfigPath = path.resolve(nameConfigDir)
      if(!fs.existsSync(globalDirConfigPath))
        return new Error(`Problème ! Le répertoire global de configuration est manquant !`)

      const result = await readdir(globalDirConfigPath, { withFileTypes: true })
      const dirInfos = result
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ( {
          templateName : this.getTemplateName(dirent.name),
          dirName : dirent.name,
          dirPath :`${globalDirConfigPath}/${dirent.name}`
        } ))
      const checkingResult = this.checkAllTemplateDirInfo(dirInfos)

      return checkingResult instanceof Error ? checkingResult : dirInfos

    }
    catch (err){
      return new Error(`Une erreur innatendue s'est produite : ${err}`)
    }
  }


  static getAllTemplateFilesInfo(templateDirPath) : ITemplateFileInfo[] {
    const readDirResult = readdirSync(templateDirPath, { withFileTypes: true })
    return  readDirResult
      .filter(file => file.isFile() && file.name !== nameComponentConfigFile)
      .map(file => ({
        fileName : file.name,
        filePath : `${templateDirPath}/${file.name}`,
      }))
  }


  private getTemplateConfigFile() : IComponentConfigFile | null {
    const templateDirPath = this.templateDirInfos.dirPath
    if(fs.existsSync(`${templateDirPath}/${nameComponentConfigFile}`)){
      const result = fs.readFileSync(path.resolve(`${templateDirPath}/${nameComponentConfigFile}`))
      return JSON.parse(result.toString()) as IComponentConfigFile
    }
    else
      console.log(`Infos : Aucun fichier de configuration n'as été fourni avec le template : ${this.templateDirInfos.dirName}`)
    return null
  }

  createComponentDirName(replaceValue : string) : string | Error {
    const templateDirName = this.templateDirInfos.dirName
    const templateDirNameParted = regexDirectory.exec(templateDirName)
    if(!templateDirNameParted || !templateDirNameParted[2])
      return new Error(`Problème sur le template ${templateDirName} : ${ERR_TEMPLATE_DIR_NAME_PART2}`)

    return templateDirNameParted[2].replace(keywordReplacement, replaceValue)
  }


  createComponentFilesNames (replaceValue : string):  string[] | Error {
    return this.templateFilesInfos.map(templateFileInfo =>
      templateFileInfo.fileName.replace(keywordReplacement, replaceValue)
    )
  }


}


