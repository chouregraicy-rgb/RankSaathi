// ============================================================
// VidyaSaathi — Global TypeScript Types
// ============================================================

export type UserRole = "student" | "parent" | "admin";

export type ExamType = "NEET" | "JEE_MAIN" | "JEE_ADVANCED";

export type Subject =
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Mathematics";

export type DifficultyLevel = "easy" | "medium" | "hard";

export type QuestionType =
  | "mcq"
  | "integer"
  | "assertion_reason"
  | "match_the_following";

export type MoodState =
  | "focused"
  | "normal"
  | "distracted"
  | "fatigued"
  | "burnout_risk";

// ---- User & Auth ----

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  exam_type: ExamType[];
  target_year: number;
  class_level: 11 | 12 | "dropper";
  invite_code: string;
  current_streak: number;
  longest_streak: number;
  total_study_hours: number;
  rank_estimate: number | null;
  city: string | null;
  coaching_name: string | null;
  created_at: string;
  // joins
  user?: User;
}

export interface Parent {
  id: string;
  user_id: string;
  student_id: string | null;
  invite_code_used: string | null;
  created_at: string;
  // joins
  user?: User;
  student?: Student;
}

// ---- Syllabus ----

export interface SyllabusSubject {
  id: string;
  name: Subject;
  exam_type: ExamType[];
  color: string;
  icon: string;
}

export interface SyllabusUnit {
  id: string;
  subject_id: string;
  name: string;
  order_index: number;
}

export interface SyllabusChapter {
  id: string;
  unit_id: string;
  subject_id: string;
  name: string;
  order_index: number;
  weightage: number; // % of marks in exam
  difficulty: DifficultyLevel;
  // joins
  unit?: SyllabusUnit;
  subject?: SyllabusSubject;
}

// ---- Revision ----

export interface ChapterNote {
  id: string;
  chapter_id: string;
  student_id: string;
  type: "quick_notes" | "formula_sheet" | "bullets" | "mistakes" | "pyq" | "ai_summary";
  content: string; // markdown
  created_at: string;
  updated_at: string;
}

export interface RevisionLog {
  id: string;
  student_id: string;
  chapter_id: string;
  revision_count: number;
  last_revised_at: string;
  confidence_score: number; // 1-5
  next_revision_due: string; // spaced repetition date
}

// ---- Questions & Tests ----

export interface Question {
  id: string;
  subject_id: string;
  chapter_id: string;
  unit_id: string;
  exam_type: ExamType[];
  type: QuestionType;
  difficulty: DifficultyLevel;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string; // 'A','B','C','D' or integer string or assertion logic
  explanation: string;
  tags: string[];
  source: string | null; // e.g. "JEE 2019 Paper 1"
  created_at: string;
}

export interface Test {
  id: string;
  title: string;
  exam_type: ExamType[];
  type: "topic" | "chapter" | "full_mock" | "adaptive";
  subject_ids: string[];
  chapter_ids: string[];
  total_questions: number;
  duration_minutes: number;
  total_marks: number;
  negative_marking: number;
  is_published: boolean;
  created_by: string; // admin user id
  created_at: string;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  student_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  max_score: number;
  accuracy: number | null; // percentage
  time_taken_seconds: number | null;
  answers: Record<string, string>; // question_id → answer
  status: "in_progress" | "submitted" | "abandoned";
  // joins
  test?: Test;
}

export interface TestResult {
  attempt_id: string;
  score: number;
  max_score: number;
  accuracy: number;
  time_taken_seconds: number;
  rank_estimate: number;
  subject_breakdown: {
    subject: string;
    correct: number;
    wrong: number;
    skipped: number;
    score: number;
  }[];
  weak_topics: string[];
  strong_topics: string[];
  improvement_tips: string[];
}

// ---- Study Sessions ----

export interface StudySession {
  id: string;
  student_id: string;
  subject_id: string | null;
  chapter_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  session_type: "self_study" | "revision" | "test" | "doubt";
  focus_score: number | null; // 0-100 computed
}

// ---- Geo Tracking ----

export interface StudentLocation {
  id: string;
  student_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  battery_level: number | null;
  timestamp: string;
  location_label: string | null; // "Home", "Coaching", etc.
  is_in_safe_zone: boolean;
}

export interface GeoFence {
  id: string;
  student_id: string;
  label: string; // "Home", "Coaching Center"
  latitude: number;
  longitude: number;
  radius_meters: number;
  is_active: boolean;
}

// ---- Mood ----

export interface MoodLog {
  id: string;
  student_id: string;
  mood_state: MoodState;
  focus_score: number;       // 0-100
  burnout_risk: number;      // 0-100
  distraction_score: number; // 0-100
  consistency_score: number; // 0-100
  study_hours_today: number;
  sessions_today: number;
  inactivity_minutes: number;
  logged_at: string;
}

// ---- Notifications ----

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "alert" | "reminder" | "achievement" | "report";
  is_read: boolean;
  created_at: string;
  action_url: string | null;
}

// ---- AI Doubt ----

export interface DoubtSession {
  id: string;
  student_id: string;
  question_text: string;
  image_url: string | null;
  subject: Subject | null;
  chapter: string | null;
  ai_response: string;
  related_concepts: string[];
  created_at: string;
}

// ---- Analytics ----

export interface SubjectPerformance {
  subject: Subject;
  total_questions: number;
  correct: number;
  accuracy: number;
  avg_time_per_question: number;
  trend: "improving" | "stable" | "declining";
}

export interface WeeklyReport {
  student_id: string;
  week_start: string;
  total_study_hours: number;
  tests_taken: number;
  avg_score: number;
  streak_days: number;
  chapters_revised: number;
  mood_distribution: Record<MoodState, number>;
  top_subjects: Subject[];
  weak_subjects: Subject[];
}

