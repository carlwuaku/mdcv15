export interface PractitionerObject {
    id: string;
    type: "Doctor"|"Physician Assistant"
    first_name: string ;
    middle_name: string ;
    last_name: string ;
    date_of_birth: string ;
    registration_number: string ;
    sex: string ;
    registration_date: string ;
    title: string;
    marital_status: string ;
    maiden_name: string ;
    nationality: string;
    status: string;
    standing: string ;
    postal_address: string ;
    residential_address: string ;
    hometown: string ;
    picture: string ;
    deleted: string ;
    modified_on: string ;
    created_on: string ;
    email: string ;
    phone: any;
    in_good_standing: string ;
    cpd_score: string ;
    is_permitted_retention: string ;
    is_superintendent: string ;
    education_history: any[];
    retention_history: any[];
    // cpd_history:CpdListObject[] =null;
    age: number;
    //in many contexts we want to selected some items.
    selected: boolean;
    provisional_number: string ;
    register_type: "Permanent"|"Provisional"|"Temporary";
    specialty: string ;
    category: "Medical" | "Dental" | "Certified Registered Anaesthetist" ;
    place_of_birth: string ;
    qualification_at_registration: string ;
    training_institution: string ;
    qualification_date: string ;
    year_of_permanent: string ;
    year_of_provisional: string ;
    institution_type: string ;
    subspecialty: string ;
    region: string ;
    district: string ;
    town: string ;
    place_of_work:string ;
    gazette_specialty: any ;
    college_membership:string ;
    uuid:string;
    deleted_at:string|null;
}

export enum PractitionerTypes {
    Doctors = 'Doctors',
    PhysicianAssistants = 'Physician Assistants',
    Interns = "Interns",
    ExamCandidates = "Exam Candidates",
    Events = "Events",
    Payments = "Payments",
    CPD = "CPD"
}
