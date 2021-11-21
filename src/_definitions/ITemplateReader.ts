export type ITemplateDirInfos = {
  dirName : string,
  dirPath : string,
}

export type ITemplateFileInfo = {
  fileName : string,
  filePath : string,
  fileData : string
}


export interface ITemplateReader {
  templateName: string
  templatePath: string
  templateDirName: string
  getTemplateFiles() : Promise<Error |ITemplateFileInfo[]>
}

