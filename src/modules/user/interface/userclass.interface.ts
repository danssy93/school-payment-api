export interface ClassAssignmentPayload {
  assignment_id: string;
  assignment_type: string;
  arm_id: string;
  arm_name: string;
  class_id: string;
  class_name: string;
  session_id: string;
}

export interface UserWithClassPayload {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  type?: string;
  status?: string;
  class: ClassAssignmentPayload[] | null;
  created_at?: Date;
  updated_at?: Date;
}
