import * as fs from "fs";
import {IComponentReader} from "./ComponentReader";

type IComponentCreator = (path:string, replaceName:string, componentReader:IComponentReader) => void

export const createComponent : IComponentCreator = async (
  path,
  name,
  componentType
)=> {


  if(componentType)


 try {
   //Creation du dossier [Name]
   const folderName = name
   fs.mkdir(`${path}/${folderName}`,(err)=> {
     if(err){
       console.log('Une erreur est survenue :', err.message)
     }
     else {
       const folderPath = `${path}/application/use-cases/${folderName}`
       const fileName = name

       //Creation du fichier [Name].ts
       fs.appendFileSync(`${folderPath}/${fileName}.ts`,'')

       //Creation du fichier [IName]RequestDto.ts
       fs.appendFileSync(`${folderPath}/I${fileName}RequestDto.ts`,'')

       //Creation du fichier [IName]ResponseDto.ts
       fs.appendFileSync(`${folderPath}/I${fileName}ResponseDto.ts`,'')

       console.log("creation terminée")
     }
   })
 }
 catch (err){
   console.log("Une erreur c'est produite: ",err)
 }
}

