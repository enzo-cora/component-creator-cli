import {createComponent} from "./component";
import {getSrcDir} from "./getSrcDir";
import * as fs from "fs";
import {wrkDir} from "./config";
import {ComponentDispatcherInstance, IComponentDispatcher} from "./ComponentDispatcher";

enum CommandTypeEnum {
  create = "create",
  delete = "create"
}


interface IGenerator {
  subDomainPath : string
  cmd : string
  componentName: string
  componentType : string
  execute() : void
}

const argPosition = {
  subdomain:2,
  componentType: 2,
  cmd: 3,
  componentName:4
}

export class Generator implements IGenerator{


  private constructor(
    public subDomainPath : string,
    public cmd : string,
    public componentName : string,
    public componentType : string,
  ) {}

  execute()  {
    switch (this.cmd){
      case CommandTypeEnum.create : createComponent(
        this.subDomainPath,
        this.componentName,
        this.componentType
      ).then()
    }
  }

  static async build( componentDispatcher : IComponentDispatcher) : Promise<IGenerator> {
    const argLenght = process.argv.length
    const index = (i)=> argLenght === 6 ? i+1 : i

    if(argLenght <= 4 || argLenght >= 7)
      return Promise.reject(`Le nombre d'arguments fournis est incorrect ! Vous devez fournir 3 ou 4 arguments \n
        1) subdomain : (ex: marketing,...) (facultatif) \n 
        2) componentType (ex: entity,usecase,...)\n
        3) command : (ex: create,delete,...)\n
        4) componentName : (ex: Facture,...)\n
      `)

    const componentType = await this.getComponentType(
      index(argPosition.componentType),
      componentDispatcher.components
      )
    const domainPath = await this.getDomainPath(argLenght)
    const cmd = await this.getCommand(index(argPosition.cmd))
    const componentName = await this.getComponentName(index(argPosition.componentName))

    return new Generator(domainPath, cmd,componentName,componentType)
  }



  static async getComponentName(index) : Promise<string> {
    const componentName = process.argv[index] as any
    if(componentName === ""){
      return Promise.reject("Vous devez fournir le nom du composant a créer (ex: 'Guitare') ")
    }
    else
      return componentName
  }

  static async getCommand(index) : Promise<CommandTypeEnum> {
    const command = process.argv[index] as any
    if(command === ""){
      return Promise.reject("Vous devez fournir le type de commande a executer (ex: 'create') ")
    }
    if(!Object.values(CommandTypeEnum).includes(command)){
      return Promise.reject("La commande que vous souhaitez executer n'existe pas")
    }
    else
      return command
  }


  static async getComponentType(index, componentTypes : string[]) : Promise<string> {
    const compomentType = process.argv[index] as any
    if(compomentType === ""){
      return Promise.reject("Vous devez fournir le type de composant a créer (ex: 'entity')")
    }
    else if(!Object.values(componentTypes).includes(compomentType)){
      return Promise.reject("Le composant que vous souhaitez créer n'existe pas")
    }
    else
      return compomentType

  }

  static async getDomainPath(argLenght) : Promise<string>  {
    const srcDir = await getSrcDir()

    if(argLenght ===  6){
      const subDomainName = process.argv[2]
      const domainPath = `${srcDir}/${wrkDir}/${subDomainName}`
      if(fs.existsSync(domainPath))
        return domainPath
      else
        return Promise.reject(`Le sous-domaine "${subDomainName}" n'existe pas dans ~/${wrkDir}/${subDomainName}`)
    }
    else{
      const domainPath = `${srcDir}/${wrkDir}`
      if(fs.existsSync(domainPath))
        return domainPath
      else
        return  Promise.reject(`Le domaine "${wrkDir}" n'existe pas`)
    }



  }



}

Generator.build(ComponentDispatcherInstance)
  .then(generator=>generator.execute())
  .catch(err=> {
    console.log(`Une erreur est survenue: `,err)
  })