import {TemplateReader} from "../TemplateReader";
import {TemplateExtractor} from "../TemplateExtractor";
import {fileHandler} from "../FileHandler";
import {TemplateRepo} from "../TemplateRepository";
import {ITemplateReader} from "../_definitions/ITemplateReader";

export type ICreateCommand = (templateName:string, replaceValue:string, opts?: any) => Promise<void>
export interface ICreateCommandOptions {
  subdomain? : string
}
export const create : ICreateCommand = async (
  templateName:string,
  replaceValue:string,
  opts: ICreateCommandOptions
)=>
{
  const TempMetaDataResult = await TemplateRepo.getMetadata(templateName)

  if(TempMetaDataResult instanceof Error)
    return console.log(TempMetaDataResult.message)


  let templateReader : ITemplateReader  = new TemplateReader(
    templateName,
    TempMetaDataResult.path,
  )

  const componentInfos = new TemplateExtractor(
    templateReader,
    replaceValue,
    opts?.subdomain
  )

  const componentWrkPathResult = componentInfos.getComponentWrkDirPath(TempMetaDataResult.configFile.componentWorkDir)
  if (componentWrkPathResult instanceof Error)
    return console.log(componentWrkPathResult.message)

  const componentFilesResult = await componentInfos.getComponentFiles()
  if(componentFilesResult instanceof Error)
    return console.log(componentFilesResult.message)

  const componentDirName = componentInfos.getComponentDirName()
  const componentCreation =  await fileHandler(
    componentWrkPathResult,
    componentDirName,
    componentFilesResult,
  )

  if(componentCreation instanceof Error)
    return console.log('salluts',componentCreation.message)
  else
    console.log(componentCreation)

  console.log("Le composant à été créer avec succès")
}


