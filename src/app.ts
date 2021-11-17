import {ComponentDispatcher} from "./ComponentDispatcher";
import {ComponentReader} from "./ComponentReader";
import {CLIHandler} from "./CLIHandler";


const CompDispatcher = new ComponentDispatcher()

const run = async ()=>{

  const dirsInfos = await ComponentReader.getAllDirsInfos()

  for(const dirInfo of dirsInfos){
    const CompReader = new ComponentReader(dirInfo)
    const addResult = CompDispatcher.addComponent(CompReader)
    if(addResult instanceof Error)
      return Promise.reject(addResult.message)
  }

  const Result = CLIHandler.build(CompDispatcher)
  if(Result instanceof Error)
    return Promise.reject(Result.message)


  const componentType = Result.componentType
  const compReaderResult = CompDispatcher.getComponentReader(componentType)
  if(compReaderResult instanceof Error)
    return Promise.reject(compReaderResult.message)

  Result.execute(compReaderResult)

}

run()
  .then(()=> console.log("Le composant à été créer avec succès"))
  .catch(err=> {
    console.log(err)
  })
