import * as fs from "fs";
import path from "path";

export interface componentFileInfo {
  fileName : string,
  data : string
}

type IComponentCreator = (wrkDirPath:string, compDirName:string, compFiles: componentFileInfo[]) => void  | Error

export const createComponent : IComponentCreator = (
  wrkDirPath,
  compDirName,
  compFiles
)=> {

  const compDirPath = `${wrkDirPath}/${compDirName}`

  if(  fs.existsSync(compDirPath))
    return new Error(`Impossible de créer le composant "${compDirName}" à l'emplacement "${path.relative(path.resolve(),wrkDirPath)}" car un composant du même nom existe déjà à cet emplacement`)

  fs.mkdir(compDirPath,err=> {
    if (err)
      return new Error(`Une erreur est survenue lors de la création du répertoire : \n ${err.message}`)
  })

  for(const file of compFiles){
    fs.appendFile(`${compDirPath}/${file.fileName}`,file.data,(err)=>{
      return new Error(`Une erreur c'est produite pendant la création du fichier "${file.fileName}" : \n ${err}` )
    })
    console.log(`Ficher ${file.fileName} : Création terminée`)
  }

}

