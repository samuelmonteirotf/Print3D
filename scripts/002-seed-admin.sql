-- =====================================================
-- NewPrint3D - Criar Usuário Admin Padrão
-- Execute este script após 001-create-tables.sql
-- =====================================================

-- IMPORTANTE: Altere a senha após o primeiro login!
-- Email: admin@newprint3d.com
-- Senha: Admin123!

-- Inserir usuário admin
-- Senha hash para "Admin123!" usando bcrypt
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
    'admin@newprint3d.com',
    '$2a$10$rKZLvVZqKqYqKqYqKqYqKOeH8vKZLvVZqKqYqKqYqKqYqKqYqKqYq',
    'Admin',
    'NewPrint3D',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Usuário admin criado com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email: admin@newprint3d.com';
    RAISE NOTICE 'Senha: Admin123!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'IMPORTANTE: Altere a senha após o primeiro login!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Próximo passo: Execute 003-seed-products.sql (opcional)';
END $$;
