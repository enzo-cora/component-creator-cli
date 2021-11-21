import * as fs from "fs";
import {
  edging,
} from "./_constantes/config";

import path from "path";
import {ITemplateReader} from "./_definitions/ITemplateReader";
import {IComponentFileInfo, ITemplateExtractor} from "./_definitions/ITemplateExtractor";
import {ErroMsgs} from "./_constantes/ErroMsgs";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";
import {NamingConvention} from "./_constantes/NamingConvention";

type compWrkDir = ITemplateConfigFile['componentWorkDir']





export class TemplateExtractor implements ITemplateExtractor{


  private readonly genericRegex : RegExp
  constructor(
    public templateReader:ITemplateReader,
    public replaceVal : string,
    public subdomain? : string
  ) {
    this.genericRegex = new RegExp( `\\${edging}${NamingConvention.raw}\\${edging}`,"g")
  }


  getComponentDirName(generic? : NamingConvention) : string {
    const genericDirName = this.templateReader.templateDirName
    return genericDirName.replace(this.genericRegex, this.replaceVal)
  }

  async getComponentFiles() : Promise<IComponentFileInfo[] | Error> {
    const filesResult = await this.templateReader.getTemplateFiles()
    if (filesResult instanceof Error)
      return filesResult

    return filesResult.map(templateFileInfo =>({
      fileName : templateFileInfo.fileName.replace(this.genericRegex, this.replaceVal),
      data : templateFileInfo.fileData.replace(this.genericRegex, this.replaceVal)
    }))
  }


  getComponentWrkDirPath (componentWrkDir : compWrkDir) : string | Error {

    let compWrkDirPath : string
    if(typeof componentWrkDir === "string"){
      compWrkDirPath = path.resolve( componentWrkDir)
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErroMsgs.COMPONENT_WRK_DIR_NOT_EXISTE(compWrkDirPath))
      return compWrkDirPath
    }

    const {rootWorkDir,extensionWorkDir} = componentWrkDir

    const rootWrkDirPath = path.resolve( rootWorkDir)
    if(!fs.existsSync(rootWrkDirPath))
      return new Error(ErroMsgs.ROOT_WRK_DIR_NOT_EXISTE(rootWorkDir))

    let subdomainPath
    if(this.subdomain){
      subdomainPath = `${rootWrkDirPath}/${this.subdomain}`
      if(!fs.existsSync(subdomainPath))
        return new Error(ErroMsgs.SUBDOMAIN_PATH_NOT_EXISTE(this.subdomain, path.relative(path.resolve(),rootWrkDirPath)))
      compWrkDirPath = `${subdomainPath}/${this.subdomain}/${extensionWorkDir}`
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErroMsgs.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
      return compWrkDirPath
    }

    compWrkDirPath = `${rootWrkDirPath}/${extensionWorkDir}`
    if(!fs.existsSync(compWrkDirPath))
      return new Error(ErroMsgs.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
    return compWrkDirPath
  }



}