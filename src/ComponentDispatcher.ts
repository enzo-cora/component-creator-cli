/*
import {ITemplateReader} from "./TemplateReader";

type Path = string

export interface IComponentDispatcher{
  componentTypes : string[]
  addComponent(compReader:ITemplateReader) : Error | void
  getComponentReader(componentName) : Error | ITemplateReader
}

export class ComponentDispatcher implements IComponentDispatcher{

  private MapHandlerAndComponent: Map<string, ITemplateReader> = new Map()

  addComponent( compReader : ITemplateReader ) : Error | void {
    const componentTypeResult = compReader.getTemplateName()
    if(componentTypeResult instanceof Error)
      return componentTypeResult
    if(this.MapHandlerAndComponent.has(componentTypeResult))
      return new Error("Un problème est survenu car vous avez deux modèles ayant le même nom ! ")

    const componentPaths : string[] = [...this.MapHandlerAndComponent.values()].map(compReader=> compReader.componentWorkDirPath)
    if(componentPaths.includes(compReader.componentWorkDirPath))
      console.log("Attention : Ce répertoire est également utilisé pour un autre composant")

    this.MapHandlerAndComponent.set(componentTypeResult,compReader)

  }

  getComponentReader(componentType) : Error | ITemplateReader {
    const compReader = this.MapHandlerAndComponent.get(componentType)
    if(compReader)
      return compReader
    return new Error(`Aucun composant nommé ${componentType} n'as été répertorier !`)
  }

  get componentTypes(){
    return [...this.MapHandlerAndComponent.keys()]
  }

}
*/
