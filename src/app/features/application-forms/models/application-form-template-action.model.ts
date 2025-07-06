export type ApplicationFormTemplateActionObject = {
  type: string, label: string, config_type: "email" | "admin_email" | "api_call" | "internal_api_call", config: {
    template?: string, subject?: string,
    admin_email?: string, endpoint?: string, method?: string, auth_token?: string, headers?: any[], body_mapping?: any[], query_params?: any[]
  }
}

export type ApplicationFormTemplateActionObjectConfigKey = keyof ApplicationFormTemplateActionObject['config'];
