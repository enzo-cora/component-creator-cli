import {readdir} from "fs/promises";
import path from "path";
import {separator, nameComponentConfigFile, nameConfigDir, nameGlobalConfigFile, keywordReplacement} from "./config";
import {IComponentConfigFile} from "./_definitions/IComponentConfigFile";
import fs, {readdirSync} from "fs";

export interface IComponentReader {
  getComponentType() : string | Error
  getConfigFile () : IComponentConfigFile | void
  getTransformedDirName (replaceValue : string) : string | Error
  getTransformedFilesNames(replaceValue : string) : string[] | Error
  getTransformeedFileContent(replaceValue : string)
}

export type DirInfos = {
  dirName : string,
  dirPath : string
}

export type FileInfos = {
  fileName : string,
  filePath : string
}

const regexDirectory =  new RegExp(`(^[\\w]+)${separator}([\\S]+)`)

export class ComponentReader implements IComponentReader{


  filesInfos : FileInfos[]

  constructor(
    public dirInfo : DirInfos,
  ) {
   this.filesInfos = this.getAllFilesInfos()
  }

  static async getAllDirsInfos() : Promise<DirInfos[]> {
    const configDirPath = path.resolve(nameConfigDir)
    const result = await readdir(configDirPath, { withFileTypes: true })
    return  result
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ( {dirName : dirent.name, dirPath :`${configDirPath}/${dirent.name}`} ))
  }

  private getAllFilesInfos() : FileInfos[] {
    const dirPath = this.dirInfo.dirPath
    const result = readdirSync(dirPath, { withFileTypes: true })
    return  result
      .filter(file => file.isFile() && file.name !== nameComponentConfigFile)
      .map(file => ({
        fileName : file.name,
        filePath : `${dirPath}/${file.name}`,
      }))
  }

  getConfigFile() : IComponentConfigFile | void {
    const dirPath = this.dirInfo.dirPath
    if(fs.existsSync(`${dirPath}/${nameComponentConfigFile}`)){
      const result = fs.readFileSync(path.resolve(`${dirPath}/${nameComponentConfigFile}`))
      return JSON.parse(result.toString()) as IComponentConfigFile
    }
    else
      console.log(`Aucun fichier de configuration doit être fourni avec le composant ${this.dirInfo.dirName}`)
    return
  }

  getComponentType() : string | Error {
    const dirName = this.dirInfo.dirName
    const componentType = regexDirectory.exec(dirName)
    if( !componentType || !componentType[1] ){
      return new Error(`Vous devez donner un type à votre composant. Ecrivez-le dans le nom du dossier DEVANT le séparateur suivant "${separator}" `)
    }else
      return componentType[1]
  }

  getTransformedDirName(replaceValue : string) : string | Error {
    const dirName = this.dirInfo.dirName
    const componentName = regexDirectory.exec(dirName)
    if(!componentName || !componentName[2]){
      return new Error("Le nom du dossier modèle doit contenir le Format du future Nom ! (ex: TypeOfComponent:CamelCaseDir ) ")
    }else
      return componentName[2].replace(keywordReplacement, replaceValue)
  }

  getTransformedFilesNames (replaceValue : string){
    return this.filesInfos.map(fileInfo =>
      fileInfo.fileName.replace(keywordReplacement, replaceValue)
    )
  }

  getTransformeedFileContent(replaceValue){}

}


