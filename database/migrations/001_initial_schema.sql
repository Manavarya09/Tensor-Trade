-- TensorTrade Database Schema
-- Version: 1.0.0
-- Date: February 14, 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
    shariah_mode BOOLEAN DEFAULT false,
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    risk_tolerance VARCHAR(20) DEFAULT 'moderate' CHECK (risk_tolerance IN ('low', 'moderate', 'high')),
    notification_channels JSONB DEFAULT '["email"]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- ============================================================================
-- PORTFOLIO & TRADES
-- ============================================================================

CREATE TABLE portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(15, 6) NOT NULL,
    avg_cost DECIMAL(15, 2) NOT NULL,
    current_price DECIMAL(15, 2),
    sector VARCHAR(100),
    shariah_score INTEGER CHECK (shariah_score >= 0 AND shariah_score <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('BUY', 'SELL')),
    quantity DECIMAL(15, 6) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    pnl DECIMAL(15, 2),
    fees DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
    notes TEXT,
    behavioral_flags JSONB,
    shariah_compliant BOOLEAN,
    timestamp TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);

-- ============================================================================
-- TRADING POLICIES
-- ============================================================================

CREATE TABLE trading_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('loss_limit', 'trade_frequency', 'position_size', 'custom')),
    threshold DECIMAL(15, 2),
    action VARCHAR(20) NOT NULL CHECK (action IN ('alert', 'lock', 'auto_close')),
    rules JSONB,
    active BOOLEAN DEFAULT true,
    violations INTEGER DEFAULT 0,
    last_triggered TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE policy_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES trading_policies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    violation_type VARCHAR(50),
    threshold_value DECIMAL(15, 2),
    actual_value DECIMAL(15, 2),
    action_taken VARCHAR(20),
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- VOICE AGENT & CALLING
-- ============================================================================

CREATE TABLE calling_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    cron VARCHAR(100) NOT NULL,
    schedule_description VARCHAR(255),
    content_type VARCHAR(50) DEFAULT 'market_update' CHECK (content_type IN ('market_update', 'portfolio_review', 'custom')),
    language VARCHAR(5) DEFAULT 'en',
    active BOOLEAN DEFAULT true,
    next_call TIMESTAMP,
    last_call TIMESTAMP,
    total_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE call_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES calling_schedules(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    duration_seconds INTEGER,
    transcript TEXT,
    summary TEXT,
    user_questions JSONB,
    ai_responses JSONB,
    status VARCHAR(20) CHECK (status IN ('completed', 'failed', 'no_answer', 'busy')),
    twilio_call_sid VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- AGENT FEEDBACK & LEARNING
-- ============================================================================

CREATE TABLE agent_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id VARCHAR(100),
    agent_name VARCHAR(50) NOT NULL,
    prediction JSONB NOT NULL,
    actual_outcome JSONB,
    accuracy_score DECIMAL(5,2),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    helpful BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(50) NOT NULL,
    week_start DATE NOT NULL,
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2),
    avg_confidence DECIMAL(5,2),
    avg_user_rating DECIMAL(3,2),
    model_weights JSONB,
    prompt_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(agent_name, week_start)
);

-- ============================================================================
-- IPO CALENDAR
-- ============================================================================

CREATE TABLE ipo_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    ticker VARCHAR(20),
    exchange VARCHAR(50) NOT NULL,
    ipo_date DATE NOT NULL,
    price_range_low DECIMAL(10,2),
    price_range_high DECIMAL(10,2),
    final_price DECIMAL(10,2),
    sector VARCHAR(100),
    country VARCHAR(50),
    shariah_compliant BOOLEAN,
    shariah_score INTEGER CHECK (shariah_score >= 0 AND shariah_score <= 100),
    shariah_reasoning TEXT,
    market_cap_estimate BIGINT,
    description TEXT,
    prospectus_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ipo_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ipo_id UUID REFERENCES ipo_listings(id) ON DELETE CASCADE,
    alert_sent BOOLEAN DEFAULT false,
    alert_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, ipo_id)
);

-- ============================================================================
-- TRADE JOURNAL
-- ============================================================================

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
    entry_type VARCHAR(20) CHECK (entry_type IN ('pre_trade', 'post_trade', 'reflection', 'lesson')),
    title VARCHAR(200),
    content TEXT NOT NULL,
    mood VARCHAR(20),
    tags JSONB,
    ai_insights TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & METRICS
-- ============================================================================

CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    total_pnl DECIMAL(15, 2) DEFAULT 0,
    largest_win DECIMAL(15, 2),
    largest_loss DECIMAL(15, 2),
    risk_score INTEGER,
    behavioral_flags JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE TABLE shariah_screening_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL UNIQUE,
    compliant BOOLEAN NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    breakdown JSONB NOT NULL,
    reasoning TEXT,
    last_updated TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

-- ============================================================================
-- API USAGE & BILLING
-- ============================================================================

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    permissions JSONB DEFAULT '["read"]'::jsonb,
    rate_limit INTEGER DEFAULT 1000,
    active BOOLEAN DEFAULT true,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10),
    status_code INTEGER,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    cost DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);

-- Portfolio
CREATE INDEX idx_portfolio_user ON portfolio(user_id);
CREATE INDEX idx_portfolio_symbol ON portfolio(symbol);

-- Trades
CREATE INDEX idx_trades_user_symbol ON trades(user_id, symbol);
CREATE INDEX idx_trades_timestamp ON trades(timestamp DESC);
CREATE INDEX idx_trades_status ON trades(status);

-- Policies
CREATE INDEX idx_policies_user ON trading_policies(user_id);
CREATE INDEX idx_policies_active ON trading_policies(active) WHERE active = true;

-- Calling
CREATE INDEX idx_schedules_user ON calling_schedules(user_id);
CREATE INDEX idx_schedules_next_call ON calling_schedules(next_call) WHERE active = true;
CREATE INDEX idx_call_history_user ON call_history(user_id);

-- Feedback
CREATE INDEX idx_feedback_analysis ON agent_feedback(analysis_id);
CREATE INDEX idx_feedback_agent ON agent_feedback(agent_name);

-- IPO
CREATE INDEX idx_ipo_date ON ipo_listings(ipo_date);
CREATE INDEX idx_ipo_shariah ON ipo_listings(shariah_compliant) WHERE shariah_compliant = true;
CREATE INDEX idx_ipo_exchange ON ipo_listings(exchange);

-- Journal
CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_journal_date ON journal_entries(created_at DESC);

-- Metrics
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);

-- API
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_usage_user ON api_usage(user_id);
CREATE INDEX idx_api_usage_date ON api_usage(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON trading_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON calling_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ipo_updated_at BEFORE UPDATE ON ipo_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for development)
-- ============================================================================

-- Insert sample user
INSERT INTO users (email, name, phone, subscription_tier, shariah_mode)
VALUES ('demo@tensortrade.ai', 'Demo User', '+971501234567', 'pro', true);

-- Get the demo user ID
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@tensortrade.ai';
    
    -- Insert sample portfolio
    INSERT INTO portfolio (user_id, symbol, quantity, avg_cost, current_price, sector, shariah_score)
    VALUES 
        (demo_user_id, 'AAPL', 10, 175.50, 178.45, 'Technology', 95),
        (demo_user_id, 'MSFT', 5, 380.00, 395.20, 'Technology', 92),
        (demo_user_id, 'GOOGL', 8, 140.00, 138.50, 'Technology', 88);
    
    -- Insert sample policy
    INSERT INTO trading_policies (user_id, name, type, threshold, action, active)
    VALUES 
        (demo_user_id, 'Daily Loss Limit', 'loss_limit', 500, 'lock', true),
        (demo_user_id, 'Trade Frequency Cap', 'trade_frequency', 10, 'alert', true);
END $$;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Portfolio summary view
CREATE VIEW portfolio_summary AS
SELECT 
    p.user_id,
    COUNT(*) as total_assets,
    SUM(p.quantity * p.current_price) as total_value,
    SUM((p.current_price - p.avg_cost) * p.quantity) as total_pnl,
    AVG(p.shariah_score) as avg_shariah_score
FROM portfolio p
GROUP BY p.user_id;

-- Trading performance view
CREATE VIEW trading_performance AS
SELECT 
    t.user_id,
    COUNT(*) as total_trades,
    COUNT(*) FILTER (WHERE t.pnl > 0) as winning_trades,
    COUNT(*) FILTER (WHERE t.pnl < 0) as losing_trades,
    ROUND(COUNT(*) FILTER (WHERE t.pnl > 0)::numeric / COUNT(*)::numeric * 100, 2) as win_rate,
    SUM(t.pnl) as total_pnl,
    MAX(t.pnl) as largest_win,
    MIN(t.pnl) as largest_loss
FROM trades t
WHERE t.status = 'CLOSED'
GROUP BY t.user_id;

-- ============================================================================
-- GRANTS (adjust based on your user setup)
-- ============================================================================

-- Grant permissions to application user (replace 'tensortrade_app' with your user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tensortrade_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tensortrade_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO tensortrade_app;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema');
