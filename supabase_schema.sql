-- ============================================================
-- VidyaSaathi — Complete Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast text search

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role         AS ENUM ('student', 'parent', 'admin');
CREATE TYPE exam_type         AS ENUM ('NEET', 'JEE_MAIN', 'JEE_ADVANCED');
CREATE TYPE difficulty_level  AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type     AS ENUM ('mcq', 'integer', 'assertion_reason', 'match_the_following');
CREATE TYPE mood_state        AS ENUM ('focused', 'normal', 'distracted', 'fatigued', 'burnout_risk');
CREATE TYPE test_type         AS ENUM ('topic', 'chapter', 'full_mock', 'adaptive');
CREATE TYPE attempt_status    AS ENUM ('in_progress', 'submitted', 'abandoned');
CREATE TYPE session_type      AS ENUM ('self_study', 'revision', 'test', 'doubt');
CREATE TYPE notification_type AS ENUM ('alert', 'reminder', 'achievement', 'report');
CREATE TYPE note_type         AS ENUM ('quick_notes', 'formula_sheet', 'bullets', 'mistakes', 'pyq', 'ai_summary');
CREATE TYPE class_level       AS ENUM ('11', '12', 'dropper');

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Users (mirrors auth.users, synced via trigger)
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'student',
  full_name   TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students
CREATE TABLE public.students (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  exam_type         exam_type[] NOT NULL DEFAULT '{NEET}',
  target_year       INTEGER NOT NULL DEFAULT 2026,
  class_level       class_level NOT NULL DEFAULT 'dropper',
  invite_code       TEXT NOT NULL UNIQUE,
  current_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak    INTEGER NOT NULL DEFAULT 0,
  total_study_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
  rank_estimate     INTEGER,
  city              TEXT,
  coaching_name     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parents
CREATE TABLE public.parents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES public.students(id),
  invite_code_used TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SYLLABUS
-- ============================================================

CREATE TABLE public.syllabus_subjects (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  exam_type  exam_type[] NOT NULL,
  color      TEXT NOT NULL DEFAULT '#2b7fff',
  icon       TEXT NOT NULL DEFAULT 'book',
  UNIQUE(name)
);

CREATE TABLE public.syllabus_units (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id  UUID NOT NULL REFERENCES public.syllabus_subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.syllabus_chapters (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id     UUID NOT NULL REFERENCES public.syllabus_units(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES public.syllabus_subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  weightage   NUMERIC(5,2) NOT NULL DEFAULT 0,
  difficulty  difficulty_level NOT NULL DEFAULT 'medium'
);

-- ============================================================
-- QUESTIONS & TESTS
-- ============================================================

CREATE TABLE public.questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id      UUID REFERENCES public.syllabus_subjects(id),
  chapter_id      UUID REFERENCES public.syllabus_chapters(id),
  unit_id         UUID REFERENCES public.syllabus_units(id),
  exam_type       exam_type[] NOT NULL,
  type            question_type NOT NULL DEFAULT 'mcq',
  difficulty      difficulty_level NOT NULL DEFAULT 'medium',
  question_text   TEXT NOT NULL,
  option_a        TEXT,
  option_b        TEXT,
  option_c        TEXT,
  option_d        TEXT,
  correct_answer  TEXT NOT NULL,
  explanation     TEXT NOT NULL DEFAULT '',
  tags            TEXT[] NOT NULL DEFAULT '{}',
  source          TEXT,
  created_by      UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_subject  ON public.questions(subject_id);
CREATE INDEX idx_questions_chapter  ON public.questions(chapter_id);
CREATE INDEX idx_questions_exam     ON public.questions USING gin(exam_type);
CREATE INDEX idx_questions_type     ON public.questions(type);
CREATE INDEX idx_questions_diff     ON public.questions(difficulty);

CREATE TABLE public.tests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  exam_type        exam_type[] NOT NULL,
  type             test_type NOT NULL DEFAULT 'chapter',
  subject_ids      UUID[] NOT NULL DEFAULT '{}',
  chapter_ids      UUID[] NOT NULL DEFAULT '{}',
  question_ids     UUID[] NOT NULL DEFAULT '{}',
  total_questions  INTEGER NOT NULL DEFAULT 30,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks      INTEGER NOT NULL DEFAULT 120,
  negative_marking NUMERIC(4,2) NOT NULL DEFAULT -1,
  is_published     BOOLEAN NOT NULL DEFAULT false,
  created_by       UUID REFERENCES public.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.test_attempts (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id            UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at       TIMESTAMPTZ,
  score              NUMERIC(10,2),
  max_score          INTEGER NOT NULL,
  accuracy           NUMERIC(5,2),
  time_taken_seconds INTEGER,
  answers            JSONB NOT NULL DEFAULT '{}',
  status             attempt_status NOT NULL DEFAULT 'in_progress',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attempts_student ON public.test_attempts(student_id);
CREATE INDEX idx_attempts_test    ON public.test_attempts(test_id);

-- ============================================================
-- REVISION & NOTES
-- ============================================================

CREATE TABLE public.chapter_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id  UUID NOT NULL REFERENCES public.syllabus_chapters(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type        note_type NOT NULL DEFAULT 'quick_notes',
  content     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(chapter_id, student_id, type)
);

CREATE TABLE public.revision_logs (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id         UUID NOT NULL REFERENCES public.syllabus_chapters(id) ON DELETE CASCADE,
  revision_count     INTEGER NOT NULL DEFAULT 1,
  last_revised_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence_score   INTEGER NOT NULL DEFAULT 3 CHECK (confidence_score BETWEEN 1 AND 5),
  next_revision_due  DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '3 days',
  UNIQUE(student_id, chapter_id)
);

-- ============================================================
-- STUDY SESSIONS
-- ============================================================

CREATE TABLE public.study_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id       UUID REFERENCES public.syllabus_subjects(id),
  chapter_id       UUID REFERENCES public.syllabus_chapters(id),
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at         TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  session_type     session_type NOT NULL DEFAULT 'self_study',
  focus_score      INTEGER CHECK (focus_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_sessions_student ON public.study_sessions(student_id);
CREATE INDEX idx_sessions_date    ON public.study_sessions(started_at);

-- ============================================================
-- GEO TRACKING
-- ============================================================

CREATE TABLE public.student_locations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,
  accuracy        INTEGER,
  speed           INTEGER,
  battery_level   INTEGER,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location_label  TEXT,
  is_in_safe_zone BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_locations_student ON public.student_locations(student_id);
CREATE INDEX idx_locations_time    ON public.student_locations(timestamp);

CREATE TABLE public.geo_fences (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label          TEXT NOT NULL,
  latitude       DOUBLE PRECISION NOT NULL,
  longitude      DOUBLE PRECISION NOT NULL,
  radius_meters  INTEGER NOT NULL DEFAULT 200,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MOOD TRACKING
-- ============================================================

CREATE TABLE public.mood_logs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mood_state          mood_state NOT NULL DEFAULT 'normal',
  focus_score         INTEGER NOT NULL DEFAULT 70 CHECK (focus_score BETWEEN 0 AND 100),
  burnout_risk        INTEGER NOT NULL DEFAULT 0  CHECK (burnout_risk BETWEEN 0 AND 100),
  distraction_score   INTEGER NOT NULL DEFAULT 0  CHECK (distraction_score BETWEEN 0 AND 100),
  consistency_score   INTEGER NOT NULL DEFAULT 50 CHECK (consistency_score BETWEEN 0 AND 100),
  study_hours_today   NUMERIC(5,2) NOT NULL DEFAULT 0,
  sessions_today      INTEGER NOT NULL DEFAULT 0,
  inactivity_minutes  INTEGER NOT NULL DEFAULT 0,
  logged_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mood_student ON public.mood_logs(student_id);
CREATE INDEX idx_mood_date    ON public.mood_logs(logged_at);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        notification_type NOT NULL DEFAULT 'reminder',
  is_read     BOOLEAN NOT NULL DEFAULT false,
  action_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ============================================================
-- AI DOUBT SESSIONS
-- ============================================================

CREATE TABLE public.doubt_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_text    TEXT NOT NULL,
  image_url        TEXT,
  subject          TEXT,
  chapter          TEXT,
  ai_response      TEXT NOT NULL DEFAULT '',
  related_concepts TEXT[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doubts_student ON public.doubt_sessions(student_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, role, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.chapter_notes
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_units    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_notes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_fences        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_sessions    ENABLE ROW LEVEL SECURITY;

-- Helper: get role from JWT
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role',
    (SELECT role::text FROM public.users WHERE id = auth.uid())
  )
$$;

-- ---- users ----
CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT USING (public.current_user_role() = 'admin');

-- ---- students ----
CREATE POLICY "Student can view own profile"
  ON public.students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Student can update own profile"
  ON public.students FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Student can insert own profile"
  ON public.students FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Parents can view linked student"
  ON public.students FOR SELECT USING (
    id IN (SELECT student_id FROM public.parents WHERE user_id = auth.uid())
  );
CREATE POLICY "Admins can view all students"
  ON public.students FOR ALL USING (public.current_user_role() = 'admin');

-- ---- parents ----
CREATE POLICY "Parent can view own profile"
  ON public.parents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Parent can insert own profile"
  ON public.parents FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Parent can update own profile"
  ON public.parents FOR UPDATE USING (user_id = auth.uid());

-- ---- syllabus (read-only for students/parents) ----
CREATE POLICY "Anyone authenticated can view syllabus subjects"
  ON public.syllabus_subjects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone authenticated can view syllabus units"
  ON public.syllabus_units FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone authenticated can view syllabus chapters"
  ON public.syllabus_chapters FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage syllabus"
  ON public.syllabus_subjects FOR ALL USING (public.current_user_role() = 'admin');
CREATE POLICY "Admins can manage units"
  ON public.syllabus_units FOR ALL USING (public.current_user_role() = 'admin');
CREATE POLICY "Admins can manage chapters"
  ON public.syllabus_chapters FOR ALL USING (public.current_user_role() = 'admin');

-- ---- questions ----
CREATE POLICY "Authenticated users can view questions"
  ON public.questions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL USING (public.current_user_role() = 'admin');

-- ---- tests ----
CREATE POLICY "Authenticated users can view published tests"
  ON public.tests FOR SELECT USING (auth.uid() IS NOT NULL AND is_published = true);
CREATE POLICY "Admins can manage all tests"
  ON public.tests FOR ALL USING (public.current_user_role() = 'admin');

-- ---- test_attempts ----
CREATE POLICY "Students can view own attempts"
  ON public.test_attempts FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert own attempts"
  ON public.test_attempts FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own attempts"
  ON public.test_attempts FOR UPDATE USING (student_id = auth.uid());
CREATE POLICY "Parents can view linked student attempts"
  ON public.test_attempts FOR SELECT USING (
    student_id IN (
      SELECT s.user_id FROM public.students s
      JOIN public.parents p ON p.student_id = s.id
      WHERE p.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all attempts"
  ON public.test_attempts FOR SELECT USING (public.current_user_role() = 'admin');

-- ---- chapter_notes ----
CREATE POLICY "Students own their notes"
  ON public.chapter_notes FOR ALL USING (student_id = auth.uid());

-- ---- revision_logs ----
CREATE POLICY "Students own their revision logs"
  ON public.revision_logs FOR ALL USING (student_id = auth.uid());

-- ---- study_sessions ----
CREATE POLICY "Students own their sessions"
  ON public.study_sessions FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Parents can view linked student sessions"
  ON public.study_sessions FOR SELECT USING (
    student_id IN (
      SELECT s.user_id FROM public.students s
      JOIN public.parents p ON p.student_id = s.id
      WHERE p.user_id = auth.uid()
    )
  );

-- ---- student_locations ----
CREATE POLICY "Students can insert own location"
  ON public.student_locations FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can view own location"
  ON public.student_locations FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Parents can view linked student location"
  ON public.student_locations FOR SELECT USING (
    student_id IN (
      SELECT s.user_id FROM public.students s
      JOIN public.parents p ON p.student_id = s.id
      WHERE p.user_id = auth.uid()
    )
  );

-- ---- geo_fences ----
CREATE POLICY "Students manage own fences"
  ON public.geo_fences FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Parents can view linked fences"
  ON public.geo_fences FOR SELECT USING (
    student_id IN (
      SELECT s.user_id FROM public.students s
      JOIN public.parents p ON p.student_id = s.id
      WHERE p.user_id = auth.uid()
    )
  );

-- ---- mood_logs ----
CREATE POLICY "Students own their mood logs"
  ON public.mood_logs FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Parents can view linked mood"
  ON public.mood_logs FOR SELECT USING (
    student_id IN (
      SELECT s.user_id FROM public.students s
      JOIN public.parents p ON p.student_id = s.id
      WHERE p.user_id = auth.uid()
    )
  );

-- ---- notifications ----
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- ---- doubt_sessions ----
CREATE POLICY "Students own their doubts"
  ON public.doubt_sessions FOR ALL USING (student_id = auth.uid());

-- ============================================================
-- SEED DATA — Syllabus Subjects
-- ============================================================
INSERT INTO public.syllabus_subjects (name, exam_type, color, icon) VALUES
  ('Physics',     '{NEET,JEE_MAIN,JEE_ADVANCED}', '#2b7fff', 'atom'),
  ('Chemistry',   '{NEET,JEE_MAIN,JEE_ADVANCED}', '#00f5a0', 'flask'),
  ('Biology',     '{NEET}',                        '#8b5cf6', 'dna'),
  ('Mathematics', '{JEE_MAIN,JEE_ADVANCED}',       '#ff6b35', 'calculator')
ON CONFLICT DO NOTHING;

-- ============================================================
-- END OF SCHEMA
-- ============================================================

