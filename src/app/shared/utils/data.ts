import { Params } from "@angular/router";

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  children: DashboardItem[];
  active_children?: boolean;
  urlParams?: Params;
}

export interface DashboardItem extends MenuItem {
  apiCountUrl?: string;
  color?: string;
  description?: string;
  apiCountText?: string
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",

    url: "/dashboard",
    icon: "dashboard",
    children: []
  },
  {
    title: "Retention",

    url: "/relicensure",
    icon: "published_with_changes",
    children: []
  },

  {
    title: "CPD",

    active_children: false,
    url: "",
    icon: "auto_stories_outlined",
    children: [
      {
        title: "Dashboard/Search",
        url: "/cpd_dashboard",

        icon: '',
        children: []
      },
      {
        title: "Add New CPD",
        url: "/add_cpd",

        icon: '',
        children: []
      },
      {
        title: "View CPD Topics",
        url: "/list_cpd",

        icon: '',
        children: []
      },
      {
        title: "CDP Organizers",
        url: "/list_cpd_facilities",

        icon: '',
        children: []
      },
      {
        title: "CPD Report",
        url: "/cpd_attendance_report",

        icon: '',
        children: []
      },
      {
        title: "CDP Online",
        url: "/cpd_online_providers",

        icon: '',
        children: []
      },
      {
        title: "Approval",
        url: "/approve_cpd_attendance",

        icon: '',
        children: []
      }
    ]
  },
  {
    title: "Applications",

    active_children: false,
    url: "",
    icon: "list_alt",
    children: [
      {
        title: "All Applications",
        url: "/applications",

        icon: '',
        children: []
      },
      {
        title: "Manage Templates",
        url: "/application-templates",

        icon: '',
        children: []
      },
      {
        title: "Add New Templates",
        url: "/application-templates/form",

        icon: '',
        children: []
      }
    ]
  },
  {
    title: "Practitioners",

    active_children: false,
    url: "",
    icon: "person_outlined",
    children: [
      {
        title: "Dashboard/Search",
        url: "/practitioners",

        icon: '',
        children: []
      },
      {
        title: "Add New Practitioner/Search",
        url: "/practitioners/practitioner-form",

        icon: '',
        children: []
      },
      {
        title: "Start Renewal",
        url: "/practitioners/renewal-form",

        icon: '',
        children: []
      },
      {
        title: "Renewal History",
        url: "/practitioners/renewals",

        icon: '',
        children: []
      },

    ]
  },

  {
    title: "Messaging",

    active_children: false,
    url: "",
    icon: "mail",
    children: [
      {
        title: "Send Email",
        url: "/send_mail",

        icon: '',
        children: []
      },
      {
        title: "Send SMS",
        url: "/send_sms",

        icon: '',
        children: []
      },
      {
        title: "Email Queue",
        url: "/email_queue",

        icon: '',
        children: []
      }
    ]
  }
  ,
  {
    title: "System Config",

    active_children: false,
    url: "",
    icon: "settings",
    children: [
      {
        title: "New User",
        url: "/admin/userForm",

        icon: '',
        children: []
      },
      {
        title: "View Users",
        url: "/admin/users",

        icon: '',
        children: []
      },
      {
        title: "Manage Roles",
        url: "/admin/roles",

        icon: '',
        children: []
      },
      {
        title: "Permissions",
        url: "/admin/permission_matrix",

        icon: '',
        children: []
      },
      {
        title: "System Settings",
        url: "/settings",

        icon: '',
        children: []
      },
      {
        title: "Flags",
        url: "/admin/flags",

        icon: '',
        children: []
      },
      {
        title: "Activities",
        url: "/activities",

        icon: '',
        children: []
      },
      {
        title: "Logs",
        url: "/admin/logs",

        icon: '',
        children: []
      }
    ]
  }
]


export const dashboardItems: DashboardItem[] = [


  {
    title: "Doctors",
    color: "primary",
    active_children: false,
    url: "",
    icon: "persons",
    children: [
      {
        title: "Add New Doctor",
        url: "/practitioners/practitioner-form",

        icon: 'plus',
        children: []
      },
      {
        title: "Doctor Reports",
        url: "/practitioners/reports",

        icon: 'line-chart',
        children: []
      },
      {
        title: "Renewal of license",
        url: "/practitioners/renewal-form",

        icon: 'refresh',
        children: []
      },
      {
        title: "Migration to Permanent Register",
        url: "/practitioners/migration",

        icon: 'fast-forward',
        children: []
      },
      {
        title: "New Provisional Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Doctor", "form_type": "Practitioners Provisional Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Doctor&form_type=Practitioners Provisional Registration Application&status=Pending Approval"
      },
      {
        title: "New Permanent Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Doctor", "form_type": "Practitioners Permanent Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Doctor&form_type=Practitioners Permanent Registration Application&status=Pending Approval"
      },
      {
        title: "New Temporary Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Doctor", "form_type": "Practitioners Temporary Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Doctor&form_type=Practitioners Temporary Registration Application&status=Pending Approval"
      },
      {
        title: "New Portal Edits",
        url: "/applications",
        urlParams: { "form_type": "Portal Edit", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?form_type=Portal Edit&status=Pending Approval"
      },
      {
        title: "Relic. Pending Approval",
        url: "/practitioners/renewals",
        urlParams: { "status": "Pending Approval", "practitioner_type": "Doctor" },
        icon: '',
        children: [],
        apiCountUrl: "practitioners/renewal-count?status=Pending Approval&practitioner_type=Doctor"
      },
      {
        title: "Relic. Pending Payment",
        url: "/practitioners/renewals",
        urlParams: { "status": "Pending Payment", "practitioner_type": "Doctor" },
        icon: '',
        children: [],
        apiCountUrl: "practitioners/renewal-count?status=Pending Payment&practitioner_type=Doctor'"
      }
    ],
    apiCountUrl: ""
  },

  {
    title: "Physician Assistants",
    color: "primary",
    active_children: false,
    url: "",
    icon: "persons",
    children: [
      {
        title: "Add New Physician Assistant",
        url: "/practitioners/practitioner-form",

        icon: 'plus',
        children: []
      },
      {
        title: "Physician Assistant Reports",
        url: "/practitioners/reports",

        icon: 'line-chart',
        children: []
      },
      {
        title: "Renewal of license",
        url: "/practitioners/renewal-form",

        icon: 'refresh',
        children: []
      },
      {
        title: "Migration to Permanent Register",
        url: "/practitioners/migration",

        icon: 'fast-forward',
        children: []
      },
      {
        title: "New Provisional Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Physician Assistant", "form_type": "Practitioners Provisional Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Physician Assistant&form_type=Practitioners Provisional Registration Application&status=Pending Approval"
      },
      {
        title: "New Permanent Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Physician Assistant", "form_type": "Practitioners Permanent Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Physician Assistant&form_type=Practitioners Permanent Registration Application&status=Pending Approval"
      },
      {
        title: "New Temporary Registrations",
        url: "/applications",
        urlParams: { "practitioner_type": "Physician Assistant", "form_type": "Practitioners Temporary Registration Application", "status": "Pending Approval" },
        icon: '',
        children: [],
        apiCountUrl: "applications/count?practitioner_type=Physician Assistant&form_type=Practitioners Temporary Registration Application&status=Pending Approval"
      },

      {
        title: "Relic. Pending Approval",
        url: "/practitioners/renewals",
        urlParams: { "status": "Pending Approval", "practitioner_type": "Physician Assistant" },
        icon: '',
        children: [],
        apiCountUrl: "practitioners/renewal-count?status=Pending Approval&practitioner_type=Physician Assistant"
      },
      {
        title: "Relic. Pending Payment",
        url: "/practitioners/renewals",
        urlParams: { "status": "Pending Payment", "practitioner_type": "Physician Assistant" },
        icon: '',
        children: [],
        apiCountUrl: "practitioners/renewal-count?status=Pending Payment&practitioner_type=Physician Assistant'"
      }
    ],
    apiCountUrl: ""
  },
  {
    title: "CPD",

    active_children: false,
    url: "",
    icon: "list_alt",
    children: [

    ],
    apiCountUrl: ""
  },
  {
    title: "Housemanship",

    active_children: false,
    url: "",
    icon: "person",
    children: [

    ],
    apiCountUrl: ""
  },

  {
    title: "Online Payments",

    active_children: false,
    url: "",
    icon: "mail",
    children: [

    ],
    apiCountUrl: ""
  }
  ,
  {
    title: "Examination",

    active_children: false,
    url: "",
    icon: "settings",
    children: [

    ],
    apiCountUrl: ""
  },
  {
    title: "Indexing",

    active_children: false,
    url: "",
    icon: "settings",
    children: [

    ]
  }
]
