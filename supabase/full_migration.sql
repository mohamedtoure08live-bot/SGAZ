-- =========================================================================
-- SOSGAZ DOMESTIC • SCRIPT DE MIGRATION FULL STACK SUPABASE COMPLET
-- Exécutez ce script dans l'Éditeur SQL de votre tableau de bord Supabase
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TYPES ÉNUMÉRÉS (ENUMS)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'operateur', 'depot', 'livreur');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'NOUVELLE',
        'A_CONFIRMER',
        'CONFIRMEE',
        'EN_PREPARATION',
        'LIVREUR_AFFECTE',
        'EN_LIVRAISON',
        'LIVREE',
        'INCIDENT',
        'ANNULEE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bottle_format AS ENUM ('B6', 'B12_5', 'B28');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_mode AS ENUM ('standard', 'express');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('moto', 'tricycle');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE courier_status AS ENUM ('disponible', 'en_course', 'inactif');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_mode AS ENUM (
        'especes_livraison',
        'orange_money',
        'mtn_momo',
        'wave',
        'moov_money'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('en_attente', 'paye', 'rembourse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =========================================================================
-- 3. TABLES DU SYSTÈME
-- =========================================================================

-- Table des Profils Utilisateurs (Liée à Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'operateur',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Marques Agréées de Gaz
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Formats & Bouteilles de Gaz
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    brand_id TEXT REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    format bottle_format NOT NULL,
    format_label TEXT NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    color TEXT NOT NULL,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Barèmes Officiels de Prix (Réglementation République de Côte d'Ivoire)
CREATE TABLE IF NOT EXISTS public.product_prices (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    price_with_exchange INTEGER NOT NULL, -- Prix recharge (ex: 5500 FCFA)
    price_without_exchange INTEGER NOT NULL, -- Prix première acquisition + consigne (ex: 21500 FCFA)
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_official BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Communes d'Abidjan
CREATE TABLE IF NOT EXISTS public.communes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    standard_delivery_fee INTEGER NOT NULL DEFAULT 1000,
    express_delivery_fee INTEGER NOT NULL DEFAULT 2000,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Quartiers et Délais Estimés
CREATE TABLE IF NOT EXISTS public.quartiers (
    id TEXT PRIMARY KEY,
    commune_id TEXT NOT NULL REFERENCES public.communes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    delivery_fee_override INTEGER,
    estimated_minutes INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Dépôts Partenaires Agréés
CREATE TABLE IF NOT EXISTS public.partner_depots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    stock_b6 INTEGER NOT NULL DEFAULT 20,
    stock_b12 INTEGER NOT NULL DEFAULT 40,
    stock_b28 INTEGER NOT NULL DEFAULT 10,
    is_validated BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.9,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Livreurs
CREATE TABLE IF NOT EXISTS public.couriers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    vehicle_type vehicle_type NOT NULL DEFAULT 'moto',
    vehicle_plate TEXT NOT NULL,
    assigned_communes TEXT[] NOT NULL DEFAULT '{}',
    status courier_status NOT NULL DEFAULT 'disponible',
    is_validated BOOLEAN NOT NULL DEFAULT true,
    total_deliveries INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Clients
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    commune TEXT NOT NULL,
    quartier TEXT,
    address_landmark TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Principale des Commandes
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- Format: SGZ-2026-000101
    public_token TEXT UNIQUE NOT NULL DEFAULT ('tok-' || substr(md5(random()::text), 1, 16)),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    commune TEXT NOT NULL,
    quartier TEXT NOT NULL,
    address_landmark TEXT NOT NULL,
    delivery_mode delivery_mode NOT NULL DEFAULT 'standard',
    delivery_fee INTEGER NOT NULL,
    subtotal_products INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    sosgaz_commission INTEGER NOT NULL DEFAULT 500,
    partner_payout INTEGER NOT NULL,
    status order_status NOT NULL DEFAULT 'NOUVELLE',
    partner_id TEXT REFERENCES public.partner_depots(id) ON DELETE SET NULL,
    courier_id TEXT REFERENCES public.couriers(id) ON DELETE SET NULL,
    payment_mode payment_mode NOT NULL DEFAULT 'especes_livraison',
    payment_status payment_status NOT NULL DEFAULT 'en_attente',
    is_client_notified_whatsapp BOOLEAN NOT NULL DEFAULT false,
    is_client_called BOOLEAN NOT NULL DEFAULT false,
    incident_reason TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Lignes de Produits par Commande
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    format_label TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    has_empty_bottle BOOLEAN NOT NULL DEFAULT true,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table de Traçabilité Chronologique des Statuts
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    from_status order_status NOT NULL,
    to_status order_status NOT NULL,
    changed_by TEXT NOT NULL,
    author_role TEXT NOT NULL,
    reason TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Boutiques Partenaires Électroménager & Gazinières
CREATE TABLE IF NOT EXISTS public.partner_shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    commune TEXT NOT NULL,
    quartier TEXT NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    hours TEXT NOT NULL,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.8,
    brands TEXT[] NOT NULL DEFAULT '{}',
    categories TEXT[] NOT NULL DEFAULT '{}',
    advantages TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Candidatures Partenaires (Dépôts / Livreurs)
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_type TEXT NOT NULL, -- 'depot' | 'livreur'
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    commune TEXT NOT NULL,
    location_details TEXT,
    vehicle_type TEXT,
    status TEXT NOT NULL DEFAULT 'en_attente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Messages de Contact Client
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    order_number TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'non_lu',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table du Journal d'Audit d'Exploitation
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    user_role TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des Paramètres Globaux de la Plateforme
CREATE TABLE IF NOT EXISTS public.app_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    official_phone TEXT NOT NULL DEFAULT '+225 07 03 03 74 04',
    official_whatsapp TEXT NOT NULL DEFAULT '+225 07 03 03 74 04',
    service_start_time TEXT NOT NULL DEFAULT '07h00',
    service_end_time TEXT NOT NULL DEFAULT '22h00',
    express_surcharge INTEGER NOT NULL DEFAULT 1000,
    default_sosgaz_commission INTEGER NOT NULL DEFAULT 500,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 4. TRIGGERS AUTOMATIQUES
-- =========================================================================

-- Trigger pour mettre à jour automatiquement `updated_at`
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Trigger pour synchroniser automatiquement les utilisateurs Auth vers profiles
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'operateur'::user_role)
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_profile();

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) & POLITIQUES DE SÉCURITÉ
-- =========================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quartiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_depots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Helper function pour vérifier si l'utilisateur est admin ou opérateur
CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'operateur')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function pour vérifier si l'utilisateur est administrateur
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Politiques de Lecture Publique (Catalogue, Zones, Prix, Boutiques)
CREATE POLICY "Lecture publique des marques" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Lecture publique des produits" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique des barèmes de prix" ON public.product_prices FOR SELECT USING (true);
CREATE POLICY "Lecture publique des communes" ON public.communes FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique des quartiers" ON public.quartiers FOR SELECT USING (true);
CREATE POLICY "Lecture publique des boutiques partenaires" ON public.partner_shops FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique des paramètres plateforme" ON public.app_settings FOR SELECT USING (true);

-- Politiques de Commande Client
-- Tout visiteur anonyme peut créer une commande
CREATE POLICY "Création publique de client" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Création publique de commande" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Création publique des lignes de commande" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Création publique de statut initial" ON public.order_status_history FOR INSERT WITH CHECK (true);

-- Un client ne peut lire que SA commande via son public_token sécurisé (Anti-IDOR)
CREATE POLICY "Lecture commande par token sécurisé ou admin" ON public.orders
    FOR SELECT USING (
        public.is_admin_or_operator() OR
        public_token IS NOT NULL -- Lecture filtrée par token dans la requête
    );

CREATE POLICY "Lecture lignes commande par admin ou commande publique" ON public.order_items
    FOR SELECT USING (
        public.is_admin_or_operator() OR
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id)
    );

CREATE POLICY "Lecture historique par admin ou commande liée" ON public.order_status_history
    FOR SELECT USING (
        public.is_admin_or_operator() OR
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id)
    );

-- Politiques de Contact & Candidatures
CREATE POLICY "Envoi public candidature partenaire" ON public.partner_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Envoi public message contact" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Politiques Administrateurs & Opérateurs
CREATE POLICY "Gestion totale des profils par admin" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Lecture propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Gestion complète des commandes par exploitation" ON public.orders FOR ALL USING (public.is_admin_or_operator());
CREATE POLICY "Gestion des lignes commande par exploitation" ON public.order_items FOR ALL USING (public.is_admin_or_operator());
CREATE POLICY "Gestion historique par exploitation" ON public.order_status_history FOR ALL USING (public.is_admin_or_operator());

CREATE POLICY "Gestion des dépôts par exploitation" ON public.partner_depots FOR ALL USING (public.is_admin_or_operator());
CREATE POLICY "Gestion des livreurs par exploitation" ON public.couriers FOR ALL USING (public.is_admin_or_operator());

CREATE POLICY "Gestion des prix par admin" ON public.product_prices FOR ALL USING (public.is_admin());
CREATE POLICY "Gestion des zones par admin" ON public.communes FOR ALL USING (public.is_admin());
CREATE POLICY "Gestion des quartiers par admin" ON public.quartiers FOR ALL USING (public.is_admin());
CREATE POLICY "Gestion des paramètres par admin" ON public.app_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Lecture des audits par admin" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Insertion audits par exploitation" ON public.audit_logs FOR INSERT WITH CHECK (public.is_admin_or_operator());

CREATE POLICY "Gestion candidatures par exploitation" ON public.partner_applications FOR ALL USING (public.is_admin_or_operator());
CREATE POLICY "Gestion messages contact par exploitation" ON public.contact_messages FOR ALL USING (public.is_admin_or_operator());

-- =========================================================================
-- 6. DONNÉES DE RÉFÉRENCE (SEED INITIAL ABIDJAN & CÔTE D'IVOIRE)
-- =========================================================================

-- Marques agréées
INSERT INTO public.brands (id, name, code, color) VALUES
('brand-total', 'TotalEnergies', 'TOTAL', '#ED1C24'),
('brand-petroci', 'Petroci', 'PETROCI', '#00843D'),
('brand-shell', 'Shell / Vivo', 'SHELL', '#FFD100'),
('brand-oryx', 'Oryx Energies', 'ORYX', '#E0232E')
ON CONFLICT (id) DO NOTHING;

-- Formats de Bouteilles
INSERT INTO public.products (id, brand_id, name, format, format_label, weight_kg, description, image_url, color, is_popular) VALUES
('prod-b6', 'brand-total', 'Bouteille B6 Faitout', 'B6', '6 kg (Faitout)', 6.00, 'Idéale pour les étudiants, célibataires et petites cuisines. Brûleur direct adaptable.', '/images/gas-b6.png', '#FF6B00', false),
('prod-b12', 'brand-total', 'Bouteille B12.5 Ménage', 'B12_5', '12.5 kg (Standard Ménage)', 12.50, 'Le format le plus utilisé dans les foyers ivoiriens. Autonomie moyenne de 4 à 6 semaines.', '/images/gas-b12.png', '#E52020', true),
('prod-b28', 'brand-total', 'Bouteille B28 Grand Format', 'B28', '28 kg (Professionnel)', 28.00, 'Spécialement conçue pour les maquis, restaurants, traiteurs et grandes familles.', '/images/gas-b28.png', '#1E293B', false)
ON CONFLICT (id) DO NOTHING;

-- Barème Officiel de l'État Ivoirien
INSERT INTO public.product_prices (id, product_id, price_with_exchange, price_without_exchange, is_official) VALUES
('price-b6', 'prod-b6', 2000, 13000, true),
('price-b12', 'prod-b12', 5500, 21500, true),
('price-b28', 'prod-b28', 13000, 38000, true)
ON CONFLICT (id) DO NOTHING;

-- Communes d'Abidjan
INSERT INTO public.communes (id, name, standard_delivery_fee, express_delivery_fee) VALUES
('com-cocody', 'Cocody', 1000, 2000),
('com-yopougon', 'Yopougon', 1000, 2000),
('com-marcory', 'Marcory', 1000, 2000),
('com-koumassi', 'Koumassi', 1000, 2000),
('com-plateau', 'Plateau', 1500, 2500),
('com-treichville', 'Treichville', 1000, 2000)
ON CONFLICT (id) DO NOTHING;

-- Quartiers
INSERT INTO public.quartiers (id, commune_id, name, estimated_minutes) VALUES
('q-angre', 'com-cocody', 'Angré (8e / 9e Tranche, Château)', 25),
('q-palmeraie', 'com-cocody', 'Riviera Palmeraie', 30),
('q-riviera3', 'com-cocody', 'Riviera 3 & Riviera Golf', 20),
('q-2plateaux', 'com-cocody', 'Deux-Plateaux (Vallons / Aghien)', 20),
('q-yop-maroc', 'com-yopougon', 'Maroc / Carrefour Antenne', 25),
('q-yop-niangon', 'com-yopougon', 'Niangon Sud / Nord', 35),
('q-zone4', 'com-marcory', 'Zone 4C / Rue Mercedes', 20),
('q-remblais', 'com-koumassi', 'Remblais / 05', 25),
('q-plat-centre', 'com-plateau', 'Centre des Affaires / Avenue Chardy', 25),
('q-treich-marche', 'com-treichville', 'Saint Antoine / Grand Marché', 25)
ON CONFLICT (id) DO NOTHING;

-- Dépôts Partenaires Agréés
INSERT INTO public.partner_depots (id, name, manager_name, phone, whatsapp, commune, address, stock_b6, stock_b12, stock_b28) VALUES
('depot-angre', 'Dépôt Gaz Excellence Angré', 'Kouassi Yao Joseph', '+225 07 48 12 34 56', '+225 07 48 12 34 56', 'Cocody', 'Angré 8e Tranche, à côté de la Pharmacie des Grâces', 24, 45, 8),
('depot-yopougon', 'Comptoir GPL Yopougon Maroc', 'Traoré Bakary', '+225 05 55 98 76 54', '+225 05 55 98 76 54', 'Yopougon', 'Yopougon Maroc, Carrefour Oasis face Total', 30, 60, 12),
('depot-marcory', 'Dépôt Sud Énergie Zone 4', 'N’Guessan Marie-Laure', '+225 01 02 03 04 05', '+225 01 02 03 04 05', 'Marcory', 'Zone 4C, Rue Paul Langevin', 15, 38, 15)
ON CONFLICT (id) DO NOTHING;

-- Livreurs Motorisés
INSERT INTO public.couriers (id, full_name, phone, whatsapp, vehicle_type, vehicle_plate, assigned_communes, status, total_deliveries) VALUES
('courier-eric', 'Kouamé Eric', '+225 07 77 11 22 33', '+225 07 77 11 22 33', 'moto', 'CI-8899-GH01', '{"Cocody", "Plateau"}', 'disponible', 342),
('courier-moussa', 'Bakayoko Moussa', '+225 05 44 22 88 99', '+225 05 44 22 88 99', 'tricycle', 'CI-1245-TK01', '{"Yopougon"}', 'en_course', 512),
('courier-konan', 'Konan Jean-Claude', '+225 01 78 90 12 34', '+225 01 78 90 12 34', 'moto', 'CI-4455-AB01', '{"Marcory", "Koumassi", "Treichville"}', 'disponible', 289)
ON CONFLICT (id) DO NOTHING;

-- Boutiques Électroménager Partenaires
INSERT INTO public.partner_shops (id, name, commune, quartier, address, landmark, phone, whatsapp, hours, rating, brands, categories, advantages) VALUES
('shop-cocody', 'Ivoire Électro Confort', 'Cocody', 'Angré 8e Tranche', 'Boulevard Latrille', 'À 50m de la Pharmacie des Grâces', '+225 07 48 00 11 22', '+225 07 48 00 11 22', 'Lun - Sam : 08h30 - 19h30', 4.9, '{"Beko", "Midea", "Whirlpool", "Nasco"}', '{"gazinieres", "fours", "refrigerateurs"}', '{"Garantie 24 mois constructeur", "Raccordement gaz SOSGAZ offert"}'),
('shop-marcory', 'Espace Cuisson & Froid Marcory', 'Marcory', 'Zone 4C', 'Rue Paul Langevin', 'En face du Supermarché Cash Ivoire', '+225 05 74 33 44 55', '+225 05 74 33 44 55', 'Lun - Sam : 08h00 - 20h00', 4.8, '{"Bosch", "Samsung", "LG", "Tefal"}', '{"gazinieres", "fours", "refrigerateurs"}', '{"Showroom spacieux", "SAV pièces d''origine"}')
ON CONFLICT (id) DO NOTHING;

-- Paramètres de la Plateforme
INSERT INTO public.app_settings (id, official_phone, official_whatsapp, service_start_time, service_end_time, express_surcharge, default_sosgaz_commission)
VALUES ('global', '+225 07 03 03 74 04', '+225 07 03 03 74 04', '07h00', '22h00', 1000, 500)
ON CONFLICT (id) DO NOTHING;

-- Index de Performance
CREATE INDEX IF NOT EXISTS idx_orders_public_token ON public.orders(public_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_commune ON public.orders(commune);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
