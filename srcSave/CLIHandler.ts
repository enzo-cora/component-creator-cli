import * as fs from "fs";
import {IComponentDispatcher} from "./ComponentDispatcher";
import {argPosition, pathGlobalWorkDir} from "./_config";
import {createComponent, FileCreation} from "./createComponent";
import {IComponentReader} from "./ComponentReader";

enum CommandTypeEnum {
  create = "create",
  delete = "create"
}


export interface IGenerator {
  cmd : CommandTypeEnum
  replacementName: string
  componentSubdomainPath : string
  componentType : string
  execute(compReader : IComponentReader) : void | Error
}

export class CLIHandler implements IGenerator{


  private constructor(
    public cmd : CommandTypeEnum,
    public componentSubdomainPath : string,
    public replacementName : string,
    public componentType : string,
  ) {}

  execute(CompReader : IComponentReader) : void | Error {
    const finalComponentDirPath = `${this.componentSubdomainPath}/${CompReader.componentWorkDirPath}`
    const transformedDirName = CompReader.getTransformedDirName(this.replacementName)
    const transformedFilesResult = CompReader.getTransformedFilesNames(this.replacementName)

    if(transformedDirName instanceof Error)
      return new Error(transformedDirName.message)
    else if(transformedFilesResult instanceof Error)
      return new Error(transformedFilesResult.message)

    const fileCreations : FileCreation[] = transformedFilesResult.map(file => ({fileName :file,data : ""}))
    switch (this.cmd){
      case CommandTypeEnum.create :
        const createCompResult = createComponent(
          finalComponentDirPath,
          transformedDirName,
          fileCreations
        )
        if(createCompResult instanceof Error)
          return createCompResult
        break
    }
  }

  static build(componentTypes : string[]) : IGenerator | Error {
    const argLenght = process.argv.length
    const index = (i)=> argLenght === 6 ? i+1 : i

    if(argLenght <= 4 || argLenght >= 7)
      return new Error(`Le nombre d'arguments fournis est incorrect ! Vous devez fournir 3 ou 4 arguments \n
        1) subdomain : (ex: marketing,...) (facultatif) \n 
        2) componentType (ex: entity,usecase,...)\n
        3) command : (ex: create,delete,...)\n
        4) componentName : (ex: Facture,...)\n
      `)

    const cmdResult = this.getCommand(index(argPosition.cmd))
    const componentTypeResult = this.getComponentType(
      index(argPosition.componentType),
      componentTypes
    )
    const componantSubdomainPathResult = this.getComponentSubDomainPath(argLenght)
    const componentNameResult = this.getReplacementName(index(argPosition.componentName))

    if(cmdResult instanceof Error)
      return cmdResult
    else if(componentTypeResult instanceof Error)
      return componentTypeResult
    else if(componantSubdomainPathResult instanceof Error)
      return componantSubdomainPathResult
    else if(componentNameResult instanceof Error)
      return componentNameResult
    else
      return new CLIHandler(cmdResult,componantSubdomainPathResult,componentNameResult,componentTypeResult)
  }



  static getReplacementName(argPosition: number) : string | Error {
    const componentName = process.argv[argPosition] as any
    if(componentName === "")
      return new Error("Vous devez fournir le nom du composant a créer (ex: 'Guitare') ")

    return componentName
  }

  static getCommand(argPosition:number) : CommandTypeEnum | Error {
    const command = process.argv[argPosition] as any
    if(command === "")
      return new Error("Vous devez fournir le type de commande a executer (ex: 'create') ")
    else if(!Object.values(CommandTypeEnum).includes(command))
      return new Error("La commande que vous souhaitez executer n'existe pas")
    else
      return command
  }


  static getComponentType(argPosition: number, componentTypes : string[]) :  string | Error {
    const argCompomentType = process.argv[argPosition] as any
    if(argCompomentType === "")
      return new Error("Vous devez fournir le type de composant a créer (ex: 'entity')")
    else if(!componentTypes.includes(argCompomentType))
      return new Error("Le composant que vous souhaitez créer n'existe pas")
    else
      return argCompomentType
  }

  static getComponentSubDomainPath(argLenght) : string | Error {

    if(argLenght ===  6){
      const subDomainName = process.argv[2]
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