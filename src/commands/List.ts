import {TemplateRepo} from "../TemplateRepository";
import {cInfo, cSuccess} from "../_constantes/config";
import {getBorderCharacters, table} from "table";
import chalk from "chalk";
import {InfoMsgs} from "../_constantes/InfoMsgs";


export type IListCommand = () => Promise<void>
type ITableContent = Array<[TemplateName:string, WorkDire:string, ExentionWrkDir:string]>

const config : any = {
  drawHorizontalLine: (lineIndex,rowCount) => {
    return lineIndex  ===  0  ||  lineIndex  ===  1  ||   lineIndex  ===  rowCount ;
  },
  columns: [
    { alignment: 'center' },
    { alignment: 'center' },
    { alignment: 'center' },
  ],
  border: getBorderCharacters("norc")
};

export const list : IListCommand = async ()=>
{
  const tempMetaDataResult = await TemplateRepo.getAllMetadata()
  if(tempMetaDataResult instanceof Error)
    return console.log(tempMetaDataResult.message)

  const datTable   : ITableContent = tempMetaDataResult.map(
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

    return [chalk.bold(tempName),cSuccess(wrkDirectory),cSuccess(extensionDirectory)]
  })

  datTable.unshift(["Name","Working Directory","Extension Working Directory"])


  if(datTable.length > 1){
    const formatedTable = table(datTable, config)
    console.log(formatedTable)
  }
  else
    console.log(table([[InfoMsgs.NO_TEMPLATE]]))


}


