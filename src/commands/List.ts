import Table from "cli-table";
import {TemplateRepo} from "../TemplateRepository";
import {cSuccess} from "../_constantes/config";
import chalk from "chalk";
import {InfoMsgs} from "../_constantes/InfoMsgs";


export type IListCommand = () => Promise<void>
type ITableContent = Array<[TemplateName:string, WorkDire:string, ExentionWrkDir:string]>


export const list : IListCommand = async ()=>
{
  const tempMetaDataResult = await TemplateRepo.getAllMetadata()
  if(tempMetaDataResult instanceof Error)
    return console.log(tempMetaDataResult.message)

  if(tempMetaDataResult.length === 0){
    const table = new Table({ colAligns : ["middle"]})
    table.push([InfoMsgs.NO_TEMPLATE])
    return console.log(table.toString())
  }

  const table   : ITableContent = new Table({
    colAligns: ["middle","middle","middle"],
  })

  tempMetaDataResult.forEach(
    ({configFile}) => {
      const tempName :string = configFile.template
      let wrkDirectory :string
      let extensionDirectory :string = "none"
      if(typeof configFile.componentWorkDir === "string")
        wrkDirectory = configFile.componentWorkDir
      else{
        wrkDirectory = configFile.componentWorkDir.rootWorkDir
        if(configFile.componentWorkDir.extensionWorkDir)
          extensionDirectory = configFile.componentWorkDir.extensionWorkDir
      }

      table.push([chalk.blue(tempName),cSuccess(wrkDirectory),cSuccess(extensionDirectory)])
    })

  table.unshift(    ["Name","Working Directory","Extension Working Directory"])
  return console.log(table.toString())

}


