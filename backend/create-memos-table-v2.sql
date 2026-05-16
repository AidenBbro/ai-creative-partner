-- =============================================
-- 创建 memos 表（修复版本 - 兼容现有数据库）
-- =============================================

-- 1. 创建 memos 表（不使用外键约束，因为 users 表的 id 可能是 integer 类型）
CREATE TABLE IF NOT EXISTS public.memos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON public.memos(user_id);
CREATE INDEX IF NOT EXISTS idx_memos_status ON public.memos(status);

-- 3. 启用 RLS（行级安全策略）
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略（允许所有操作）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_select_all') THEN
        CREATE POLICY "memos_select_all" ON public.memos FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_insert_all') THEN
        CREATE POLICY "memos_insert_all" ON public.memos FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_update_all') THEN
        CREATE POLICY "memos_update_all" ON public.memos FOR UPDATE USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memos' AND policyname = 'memos_delete_all') THEN
        CREATE POLICY "memos_delete_all" ON public.memos FOR DELETE USING (true);
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
