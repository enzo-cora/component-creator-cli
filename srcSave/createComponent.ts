import * as fs from "fs";
import path from "path";
import {globalConfigFile, pathGlobalWorkDir} from "./_config";

export interface FileCreation {
  fileName : string,
  data : string
}

type IComponentCreator = (mkDirPath:string, dirName:string, finalFiles: FileCreation[]) => void  | Error

export const createComponent : IComponentCreator = (
  mkDirPath,
  dirName,
  finalFiles
)=> {

  const folderPath = `${mkDirPath}/${dirName}`

  if(  fs.existsSync(folderPath))
    return new Error(`Impossible de créer le composant "${dirName}" à l'emplacement "${path.relative(path.resolve(),mkDirPath)}" car un composant du même nom existe déjà à cet emplacement`)

  fs.mkdir(folderPath,err=> {
    if (err)
      return new Error(`Une erreur est survenue lors de la création du répertoire : \n ${err.message}`)
  })

  for(const file of finalFiles){
    fs.appendFile(`${folderPath}/${file.fileName}`,file.data,(err)=>{
      return new Error(`Une erreur c'est produite pendant la création du fichier "${file.fileName}" : \n ${err}` )
    })
    console.log(`Ficher ${file.fileName} : Création terminée`)
  }

}

