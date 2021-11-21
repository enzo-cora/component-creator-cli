export interface IInitializeCommand {
  reload() : Promise<void | Error>
}