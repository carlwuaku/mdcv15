import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  current_url: string = "/dashboard";
  menu_items = [
    {
      title: "Dashboard",
      has_children: false,
      url: "/dashboard",
      icon: "fa fa-home",
      children: []
    },
    {
      title: "Retention",
      has_children: false,
      url: "/relicensure",
      icon: "fa fa-refresh",
      children: []
    },

    {
      title: "CPD",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-book",
      children: [
        {
          title: "Dashboard/Search",
          url: "/cpd_dashboard"
        },
        {
          title: "Add New CPD",
          url: "/add_cpd"
        },
        {
          title: "View CPD Topics",
          url: "/list_cpd"
        },
        {
          title: "CDP Organizers",
          url: "/list_cpd_facilities"
        },
        {
          title: "CPD Report",
          url: "/cpd_attendance_report"
        },
        {
          title: "CDP Online",
          url: "/cpd_online_providers"
        },
        {
          title: "Approval",
          url: "/approve_cpd_attendance"
        }
      ]
    },
    {
      title: "Applications",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-dollar",
      children: [
        {
          title: "Submitted Application",
          url: "/applicationsx"
        },
        {
          title: "Manage Templates",
          url: "/application-templates"
        }
      ]
    },
    {
      title: "Practitioners",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-graduation-cap",
      children: [
        {
          title: "Dashboard/Search",
          url: "/practitioners"
        },
        {
          title: "Add New Practitioner/Search",
          url: "/practitioners/practitioner-form"
        },
        {
          title: "Start Renewal",
          url: "/practitioners/renewal-form"
        },
        {
          title: "Renewal History",
          url: "/practitioners/renewals"
        },

      ]
    },

    {
      title: "Messaging",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-envelope",
      children: [
        {
          title: "Send Email",
          url: "/send_mail"
        },
        {
          title: "Send SMS",
          url: "/send_sms"
        },
        {
          title: "Email Queue",
          url: "/email_queue"
        }
      ]
    }
    ,
    {
      title: "System Config",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-cogs",
      children: [
        {
          title: "New User",
          url: "/admin/userForm"
        },
        {
          title: "View Users",
          url: "/admin/users"
        },
        {
          title: "Manage Roles",
          url: "/admin/roles"
        },
        {
          title: "Permissions",
          url: "/admin/permission_matrix"
        },
        {
          title: "System Settings",
          url: "/settings"
        },
        {
          title: "Flags",
          url: "/admin/flags"
        },
        {
          title: "Activities",
          url: "/activities"
        },
        {
          title: "Logs",
          url: "/admin/logs"
        }
      ]
    }
  ]
}
