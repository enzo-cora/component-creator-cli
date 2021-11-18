import {TemplateReader} from "../TemplateReader";
import {ComponentInfosGenerator} from "../ComponentInfosGenerator";
import {createComponent} from "../FilesHandlers/createComponent";

export type ICreateCommand = (templateName:string, replaceValue:string, opts?: any) => Promise<void>

export const create : ICreateCommand = async (
  templateName:string,
  replaceValue:string,
  opts: any
)=>
{
  const templateInfos  = await TemplateReader.build(templateName)
  if(templateInfos instanceof Error)
    return console.log(templateInfos.message)


  const componentInformations = ComponentInfosGenerator.build(
    templateInfos,
    replaceValue
  )

  if (componentInformations instanceof Error)
    return console.log(componentInformations.message)


  const componentCreation = createComponent(
    componentInformations.componentMkdirPath,
    componentInformations.componentDirName,
    componentInformations.componentFiles,
  )

  if(componentCreation instanceof Error)
    return console.log(componentCreation.message)

  console.log("Le composant à été créer avec succès")
}