export type screensType = {
  screenkey: string;
  app: string;
  title: string;
  detail: string;
  description: string;
};

export type permitsType = {
  permitkey: string;
  endpoint: string;
  method: string;
  screen: string;
  status: string;
  created: number;
  updated: number;
  createn: boolean;
};

export type filtersType = {
  field: string;
  operator: string;
  value: string[];
};

export type rolesType = {
  rolekey: string;
  filters: filtersType[];
  formats: string[];
  screens: string[];
  permits: string[];
  status: string;
  created: number;
  updated: number;
  createn: boolean;
};

export type formatsType = {
  formatkey: string;
  formatttl: string;
  fields: string[];
  status: string;
  created: number;
  updated: number;
  createn: boolean;
};

export type accountsType = {
  username: string;
  password: "";
  email: string;
  namefull: string;
  role: string;
  status: string;
  created: number;
  updated: number;
  createn: boolean;
};

export type infoType = {
  permits: permitsType[];
  role: string;
  formats: formatsType[];
  filters: filtersType[];
};

export type queryUserType = {
  search: string;
  config: string;
  page: number;
  limit: number;
};
