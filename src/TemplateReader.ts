import fs, {readdirSync} from "fs";
import path from "path";
import {separator, nameComponentConfigFile, nameConfigDir, nameGlobalConfigFile, keywordReplacement} from "./_config";
import {IComponentConfigFile} from "./_definitions/IComponentConfigFile";
import {readdir} from "fs/promises";

export interface ITemplateReader {
  componentWorkDirPath: string
  templateFilesInfos : templateFileInfo[]
  templateDirInfos : templateDirInfos
  getTemplateName(): string | Error
  createComponentDirName (replaceValue : string) : string | Error
  createComponentFilesNames(replaceValue : string) : string[] | Error
  // createComponentFIlesData(replaceValue : string) : string | Error
}

export type templateDirInfos = {
  dirName : string,
  dirPath : string
}

export type templateFileInfo = {
  fileName : string,
  filePath : string
}

const regexDirectory =  new RegExp(`(^[\\w]+)${separator}([\\S]+)`)

export class TemplateReader implements ITemplateReader{


  templateFilesInfos : templateFileInfo[]
  componentWorkDirPath : string

  constructor(
    public templateDirInfos : templateDirInfos,
  ) {

    const configFileResult = this.getTemplateConfigFile()
    if(!configFileResult)
      this.componentWorkDirPath = ""
    else
      this.componentWorkDirPath = configFileResult.componentWorkDir

    this.templateFilesInfos = this.getAllTemplateFilesInfos()
  }

  static async getTemplatesDirsInfos() : Promise<templateDirInfos[] | Error> {
    try {
      const globalDirConfigPath = path.resolve(nameConfigDir)
      if(!fs.existsSync(globalDirConfigPath))
        return new Error(`Problème ! Le répertoire global de configuration est manquant !`)

      const result = await readdir(globalDirConfigPath, { withFileTypes: true })
      return  result
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ( {dirName : dirent.name, dirPath :`${globalDirConfigPath}/${dirent.name}`} ))
    }
    catch (err){
      return new Error(`Une erreur s'est produite : ${err}`)
    }
  }

  private getAllTemplateFilesInfos() : templateFileInfo[] {
    const templateDirPath = this.templateDirInfos.dirPath
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

  getTemplateName() : string | Error {
    const templateDirName = this.templateDirInfos.dirName
    const templateDirNameParted = regexDirectory.exec(templateDirName)
    if( !templateDirNameParted || !templateDirNameParted[1] )
      return new Error(`Vous devez donner un type à votre composant. Ecrivez-le dans le nom du dossier DEVANT le 
      séparateur suivant "${separator}" (ex: TemplateName${separator}${keywordReplacement}Entity) `)

    return templateDirNameParted[1]
  }

  createComponentDirName(replaceValue : string) : string | Error {
    const templateDirName = this.templateDirInfos.dirName
    const templateDirNameParted = regexDirectory.exec(templateDirName)
    if(!templateDirNameParted || !templateDirNameParted[2])
      return new Error(`Le nom du dossier modèle doit contenir le Format du future Nom ! (ex: TemplateName${separator}${keywordReplacement}Entity )`)

    return templateDirNameParted[2].replace(keywordReplacement, replaceValue)
  }


  createComponentFilesNames (replaceValue : string):  string[] | Error {
    return this.templateFilesInfos.map(rawfileInfo =>
      rawfileInfo.fileName.replace(keywordReplacement, replaceValue)
    )
  }


}


