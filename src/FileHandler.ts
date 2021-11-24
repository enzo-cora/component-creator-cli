import * as fs from "fs";
import path from "path";
import {ErrorMsgs} from "./_constantes/ErrorMsgs";
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
    return new Error(ErrorMsgs.COMPONENT_ALREADY_EXIST(compDrirName, path.relative(path.resolve(),mkdirPath) ))

  try {
    fs.mkdirSync(mkdirPath)
  }
  catch (err){
    if(err instanceof Error)
      return new Error(ErrorMsgs.UNEXPECTRED_DIRECTORY_CREATION_ERR(compDrirName,err.message ))
    else
      return new Error(ErrorMsgs.UNEXPECTRED_DIRECTORY_CREATION_ERR(compDrirName,err))

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
      return new Error(ErrorMsgs.UNEXPECTRED_FILE_CREATION_ERR(compDrirName,err.message ))
    else
      return new Error(ErrorMsgs.UNEXPECTRED_FILE_CREATION_ERR(compDrirName,err))
  }


}