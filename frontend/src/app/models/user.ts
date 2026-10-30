import {Project} from "./project";

export class User {
  id: string
  firstname: string
  lastname: string
  dateOfBirth: string
  sex: string
  image: string
  email: string
  darkTheme: boolean
  lastProject: string | null
  projects: Project[]
}
