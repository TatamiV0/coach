// roles_data.d.ts
export interface Skill {
  what_i_do: string;
  how_i_do_it: string[];
}

export interface SkillSet {
  strategy: Skill;
  creativity: Skill;
  leadership: Skill;
  culture: Skill;
  [key: string]: Skill; // Index signature to allow string indexing
}

export interface Role {
  title: string;
  skills: SkillSet;
}

export interface SkillCategory {
  name: string;
  description: string;
}

export interface RolesData {
  roles: Role[];
  skillCategories: SkillCategory[];
}

export const rolesData: RolesData;
