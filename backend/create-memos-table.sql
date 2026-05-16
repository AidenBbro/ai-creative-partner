-- =============================================
-- 创建 memos 表（如果不存在）
-- =============================================

-- 1. 创建 memos 表
CREATE TABLE IF NOT EXISTS public.memos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON public.memos(user_id);
CREATE INDEX IF NOT EXISTS idx_memos_status ON public.memos(status);

-- 3. 启用 RLS
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
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

-- 5. 验证表是否创建成功
SELECT 
    table_name,
    '✅ 表已创建' as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'memos';
