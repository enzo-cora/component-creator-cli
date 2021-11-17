import * as fs from "fs";

export interface FileCreation {
  fileName : string,
  data : string
}

type IComponentCreator = (mkDirPath:string, ComponentName:string, finalFiles: FileCreation[]) => void  | Error

export const createComponent : IComponentCreator = (
  dirPath,
  dirName,
  files
)=> {

  const folderPath = `${dirPath}/${dirName}`

  fs.mkdir(folderPath,err=> {
    if (err)
      return new Error(`Une erreur est survenue lors de la création du répertoire : \n ${err.message}`)
  })

  for(const file of files){
    fs.appendFile(`${folderPath}/${file.fileName}`,file.data,(err)=>{
      return new Error(`Une erreur c'est produite pendant la création du fichier "${file.fileName}" : \n ${err}` )
    })
    console.log(`Ficher ${file.fileName} : Création terminée`)
  }

}

