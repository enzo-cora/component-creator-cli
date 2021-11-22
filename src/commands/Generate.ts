import {TemplateReader} from "../TemplateReader";
import {TemplateExtractor} from "../TemplateExtractor";
import {fileHandler} from "../FileHandler";
import {TemplateRepo} from "../TemplateRepository";
import {ITemplateReader} from "../_definitions/ITemplateReader";
import {InfoMsgs} from "../_constantes/InfoMsgs";

export type ICreateCommand = (templateName:string, replaceValue:string, opts?: any) => Promise<void>
export interface ICreateCommandOptions {
  subdomain? : string
}
export const generate : ICreateCommand = async (
  templateName:string,
  replaceValue:string,
  opts: ICreateCommandOptions
)=>
{
  const tempMetaDataResult = await TemplateRepo.getOneMetadata(templateName)

  if(tempMetaDataResult instanceof Error)
    return console.log(tempMetaDataResult.message)


  let templateReader : ITemplateReader  = new TemplateReader(
    templateName,
    tempMetaDataResult.path,
  )

  const componentInfos = new TemplateExtractor(
    templateReader,
    replaceValue,
    opts?.subdomain
  )

  const componentWrkPathResult = componentInfos.getComponentWrkDirPath(tempMetaDataResult.configFile.componentWorkDir)
  if (componentWrkPathResult instanceof Error)
    return console.log(componentWrkPathResult.message)



  const componentFilesResult = await componentInfos.getComponentFiles(componentWrkPathResult)
  if(componentFilesResult instanceof Error)
    return console.log(componentFilesResult.message)

  const componentDirName = componentInfos.getComponentDirName()

  const componentCreation =  await fileHandler(
    componentWrkPathResult,
    componentDirName,
    componentFilesResult,
  )

  if(componentCreation instanceof Error)
    return console.log(componentCreation.message)
  else
    console.log(componentCreation)

  console.log(InfoMsgs.SUCCESS_COMPONENT_CREATON)
}


