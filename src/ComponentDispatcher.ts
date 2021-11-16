type Path = string
type handler = () => any

export interface IComponentDispatcher{
  addComponent(componentName:string ,path:Path, handler:handler) : string | true
  getPath(componentName) : false | string
  getHandler(componentName) : false | handler
  components : string[]
}

class ComponentDispatcher implements IComponentDispatcher{

  private MapPathAndComponent: Map<string, Path > = new Map()
  private MapHandlerAndComponent: Map<string, handler> = new Map()

  addComponent(componentName , path, handler) : string | true {
    if(this.MapPathAndComponent.has(componentName))
      return "Ce composant existe deja"
    else if([...this.MapPathAndComponent.values()].includes(path))
      return "Ce path est déjà utilisé pour un autre composant"
    else{
      this.MapPathAndComponent.set(componentName,path)
      this.MapHandlerAndComponent.set(componentName,handler)
      return true
    }
  }

  getPath(componentName) : false | string {
    const path = this.MapPathAndComponent.get(componentName)
    return path ? path : false
  }

  getHandler(componentName) : false | handler {
    const handler = this.MapHandlerAndComponent.get(componentName)
    if(handler)
      return handler
    else
      return false
  }

  get components (){
    return [...this.MapPathAndComponent.keys()]
  }

}

export const ComponentDispatcherInstance = new ComponentDispatcher()