import {ITemplateDirInfos, TemplateReader} from "../TemplateReader";
import {ComponentDispatcher} from "../ComponentDispatcher";
import {ComponentInfosGenerator} from "../ComponentInfosGenerator";

export type ICreateCommand = (templateName:string, replacementName:string) => Promise<void>

export const create : ICreateCommand = async (
  templateName:string,
  replacementName:string)=>
{
  // const CompDispatcher = new ComponentDispatcher()
  const templatesDirsInfosResult = await TemplateReader.getAllTemplateDirInfo()
  if(templatesDirsInfosResult instanceof Error)
    return console.log(templatesDirsInfosResult.message)


  const templateDirInfo = findWantedTemplateInfo(templateName, templatesDirsInfosResult)
  if(templateDirInfo instanceof Error)
    return console.log(templateDirInfo.message)

  const templatesFilesInfos = TemplateReader.getAllTemplateFilesInfo(templateDirInfo)

  const templateReader = new TemplateReader(templateDirInfo, templatesFilesInfos)

  templateReader.
  const CompInfosGeneneratorResult = ComponentInfosGenerator.build(
    templateName,
    replacementName
  )
  if (CompInfosGeneneratorResult instanceof Error)
    return console.log(CompInfosGeneneratorResult.message)


  CompInfosGeneneratorResult.generateComponentInfos("")

  //Save Dispatching

}


function findWantedTemplateInfo(wantedTemplateName : string, dirsInfo : ITemplateDirInfos[]) : Error | ITemplateDirInfos{
  const dirInfoFound =  dirsInfo.find(dirInfo => dirInfo.templateName === wantedTemplateName)
  if(!dirInfoFound)
    return new Error(`Aucune template nommé ${wantedTemplateName} n'as été trouvé`)
  else
    return dirInfoFound

}

const CompDispatcher = new ComponentDispatcher()

const run = async ()=>{

  const dirsInfos = await TemplateReader.getAllTemplateDirInfo()

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
