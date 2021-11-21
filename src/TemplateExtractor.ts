import * as fs from "fs";
import {
  genericKeyword,
} from "./_config";

import path from "path";
import {ITemplateReader} from "./_definitions/ITemplateReader";
import {IComponentFileInfo, ITemplateExtractor} from "./_definitions/ITemplateExtractor";
import {ErrorList} from "./ErrorList";
import {ITemplateConfigFile} from "./_definitions/ITemplateConfigFile";

type compWrkDir = ITemplateConfigFile['componentWorkDir']

export class TemplateExtractor implements ITemplateExtractor{


  constructor(
    public templateReader:ITemplateReader,
    public replaceVal : string,
    public subdomain? : string
  ) {}


  getComponentDirName() : string {
    const genericDirName = this.templateReader.templateDirName
    return genericDirName.replace(genericKeyword, this.replaceVal)
  }

  async getComponentFiles() : Promise<IComponentFileInfo[] | Error> {
    const filesResult = await this.templateReader.getTemplateFiles()
    if (filesResult instanceof Error)
      return filesResult

    return filesResult.map(templateFileInfo =>({
      fileName : templateFileInfo.fileName.replace(genericKeyword, this.replaceVal),
      data : ""
    }))
  }


  getComponentWrkDirPath (componentWrkDir : compWrkDir) : string | Error {

    let compWrkDirPath : string
    if(typeof componentWrkDir === "string"){
      compWrkDirPath = path.resolve( componentWrkDir)
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErrorList.COMPONENT_WRK_DIR_NOT_EXISTE(compWrkDirPath))
      return compWrkDirPath
    }

    const {rootWorkDir,extensionWorkDir} = componentWrkDir

    const rootWrkDirPath = path.resolve( rootWorkDir)
    if(!fs.existsSync(rootWrkDirPath))
      return new Error(ErrorList.ROOT_WRK_DIR_NOT_EXISTE(rootWorkDir))

    let subdomainPath
    if(this.subdomain){
      subdomainPath = `${rootWrkDirPath}/${this.subdomain}`
      if(!fs.existsSync(subdomainPath))
        return new Error(ErrorList.SUBDOMAIN_PATH_NOT_EXISTE(this.subdomain, path.relative(path.resolve(),rootWrkDirPath)))
      compWrkDirPath = `${subdomainPath}/${this.subdomain}/${extensionWorkDir}`
      if(!fs.existsSync(compWrkDirPath))
        return new Error(ErrorList.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
      return compWrkDirPath
    }

    compWrkDirPath = `${rootWrkDirPath}/${extensionWorkDir}`
    if(!fs.existsSync(compWrkDirPath))
      return new Error(ErrorList.EXTENTION_WRK_DIR_NOT_EXISTE(extensionWorkDir, path.relative(path.resolve(),subdomainPath)))
    return compWrkDirPath
  }



}