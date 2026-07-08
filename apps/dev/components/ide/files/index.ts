import { Readme } from "./readme";
import { Projects } from "./projects";
import { Experience } from "./experience";
import { Awards } from "./awards";
import { Skills } from "./skills";
import { Contact } from "./contact";
import type { FileId } from "../fileConfig";

export const FILE_COMPONENTS: Record<FileId, () => React.ReactElement> = {
  readme: Readme,
  projects: Projects,
  experience: Experience,
  awards: Awards,
  skills: Skills,
  contact: Contact,
};
