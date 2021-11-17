import {ComponentReader} from "../ComponentReader";
import {ComponentDispatcher} from "../ComponentDispatcher";
import {CLIHandler} from "../CLIHandler";

export type IInitCommand = () => Promise<void>

export const initCommand : IInitCommand = async ()=> {
  const CompDispatcher = new ComponentDispatcher()
  const dirsInfos = await ComponentReader.getAllRawDirsInfos()

  if(dirsInfos instanceof Error)
    console.log(dirsInfos.message)

  for(const dirInfo of dirsInfos){
    const CompReader = new ComponentReader(dirInfo)
    const addComponentResult = CompDispatcher.addComponent(CompReader)
    if(addComponentResult instanceof Error)
      console.log(addComponentResult.message)
  }

  //Save Dispatching

}



const CompDispatcher = new ComponentDispatcher()

const run = async ()=>{

  const dirsInfos = await ComponentReader.getAllRawDirsInfos()

  for(const dirInfo of dirsInfos){
    const CompReader = new ComponentReader(dirInfo)
    const addResult = CompDispatcher.addComponent(CompReader)
    if(addResult instanceof Error)
      return Promise.reject(addResult.message)
  }

  const CLIResult = CLIHandler.build(CompDispatcher)
  if(CLIResult instanceof Error)
    return Promise.reject(CLIResult.message)


  const componentType = CLIResult.componentType
  const compReaderResult = CompDispatcher.getComponentReader(componentType)
  if(compReaderResult instanceof Error)
    return Promise.reject(compReaderResult.message)

  const executionResult = CLIResult.execute(compReaderResult)
  if (executionResult instanceof Error)
    return Promise.reject(executionResult.message)

}

run()
  .then(()=> console.log("Le composant à été créer avec succès"))
  .catch(err=> {
    console.log(err)
  })
