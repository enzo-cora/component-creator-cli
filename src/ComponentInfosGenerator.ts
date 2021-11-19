import * as fs from "fs";
import {
  ERR_TEMPLATE_DIR_NAME_PART2, JsonGlobalConfigFile,
  keywordReplacement,
  regexDirectory
} from "./_config";
import {ITemplateFileInfo, ITemplateReader} from "./TemplateReader";
import path from "path";


export interface IComponentFileInfo {
  fileName : string,
  data : string
}


export interface IComponentInfosGenerator {
  componentDirName : string
  componentFiles : IComponentFileInfo[]
  componentMkdirPath : string
}


export class ComponentInfosGenerator implements IComponentInfosGenerator{


  private constructor(
    public componentDirName : string,
    public componentMkdirPath : string,
    public componentFiles : IComponentFileInfo[]
  ) {}


  static build(templateInfos:ITemplateReader, argReplaceValue:string, optSubDomainName? : string) : IComponentInfosGenerator | Error {

    const checkReplaceValue = this.checkReplaceValue(argReplaceValue)
    if(checkReplaceValue instanceof Error)
      return checkReplaceValue

    const compomentDirNameResult = this.createComponentDirName(templateInfos.templateDirInfo.dirName, argReplaceValue)
    if(compomentDirNameResult instanceof Error)
      return compomentDirNameResult

    const absolutePathcomponantWorkDirResult = this.getComponentWorkDirPath(
      templateInfos.templateConfigFile?.componentWorkDirectory,
      optSubDomainName
    )

    if(absolutePathcomponantWorkDirResult instanceof Error)
      return absolutePathcomponantWorkDirResult

    const componentMkdirPath = `${absolutePathcomponantWorkDirResult}/${compomentDirNameResult}`

    const componentFilesInfoResult = this.createComponentFilesInfo(templateInfos.templateFilesInfo,argReplaceValue)
    if(componentFilesInfoResult instanceof Error)
      return componentFilesInfoResult


    return new ComponentInfosGenerator(
      compomentDirNameResult,
      componentMkdirPath,
      componentFilesInfoResult
    )
  }



  private static checkReplaceValue(replaceValue: string) : void | Error {
    if(replaceValue === "")
      return new Error("Vous devez fournir le nom du composant a créer (ex: 'Guitare') ")
  }

  private static getComponentWorkDirPath(
    compWrkDirRelativePath?:string,
    subDomainName?:string) : string | Error
  {

    const domainRelativePath = JsonGlobalConfigFile.domainWorkDirectory
    const domainAbsolutePath = path.resolve(domainRelativePath)
    if(!fs.existsSync(domainAbsolutePath))
      return new Error(`Le domaine "${domainRelativePath}" n'existe pas dans votre projet :\n "${path.resolve()}"`)

    let componentWrkDirAbsolutePath, subDomainAbsolutePath

    if(subDomainName){
      subDomainAbsolutePath = `${domainRelativePath}/${subDomainName}`
      if(!fs.existsSync(subDomainAbsolutePath))
        return new Error(`Le sous-domaine "${subDomainName}" n'existe pas dans : \n ${path.relative(path.resolve(),domainAbsolutePath)}`)
    }

    if(subDomainName && compWrkDirRelativePath){
      componentWrkDirAbsolutePath = `${subDomainAbsolutePath}/${compWrkDirRelativePath}`
      if(!fs.existsSync(componentWrkDirAbsolutePath))
        return new Error(`Le répertoire de travail "${compWrkDirRelativePath}" n'existe pas dans : \n  ${path.relative(path.resolve(),subDomainAbsolutePath)}`)
    }
    else if(!subDomainName && compWrkDirRelativePath){
      componentWrkDirAbsolutePath = `${domainAbsolutePath}/${compWrkDirRelativePath}`
      if(!fs.existsSync(componentWrkDirAbsolutePath))
        return new Error(`Le répertoire de travail "${compWrkDirRelativePath}" n'existe pas dans : \n  ${path.relative(path.resolve(),domainAbsolutePath)}`)
    }
    else
      componentWrkDirAbsolutePath = domainAbsolutePath

    return componentWrkDirAbsolutePath

  }

  private static createComponentDirName(templateDirName:string, replaceValue : string) : string | Error {
    const templateDirNameParted = regexDirectory.exec(templateDirName)
    if(!templateDirNameParted || !templateDirNameParted[2])
      return new Error(`Problème sur le template ${templateDirName} : ${ERR_TEMPLATE_DIR_NAME_PART2}`)

    return templateDirNameParted[2].replace(keywordReplacement, replaceValue)
  }


  private static createComponentFilesInfo (templateFilesInfos:ITemplateFileInfo[],replaceValue:string):  IComponentFileInfo[] | Error {
    return templateFilesInfos.map(templateFileInfo =>({
      fileName : templateFileInfo.fileName.replace(keywordReplacement, replaceValue),
      data : ""
    }))
  }

}