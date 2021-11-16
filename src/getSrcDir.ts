import {dirname} from "path"
import {constants } from "fs"
import {access} from "fs/promises";

export async function getSrcDir () {

  for ( let path of module.paths ) {
    try {
      let prospectivePkgJsonDir = dirname ( path );
      await access ( path, constants.F_OK );
      return prospectivePkgJsonDir;
    } catch ( e ) {}
  }

}