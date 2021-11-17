import {IComponentReader} from "./ComponentReader";

type Path = string

export interface IComponentDispatcher{
  componentTypes : string[]
  addComponent(compReader:IComponentReader) : Error | void
  getComponentReader(componentName) : Error | IComponentReader
}

export class ComponentDispatcher implements IComponentDispatcher{

  private MapHandlerAndComponent: Map<string, IComponentReader> = new Map()


  addComponent( compReader : IComponentReader ) : Error | void {
    const componentTypeResult = compReader.getComponentType()
    if(componentTypeResult instanceof Error)
      return componentTypeResult
    if(this.MapHandlerAndComponent.has(componentTypeResult))
      return new Error("Ce composant existe deja : Vous avez deux modèles ayant le même nom")

    const componentPaths : string[] = [...this.MapHandlerAndComponent.values()].map(compReader=> compReader.componentWorkDirPath)
    if(componentPaths.includes(compReader.componentWorkDirPath))
      console.log("Attention : Ce répertoire est également utilisé pour un autre composant")

    this.MapHandlerAndComponent.set(componentTypeResult,compReader)

  }

  getComponentReader(componentType) : Error | IComponentReader {
    const compReader = this.MapHandlerAndComponent.get(componentType)
    if(compReader)
      return compReader
    return new Error(`Aucun composant nommé ${componentType} n'as été répertorier !`)
  }

  get componentTypes(){
    return [...this.MapHandlerAndComponent.keys()]
  }

}
