-- ==============================================================================
-- SCHEMA SUPABASE: TABELA DE BRIEFINGS E POLÍTICAS DE ACESSO (RLS)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ==============================================================================

-- 1. Cria a tabela de briefings
CREATE TABLE IF NOT EXISTS public.briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tipo_briefing TEXT NOT NULL CHECK (tipo_briefing IN ('Site', 'App')),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    empresa TEXT,
    status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'concluido', 'arquivado')),
    dados JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2. Índices para acelerar consultas e buscas no Painel Admin
CREATE INDEX IF NOT EXISTS idx_briefings_created_at ON public.briefings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_tipo ON public.briefings (tipo_briefing);
CREATE INDEX IF NOT EXISTS idx_briefings_status ON public.briefings (status);
CREATE INDEX IF NOT EXISTS idx_briefings_email ON public.briefings (email);

-- 3. Habilitar Row Level Security (RLS) para proteção máxima
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;

-- 4. Política: Qualquer visitante (anônimo) pode enviar um briefing
DROP POLICY IF EXISTS "Permitir envio público de briefings" ON public.briefings;
CREATE POLICY "Permitir envio público de briefings"
ON public.briefings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Política: Apenas usuários autenticados (você, logado no admin) podem visualizar
DROP POLICY IF EXISTS "Permitir leitura apenas para autenticados" ON public.briefings;
CREATE POLICY "Permitir leitura apenas para autenticados"
ON public.briefings
FOR SELECT
TO authenticated
USING (true);

-- 6. Política: Apenas usuários autenticados podem atualizar (mudar status, anotações)
DROP POLICY IF EXISTS "Permitir atualização apenas para autenticados" ON public.briefings;
CREATE POLICY "Permitir atualização apenas para autenticados"
ON public.briefings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Política: Apenas usuários autenticados podem deletar
DROP POLICY IF EXISTS "Permitir exclusão apenas para autenticados" ON public.briefings;
CREATE POLICY "Permitir exclusão apenas para autenticados"
ON public.briefings
FOR DELETE
TO authenticated
USING (true);
