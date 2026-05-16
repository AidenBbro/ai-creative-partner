-- =============================================
-- AI Creative Partner - Supabase 完整初始化脚本
-- =============================================
-- 项目：AI创意伙伴后端
-- 特性：零破坏性、可重复执行
-- =============================================

-- =============================================
-- 1. 扩展（Extensions）
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 2. 表结构（Tables）
-- =============================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(50),
    avatar VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    city VARCHAR(50),
    record_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallpapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    category VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallpaper_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    type VARCHAR(20) DEFAULT 'system', -- system, approval, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.memos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- =============================================
-- 3. 索引（Indexes）
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);

CREATE INDEX IF NOT EXISTS idx_ai_records_user_id ON public.ai_records(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_records_record_date ON public.ai_records(record_date);
CREATE INDEX IF NOT EXISTS idx_ai_records_city ON public.ai_records(city);
CREATE INDEX IF NOT EXISTS idx_ai_records_created_at ON public.ai_records(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_category ON public.photos(category);

CREATE INDEX IF NOT EXISTS idx_wallpapers_user_id ON public.wallpapers(user_id);
CREATE INDEX IF NOT EXISTS idx_wallpapers_category ON public.wallpapers(category);
CREATE INDEX IF NOT EXISTS idx_wallpapers_is_favorite ON public.wallpapers(is_favorite);

CREATE INDEX IF NOT EXISTS idx_wallpaper_uploads_user_id ON public.wallpaper_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_wallpaper_uploads_status ON public.wallpaper_uploads(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_memos_user_id ON public.memos(user_id);
CREATE INDEX IF NOT EXISTS idx_memos_status ON public.memos(status);

-- =============================================
-- 4. 外键约束（Foreign Keys）
-- =============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'ai_records_user_id_fkey') THEN
        ALTER TABLE public.ai_records
        ADD CONSTRAINT ai_records_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'photos_user_id_fkey') THEN
        ALTER TABLE public.photos
        ADD CONSTRAINT photos_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'wallpapers_user_id_fkey') THEN
        ALTER TABLE public.wallpapers
        ADD CONSTRAINT wallpapers_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END
$$;

-- =============================================
-- 5. 启用 RLS
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpaper_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. 创建 RLS 策略（安全方式）
-- =============================================

-- users 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_select_all') THEN
        CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_insert_all') THEN
        CREATE POLICY "users_insert_all" ON public.users FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_update_own') THEN
        CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_delete_own') THEN
        CREATE POLICY "users_delete_own" ON public.users FOR DELETE USING (true);
    END IF;
END
$$;

-- ai_records 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_records' AND policyname = 'ai_records_select_own') THEN
        CREATE POLICY "ai_records_select_own" ON public.ai_records FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_records' AND policyname = 'ai_records_insert_own') THEN
        CREATE POLICY "ai_records_insert_own" ON public.ai_records FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_records' AND policyname = 'ai_records_update_own') THEN
        CREATE POLICY "ai_records_update_own" ON public.ai_records FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_records' AND policyname = 'ai_records_delete_own') THEN
        CREATE POLICY "ai_records_delete_own" ON public.ai_records FOR DELETE USING (true);
    END IF;
END
$$;

-- photos 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'photos' AND policyname = 'photos_select_own') THEN
        CREATE POLICY "photos_select_own" ON public.photos FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'photos' AND policyname = 'photos_insert_own') THEN
        CREATE POLICY "photos_insert_own" ON public.photos FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'photos' AND policyname = 'photos_update_own') THEN
        CREATE POLICY "photos_update_own" ON public.photos FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'photos' AND policyname = 'photos_delete_own') THEN
        CREATE POLICY "photos_delete_own" ON public.photos FOR DELETE USING (true);
    END IF;
END
$$;

-- wallpapers 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpapers' AND policyname = 'wallpapers_select_own') THEN
        CREATE POLICY "wallpapers_select_own" ON public.wallpapers FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpapers' AND policyname = 'wallpapers_insert_own') THEN
        CREATE POLICY "wallpapers_insert_own" ON public.wallpapers FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpapers' AND policyname = 'wallpapers_update_own') THEN
        CREATE POLICY "wallpapers_update_own" ON public.wallpapers FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpapers' AND policyname = 'wallpapers_delete_own') THEN
        CREATE POLICY "wallpapers_delete_own" ON public.wallpapers FOR DELETE USING (true);
    END IF;
END
$$;

-- wallpaper_uploads 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpaper_uploads' AND policyname = 'wallpaper_uploads_select_own') THEN
        CREATE POLICY "wallpaper_uploads_select_own" ON public.wallpaper_uploads FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpaper_uploads' AND policyname = 'wallpaper_uploads_insert_own') THEN
        CREATE POLICY "wallpaper_uploads_insert_own" ON public.wallpaper_uploads FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpaper_uploads' AND policyname = 'wallpaper_uploads_update_own') THEN
        CREATE POLICY "wallpaper_uploads_update_own" ON public.wallpaper_uploads FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wallpaper_uploads' AND policyname = 'wallpaper_uploads_delete_own') THEN
        CREATE POLICY "wallpaper_uploads_delete_own" ON public.wallpaper_uploads FOR DELETE USING (true);
    END IF;
END
$$;

-- notifications 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_select_own') THEN
        CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_insert_own') THEN
        CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_update_own') THEN
        CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_delete_own') THEN
        CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (true);
    END IF;
END
$$;

-- memos 表策略
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_select_own') THEN
        CREATE POLICY "memos_select_own" ON public.memos FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_insert_own') THEN
        CREATE POLICY "memos_insert_own" ON public.memos FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_update_own') THEN
        CREATE POLICY "memos_update_own" ON public.memos FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_delete_own') THEN
        CREATE POLICY "memos_delete_own" ON public.memos FOR DELETE USING (true);
    END IF;
END
$$;

-- =============================================
-- 7. 验证查询
-- =============================================

SELECT 
    table_name AS "表名",
    table_type AS "类型"
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =============================================
-- ✅ 初始化完成！
-- =============================================
