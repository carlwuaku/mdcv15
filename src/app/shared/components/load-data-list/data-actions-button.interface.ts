export interface DataActionsButton
  {
    label: string,
    onClick?: Function | void,
    icon?: string,
    type: "button" | "link",
    link?:string,
    linkProp?: string
  }
