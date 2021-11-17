import fs, {readdirSync} from "fs";
import path from "path";
import {separator, nameComponentConfigFile, nameConfigDir, nameGlobalConfigFile, keywordReplacement} from "./_config";
import {IComponentConfigFile} from "./_definitions/IComponentConfigFile";
import {readdir} from "fs/promises";

export interface IComponentReader {
  componentWorkDirPath: string
  rawFilesInfos : rawFileInfo[]
  getComponentType(): string | Error
  getTransformedDirName (replaceValue : string) : string | Error
  getTransformedFilesNames(replaceValue : string) : string[] | Error
  // getTransformedFilesContents(replaceValue : string) : string | Error
}

export type DirInfos = {
  dirName : string,
  dirPath : string
}

export type rawFileInfo = {
  fileName : string,
  filePath : string
}

const regexDirectory =  new RegExp(`(^[\\w]+)${separator}([\\S]+)`)

export class ComponentReader implements IComponentReader{


  rawFilesInfos : rawFileInfo[]
  componentWorkDirPath : string

  constructor(
    public dirInfo : DirInfos,
  ) {

    const configFileResult = this.getConfigFile()
    if(!configFileResult)
      this.componentWorkDirPath = ""
    else
      this.componentWorkDirPath = configFileResult.componentWorkDir

    this.rawFilesInfos = this.getAllRawFilesInfos()
  }

  static async getAllRawDirsInfos() : Promise<DirInfos[] | Error> {
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

  private getAllRawFilesInfos() : rawFileInfo[] {

    const dirPath = this.dirInfo.dirPath
    const readDirResult = readdirSync(dirPath, { withFileTypes: true })
    return  readDirResult
      .filter(file => file.isFile() && file.name !== nameComponentConfigFile)
      .map(file => ({
        fileName : file.name,
        filePath : `${dirPath}/${file.name}`,
      }))
  }

  private getConfigFile() : IComponentConfigFile | null {
    const dirPath = this.dirInfo.dirPath
    if(fs.existsSync(`${dirPath}/${nameComponentConfigFile}`)){
      const result = fs.readFileSync(path.resolve(`${dirPath}/${nameComponentConfigFile}`))
      return JSON.parse(result.toString()) as IComponentConfigFile
    }
    else
      console.log(`Infos : Aucun fichier de configuration n'as été fourni avec le composant ${this.dirInfo.dirName}`)
    return null
  }

  getComponentType() : string | Error {
    const dirName = this.dirInfo.dirName
    const componentType = regexDirectory.exec(dirName)
    if( !componentType || !componentType[1] )
      return new Error(`Vous devez donner un type à votre composant. Ecrivez-le dans le nom du dossier DEVANT le séparateur suivant "${separator}" `)
    return componentType[1]
  }

  getTransformedDirName(replaceValue : string) : string | Error {
    const dirName = this.dirInfo.dirName
    const componentName = regexDirectory.exec(dirName)
    if(!componentName || !componentName[2])
      return new Error("Le nom du dossier modèle doit contenir le Format du future Nom ! (ex: TypeOfComponent:CamelCaseDir ) ")
    return componentName[2].replace(keywordReplacement, replaceValue)
  }

  getTransformedFilesNames (replaceValue : string):  string[] | Error {
    return this.rawFilesInfos.map(fileInfo =>
      fileInfo.fileName.replace(keywordReplacement, replaceValue)
    )
  }

  getTransformedFilesContents(replaceValue){}

}


