import * as fs from "fs";
import {pathGlobalWorkDir} from "./_config";
import {componentFileInfo, createComponent} from "./FilesHandlers/createComponent";
import {ITemplateReader} from "./TemplateReader";

enum CommandTypeEnum {
  create = "create",
  delete = "create"
}


export interface IComponentInfosGenerator {
  replacementName: string
  componentSubdomainPath : string
  // templateName : string
  generateComponentInfos(templateReader : ITemplateReader) : IComponentInformations | Error
}

export interface IComponentInformations {
  componentDirPath : string
  componentDirName : string
  componentFiles : componentFileInfo[]
}

export class ComponentInfosGenerator implements IComponentInfosGenerator{


  private constructor(
    public componentSubdomainPath : string,
    public replacementName : string,
    // public templateName : string,
  ) {}

  generateComponentInfos(CompReader : ITemplateReader) : IComponentInformations | Error {
    const componentDirPath = `${this.componentSubdomainPath}/${CompReader.componentWorkDirPath}`
    const componentDirNameResult = CompReader.createComponentDirName(this.replacementName)
    const componentFilesResult = CompReader.createComponentFilesNames(this.replacementName)

    if(componentDirNameResult instanceof Error)
      return new Error(componentDirNameResult.message)
    else if(componentFilesResult instanceof Error)
      return new Error(componentFilesResult.message)

    const componentFilesInfos : componentFileInfo[] = componentFilesResult.map(componentFile => ({fileName :componentFile,data : ""}))

    return <IComponentInformations>{
      componentDirName: componentDirNameResult,
      componentDirPath,
      componentFiles: componentFilesInfos
    }

  }

  static build(argTemplateName:string, argReplacementName:string, optSubDomainName? : string) : IComponentInfosGenerator | Error {

    const checkTemplateNameResult = this.checkModelName(argTemplateName)
    const checkReplacementNameResult = this.checkReplacementName(argReplacementName)

    const componantSubdomainPathResult = this.getComponentSubDomainPath(optSubDomainName)

    if(checkTemplateNameResult instanceof Error)
      return checkTemplateNameResult
    else if(checkReplacementNameResult instanceof Error)
      return checkReplacementNameResult

    if(componantSubdomainPathResult instanceof Error)
      return componantSubdomainPathResult

    return new ComponentInfosGenerator(componantSubdomainPathResult,argReplacementName)
  }



  private static checkReplacementName(replacementName: string) : void | Error {
    if(replacementName === "")
      return new Error("Vous devez fournir le nom du composant a créer (ex: 'Guitare') ")
  }


  private static checkModelName(argTemplateName: string) :  void | Error {
    const templateNames : string[] = [] //Get from persistance
    if(argTemplateName === "")
      return new Error("Vous devez fournir le type de composant a créer (ex: 'entity')")
    else if(!templateNames.includes(argTemplateName))
      return new Error("Le composant que vous souhaitez créer n'existe pas")
  }

  private static getComponentSubDomainPath(subDomainName? : string) : string | Error {
    if(subDomainName){
      const subDomainPath = `${pathGlobalWorkDir}/${subDomainName}`
      if(fs.existsSync(subDomainPath))
        return subDomainPath
      else
        return new Error(`Le sous-domaine "${subDomainName}" n'existe pas dans : \n ${subDomainPath}`)
    }
    else{
      if(fs.existsSync(pathGlobalWorkDir))
        return pathGlobalWorkDir
      else
        return  new Error(`Le domaine "${pathGlobalWorkDir}" n'existe pas`)
    }
  }

}