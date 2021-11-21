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
type regExpInfo = {regex : RegExp, convention: NamingConvention}

const regexWordThatContainSubstring = (generic)=> new RegExp(`"\b\w*\\${edging}${generic}\\${edging}\w*\b"`,"g")



export class TemplateExtractor implements ITemplateExtractor{

  constructor(
    public templateReader:ITemplateReader,
    public replaceVal : string,
    public subdomain? : string
  ) {
  }


  getComponentDirName() : string {
    const templateDirName = this.templateReader.templateDirName
    const convDirName = this._getConvention(templateDirName)
    const tempDirName = convDirName ?
      templateDirName.replace(this._buildRegex(convDirName), this.replaceVal)
      : templateDirName
    return tempDirName
  }

  async getComponentFiles() : Promise<IComponentFileInfo[] | Error> {
    const filesResult = await this.templateReader.getTemplateFiles()
    if (filesResult instanceof Error)
      return filesResult

    return filesResult.map(tempFileInfo =>{
      const convFileName = this._getConvention(tempFileInfo.fileName)
      const convFileData = this._getConvention(tempFileInfo.fileData)
      return {
        fileName : convFileName ?
          tempFileInfo.fileName.replace(this._buildRegex(convFileName), this.replaceVal)
          : tempFileInfo.fileName,
        data : convFileData ?
          tempFileInfo.fileData.replace(this._buildRegex(convFileData), this.replaceVal)
          : tempFileInfo.fileData
      }
    })
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


  private _getConvention(str:string) : NamingConvention | null {
    let nameConvention : NamingConvention | null = null
    for(const namingConv of Object.values(NamingConvention)){
      if(str.includes(`${edging}${namingConv}${edging}`)){
        nameConvention =  namingConv
        break
      }
    }
    return nameConvention
  }

  private _buildRegex(convention:NamingConvention) : RegExp  {
    return new RegExp( `\\${edging}${convention}\\${edging}`,"g")
  }

}