-- 创建测试用户（如果不存在）
-- 这个用户用于普通用户账号 123/456

INSERT INTO public.users (id, username, email, password)
VALUES ('1', '测试用户', 'test@example.com', '$2a$10$dummy')
ON CONFLICT (id) DO NOTHING;

-- 创建管理员用户（如果不存在）
INSERT INTO public.users (id, username, email, password)
VALUES ('admin-1', '管理员', 'admin@example.com', '$2a$10$dummy')
ON CONFLICT (id) DO NOTHING;

-- 验证用户是否创建成功
SELECT 
    id,
    username,
    '✅ 用户已创建' as status
FROM public.users
WHERE id IN ('1', 'admin-1');
