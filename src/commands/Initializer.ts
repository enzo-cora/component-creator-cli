import fs from "fs";
import {cWarning, keywordExemple, nameConfigDir, nameConfigFile} from "../_constantes/config";
import path from "path";
import {readdir} from "fs/promises";
import {ITemplateDirInfos} from "../_definitions/ITemplateReader";
import {IInitializer} from "../_definitions/IInitializer";
import {TemplateReader} from "../TemplateReader";
import {TemplateRepo as store} from "../TemplateRepository";
import {IComponentFileInfo} from "../_definitions/ITemplateExtractor";
import {fileHandler} from "../FileHandler";
import {ErroMsgs} from "../_constantes/ErroMsgs";
import {InfoMsgs} from "../_constantes/InfoMsgs";

type IExampleTemplate = {
  dirName : string,
  files : IComponentFileInfo[]
}

export class Initializer implements IInitializer {

  private static _initTemplate(tempDirPath : string) : Error | string {
    const configFileResult = TemplateReader.getTemplateConfigFile(tempDirPath)
    if(configFileResult instanceof Error)
      return configFileResult

    const checkingResult = TemplateReader.checkConfigFileProperties(configFileResult)
    if(checkingResult instanceof Error)
      return checkingResult

    store.saveTemplate(configFileResult.template,tempDirPath)
    return configFileResult.template
  }

  private static async initExempleTemplate(){
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

      await fileHandler(
        configDirPath,
        exampleTemplate.dirName,
        exampleTemplate.files
      )
      console.log(InfoMsgs.SUCCESS_EXAMPLE_TEMPLATE_CREATON)
    }catch (err){
      console.log(ErroMsgs.EXAMPLE_TEMPLATE_CREATION_UNEXPECTRED_ERR)
    }

  }

  constructor(
    private successMessage : string,
    private mkdirConfigDir : boolean = false
  ) {
  }

  async execute() : Promise<Error | void> {
   try {
     const configDirPath = path.resolve(nameConfigDir)
     const initConfigDirResult = await this.initConfigDir(configDirPath)
     if(initConfigDirResult instanceof Error)
       return initConfigDirResult
     const configDirData = await readdir(configDirPath,{ withFileTypes: true })

     const templates : ITemplateDirInfos[] = configDirData
       .filter(dirent => dirent.isDirectory())
       .map(temp=> ({dirName :temp.name, dirPath: `${configDirPath}/${temp.name}`}))

     store.clear()
     const initTempaltesResult  = this._initTemplates(templates)

     if(initTempaltesResult instanceof Error)
       return initTempaltesResult

     console.log(this.successMessage)

   }
   catch (err){
     console.log(ErroMsgs.UNEXPECTED_ERROR("l'initialisation",err))
   }
  }

  private _initTemplates(templates:ITemplateDirInfos[]) : Error | void {
    const errorsMessages : string[] = []

    const dupliErrors : Record<string, Set<string>> = {}
    const initializedTemplates:Map<string,string>  = new Map()

    templates.forEach(tempDirInfo => {
      const currTempDirPath = tempDirInfo.dirPath
      const initTempResult = Initializer._initTemplate(currTempDirPath)
      if (initTempResult instanceof Error)
        return errorsMessages.push(initTempResult.message)

      if(initializedTemplates.has(initTempResult)){
        if(!(initTempResult in dupliErrors) )
          dupliErrors[initTempResult] = new Set()
        const firstInitializedPath = initializedTemplates.get(initTempResult) as string
        dupliErrors[initTempResult].add(firstInitializedPath)
        dupliErrors[initTempResult].add(currTempDirPath)
      }
      initializedTemplates.set(initTempResult, currTempDirPath)
    })

    if(Object.keys(dupliErrors).length)
      for(const tempName in dupliErrors){
        const paths = [...dupliErrors[tempName].values()]
        errorsMessages.push(ErroMsgs.DUPLICATE_TEMPLATE_NAME(tempName,paths))
      }

    if(errorsMessages.length)
      return new Error(`\n${cWarning("Des erreurs se sont produites pendant l'initialisation des templates:")}\n\n-${ errorsMessages.join("\n-")}`)

  }

  private async initConfigDir(mkdirPath : string) : Promise< true | Error>{
    if(fs.existsSync(mkdirPath))
     return true

    else if(this.mkdirConfigDir){
      fs.mkdirSync(mkdirPath)
      await Initializer.initExempleTemplate()
      return true
    }
    return new Error(ErroMsgs.CONFIG_DIR_MISS)
  }



}
