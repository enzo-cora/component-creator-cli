import * as fs from "fs";
import path from "path";
import {IComponentFileInfo} from "../ComponentInfosGenerator";



type IComponentCreator = (mkdirPath:string,compDrirName:string, componentFiles: IComponentFileInfo[]) => void  | Error

export const createComponent : IComponentCreator = (
  mkdirPath,
  compDrirName,
  componentFiles
)=> {


  if(  fs.existsSync(mkdirPath))
    return new Error(`Impossible de créer le composant "${compDrirName}" à l'emplacement "${path.relative(path.resolve(),mkdirPath)}" car un composant du même nom existe déjà à cet emplacement`)

  fs.mkdir(mkdirPath,err=> {
    if (err)
      return new Error(`Une erreur est survenue lors de la création du répertoire : \n ${err.message}`)
  })

  for(const file of componentFiles){
    fs.appendFile(`${mkdirPath}/${file.fileName}`,file.data,(err)=>{
      return new Error(`Une erreur c'est produite pendant la création du fichier "${file.fileName}" : \n ${err}` )
    })
    console.log(`Ficher ${file.fileName} : Création terminée`)
  }

}