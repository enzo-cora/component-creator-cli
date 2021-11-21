import * as fs from "fs";
import path from "path";
import {ErroMsgs} from "./_constantes/ErroMsgs";
import {IComponentFileInfo} from "./_definitions/ITemplateExtractor";
import {InfoMsgs} from "./_constantes/InfoMsgs";



type IComponentCreator = (compWrkDir:string,compDirName:string, componentFiles: IComponentFileInfo[]) => Promise<string  | Error>

export const fileHandler : IComponentCreator = async (
  compWrkDir,
  compDrirName,
  componentFiles
)=> {

  const mkdirPath = `${compWrkDir}/${compDrirName}`

  if(  fs.existsSync(mkdirPath))
    return new Error(ErroMsgs.COMPONENT_ALREADY_EXIST(compDrirName, path.relative(path.resolve(),mkdirPath) ))

  try {
    fs.mkdirSync(mkdirPath)
  }
  catch (err){
    if(err instanceof Error)
      return new Error(ErroMsgs.DIRECTORY_CREATION_UNEXPECTRED_ERR(compDrirName,err.message ))
    else
      return new Error(ErroMsgs.DIRECTORY_CREATION_UNEXPECTRED_ERR(compDrirName,err))

  }


  try {
    const successLogs:string[] = await Promise.all(componentFiles.map(async (file)=> {
      await fs.promises.appendFile(`${mkdirPath}/${file.fileName}`,file.data)
      return InfoMsgs.SUCCESS_FILE_CREATON(file.fileName)
    }))
    return successLogs.join("\n")
  }
  catch (err){
    if(err instanceof Error)
      return new Error(ErroMsgs.FILE_CREATION_UNEXPECTRED_ERR(compDrirName,err.message ))
    else
      return new Error(ErroMsgs.FILE_CREATION_UNEXPECTRED_ERR(compDrirName,err))
  }


}