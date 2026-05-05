export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  roleName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface Student {
  id: string;
  userId: string;
  schoolId: string;
  admissionNumber: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  dob: string;
  gender: string;
  bloodGroup?: string | null;
  address: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  initialPassword: string;
  admissionNumber: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup?: string | null;
  schoolId?: string | null;
}

export interface UpdateStudentRequest {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  admissionNumber: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup?: string | null;
  newPassword?: string | null;
}

export interface EnrollStudentRequest {
  classId: string;
  sectionId: string;
  academicYearId: string;
  rollNumber: string;
}

export interface LinkParentRequest {
  parentId: string;
  relation: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  joiningDate: string;
  qualification: string;
  experienceYears: number;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  initialPassword: string;
  employeeId: string;
  joiningDate: string;
  qualification: string;
  experienceYears: number;
}

export interface UpdateTeacherRequest {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  employeeId: string;
  joiningDate: string;
  qualification: string;
  experienceYears: number;
  newPassword?: string | null;
}

export interface CreateParentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  occupation?: string | null;
}

export interface ParentItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  occupation?: string | null;
}

export interface UpdateParentRequest {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  occupation?: string | null;
}

export interface StudentFee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: string;
  totalPaid: number;
}

export interface RecordPaymentRequest {
  studentFeeId: string;
  amountPaid: number;
  paymentMethod: string;
}

export interface IdNameItem {
  id: string;
  name: string;
}

export interface SectionItem extends IdNameItem {
  classId: string;
  capacity?: number;
}

export interface AcademicCatalog {
  academicYears: IdNameItem[];
  classes: IdNameItem[];
  sections: SectionItem[];
}

export interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYearId?: string;
  academicYear: string;
}

export interface CreateExamRequest {
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateExamRequest extends CreateExamRequest {
  id: string;
}

export interface AcademicYearItem extends IdNameItem {
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CreateAcademicYearRequest {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateAcademicYearRequest extends CreateAcademicYearRequest {
  id: string;
}

export interface ClassItem extends IdNameItem {
  description?: string | null;
}

export interface CreateClassRequest {
  name: string;
  description?: string | null;
}

export interface UpdateClassRequest extends CreateClassRequest {
  id: string;
}

export interface CreateSectionRequest {
  name: string;
  capacity: number;
  classId: string;
}

export interface UpdateSectionRequest extends CreateSectionRequest {
  id: string;
}

export interface SchoolSubscription {
  id: string;
  schoolId: string;
  plan: string;
  status: string;
  trialEndsAtUtc: string;
  currentPeriodEndUtc?: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface PaySubscriptionRequest {
  yearlyPremium: boolean;
  paymentMethod: string;
}
