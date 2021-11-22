export interface IInitializer {
  execute() : Promise<void | Error>
}