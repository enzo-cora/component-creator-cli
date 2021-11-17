import {TemplateReader} from "../TemplateReader";
import {ComponentDispatcher} from "../ComponentDispatcher";
import {ComponentInfosGenerator} from "../ComponentInfosGenerator";

export type IInitCommand = () => Promise<void>

export const initialize : IInitCommand = async ()=> {


  //Save Dispatching

}



const CompDispatcher = new ComponentDispatcher()

const run = async ()=>{

  const dirsInfos = await TemplateReader.getTemplatesDirsInfos()

  for(const dirInfo of dirsInfos){
    const CompReader = new TemplateReader(dirInfo)
    const addResult = CompDispatcher.addComponent(CompReader)
    if(addResult instanceof Error)
      return Promise.reject(addResult.message)
  }

  const CLIResult = ComponentInfosGenerator.build(CompDispatcher)
  if(CLIResult instanceof Error)
    return Promise.reject(CLIResult.message)


  const componentType = CLIResult.templateName
  const compReaderResult = CompDispatcher.getComponentReader(componentType)
  if(compReaderResult instanceof Error)
    return Promise.reject(compReaderResult.message)

  const executionResult = CLIResult.generateComponentInfos(compReaderResult)
  if (executionResult instanceof Error)
    return Promise.reject(executionResult.message)

}

run()
  .then(()=> console.log("Le composant à été créer avec succès"))
  .catch(err=> {
    console.log(err)
  })
