export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  body: string;
  isImportant?: boolean;
  category?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  icon: string;
  desc: string;
  duration?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  desc: string;
  date?: string;
}

export interface FounderItem {
  id: string;
  name: string;
  role: string;
  session: string;
  dept?: string;
  icon?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  session: string;
  dept?: string;
}

export interface FbPostItem {
  id: string;
  title: string;
  date: string;
  snippet: string;
  link: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  roll: string;
  reg?: string;
  semester: string;
  shift: string;
  phone: string;
  email?: string;
  interestDomain: string;
  whyJoin?: string;
  submittedAt: string;
}

export interface ClubSettings {
  passcode: string;
  clubName: string;
  instituteName: string;
  facebookUrl: string;
  department: string;
}

export interface ClubData {
  notices: NoticeItem[];
  courses: CourseItem[];
  gallery: GalleryItem[];
  founders: FounderItem[];
  committee: CommitteeMember[];
  fbPosts: FbPostItem[];
  applications?: ApplicationItem[];
  settings?: ClubSettings;
  updatedAt?: number;
}
