import {Generator} from "./Generator";
import {ComponentDispatcher} from "./ComponentDispatcher";
import {ComponentReader, DirInfos} from "./ComponentReader";
import {constants} from "os";


const ComponentArchitect = new ComponentDispatcher()

const run = async ()=>{

  const dirsInfos = await ComponentReader.getAllDirsInfos()

  for(const dirInfo of dirsInfos){
    const compReader = new ComponentReader(dirInfo)
    const componentType = compReader.getComponentType()
    const configFile = compReader.getConfigFile()

    if(componentType instanceof Error)
      await Promise.reject(componentType.message)
    else
      ComponentArchitect.addComponent(
        componentType,
        configFile? configFile.componentWorkDir : "",
        componentHandler(componentReader)
        )
  }

}

run()
  .then()
  .catch(err=> {
    console.log(err)
  })

/*

ComponentArchitect.addComponent('uc','application/use-cases')
ComponentArchitect.addComponent('entity','domain/entities')

Generator.build(ComponentArchitect)
  .then((generator)=>generator.execute())
  .catch(err=> {
    console.log(`Une erreur est survenue: `,err)
  })
*/

