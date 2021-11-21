import fs from "fs";
import {keywordExemple, nameConfigDir, nameConfigFile} from "../_constantes/config";
import path from "path";
import {readdir} from "fs/promises";
import {ITemplateDirInfos} from "../_definitions/ITemplateReader";
import {IInitializeCommand} from "../_definitions/IInitializeCommand";
import {TemplateReader} from "../TemplateReader";
import {TemplateRepo} from "../TemplateRepository";
import {IComponentFileInfo} from "../_definitions/ITemplateExtractor";
import {fileHandler} from "../FileHandler";
import {ErroMsgs} from "../_constantes/ErroMsgs";
import {InfoMsgs} from "../_constantes/InfoMsgs";

type IExampleTemplate = {
  dirName : string,
  files : IComponentFileInfo[]
}

class Initializer implements IInitializeCommand {

  constructor() {
  }

  async reload(showMsg = false) : Promise<Error | void> {
   try {
     const configDirPath = path.resolve(nameConfigDir)
     Initializer.initConfigDir(configDirPath)
     const result = await readdir(configDirPath,{ withFileTypes: true })
     const templates : ITemplateDirInfos[] = result
       .filter(dirent => dirent.isDirectory())
       .map(temp=> ({dirName :temp.name, dirPath: `${configDirPath}/${temp.name}`}))

     TemplateRepo.clear()
     const errors : string[] = []
     templates.forEach(templateDirInfo => {
       const initTemplateResult = Initializer.initTemplate(templateDirInfo)
       if (initTemplateResult instanceof Error)
         return errors.push(initTemplateResult.message)
     })
     if(errors.length)
       return new Error(errors.join("\n"))

     if (showMsg)
       console.log(InfoMsgs.SUCCESS_INITIALIZATION)
     else
       console.log(InfoMsgs.SUCCESS_RELOAD)
   }
   catch (err){
     console.log(ErroMsgs.UNEXPECTED_ERROR(err))
   }
  }


  private static initConfigDir(mkdirPath : string) : void{
    if(fs.existsSync(mkdirPath))
     return
    fs.mkdirSync(mkdirPath)
    this.initExempleTemplate()
  }

  private static initTemplate(templateDirInfo : ITemplateDirInfos) : Error | void{
    const configFileResult = TemplateReader.getTemplateConfigFile(templateDirInfo.dirPath)
    if(configFileResult instanceof Error)
      return configFileResult

    const checkingResult = TemplateReader.checkConfigFileProperties(configFileResult)
    if(checkingResult instanceof Error)
      return checkingResult

    TemplateRepo.saveTemplate(configFileResult.template,templateDirInfo.dirPath)
  }

  private static initExempleTemplate(){
    try {
      const configDirPath = path.resolve(nameConfigDir)
      const exampleTemplate : IExampleTemplate =  {
        dirName : `Exemple${keywordExemple}Template`,
        files : [
          {fileName : `My${keywordExemple}Exemple.jsx`,data : ""},
          {fileName : `${nameConfigFile}`,data :
              `
{
  "template" : "exemple",
  "componentWorkDir" :"src/core"
}
              `
          },
          {fileName : `The${keywordExemple}Amazing.css`,data : ""},
          {fileName : `OtherExemple${keywordExemple}.test.ts`,data : ""},
          {fileName : `LastOne${keywordExemple}.php`,data : ""},
        ]}

      fileHandler(
        configDirPath,
        exampleTemplate.dirName,
        exampleTemplate.files
      )
      console.log(InfoMsgs.SUCCESS_EXAMPLE_TEMPLATE_CREATON)
    }catch (err){
      console.log(ErroMsgs.EXAMPLE_TEMPLATE_CREATION_UNEXPECTRED_ERR)
    }

  }

}


export const initializer = new Initializer()