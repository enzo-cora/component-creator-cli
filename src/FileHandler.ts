import * as fs from "fs";
import path from "path";
import {ErrorList} from "./ErrorList";
import {IComponentFileInfo} from "./_definitions/ITemplateExtractor";



type IComponentCreator = (compWrkDir:string,compDirName:string, componentFiles: IComponentFileInfo[]) => Promise<string  | Error>

export const fileHandler : IComponentCreator = async (
  compWrkDir,
  compDrirName,
  componentFiles
)=> {
  try {
    const mkdirPath = `${compWrkDir}/${compDrirName}`

    if(  fs.existsSync(mkdirPath))
      throw new Error(ErrorList.COMPONENT_ALREADY_EXIST(compDrirName, path.relative(path.resolve(),mkdirPath) ))

    fs.mkdir(mkdirPath,err=> {
      if (err) throw new Error(`Une erreur est survenue lors de la création du répertoire : \n ${err.message}`)
    })

    const successLogs : string[] = []
    for(const file of componentFiles){
      fs.appendFile(
        `${mkdirPath}/${file.fileName}`,file.data, (err)=>{
          if (err) throw new Error(`Une erreur c'est produite pendant la création du fichier "${file.fileName}" : \n ${err}` )
      })
      successLogs.push(`Fichier ${file.fileName} : Création OK`)
    }
    return successLogs.join("\n")
  }
  catch (err){
    if(err instanceof Error)
      return err
    else
      return new Error(ErrorList.UNEXPECTED_ERROR(err))

  }

}