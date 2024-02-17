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
      title: "Newly Qualified",
      has_children: false,
      url: "/pass_list",
      icon: "fa fa-home",
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
      title: "Accounts",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-dollar",
      children: [
        {
          title: "Manage Fees",
          url: "/fees"
        },
        {
          title: "Generate Invoice",
          url: "/view_invoice"
        }
        ,
        {
          title: "View Invoices",
          url: "/online_payments"
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
      title: "OTCMS",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-building",
      children: [
        {
          title: "Dashboard/Search",
          url: "/otcms_dashboard"
        },
        // {
        //   title: "Add OTCMS",
        //   url: "/add_otcms"
        // },
        {
          title: "Renewals",
          url: "/otcms_renewal_dashboard"
        },
        {
          title: "Report",
          url: "/otcms_reports"
        }
      ]
    },
    {
      title: "Pharmacies",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-building",
      children: [
        {
          title: "Dashboard/Search",
          url: "/pharmacies_dashboard"
        },
        // {
        //   title: "Add Pharmacy",
        //   url: "/add_pharmacy"
        // },
        {
          title: "Renewals",
          url: "/renewal_dashboard"
        },
        {
          title: "Report",
          url: "/pharmacy_reports"
        }
      ]
    },
    {
      title: "Pharmacists",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-users",
      children: [
        {
          title: "Dashboard/Search",
          url: "/pharmacist"
        },
        {
          title: "Add Pharmacist",
          url: "/add_pharmacist"
        },


        {
          title: "Web Portal Edits",
          url: "/web_edits"
        },
        {
          title: "Reports",
          url: "/pharmacist_reports"
        }
      ]
    },
    {
      title: "Technicians",
      has_children: true,
      active_children: false,
      url: "",
      icon: "fa fa-users",
      children: [
        {
          title: "Dashboard/Search",
          url: "/technician_dashboard"
        },
        {
          title: "Add Technician",
          url: "/add_technician"
        },


        {
          title: "Reports",
          url: "/technician_reports"
        }
      ]
    },
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
          url: "/admin/view_activities"
        },
        {
          title: "Logs",
          url: "/admin/logs"
        }
      ]
    }
  ]
}
