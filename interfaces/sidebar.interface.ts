export interface Submodule {
  id: string;
  title: string;
  icon: string;
  route: string;
  active?: boolean;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  route: string | null;
  submodules?: Submodule[];
  expanded?: boolean;
  active?: boolean;
}

export interface Section {
  id: string;
  title: string;
  modules: Module[];
}