-- 青少年编程天赋测评系统 数据库 Schema
-- 爱创发明定制版
-- SQLite 版本（better-sqlite3 兼容）

PRAGMA encoding = 'UTF-8';
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- 1. 题目表
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id TEXT UNIQUE NOT NULL,
    grade_level INTEGER NOT NULL,
    dimension TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    question_type TEXT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    option_e TEXT,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    score_c INTEGER DEFAULT 0,
    score_d INTEGER DEFAULT 0,
    score_e INTEGER DEFAULT 0,
    explanation TEXT,
    tags TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_questions_grade_dim ON questions(grade_level, dimension);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- 2. 测评记录表
CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_no TEXT UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    gender TEXT,
    birth_date TEXT,
    grade_level INTEGER NOT NULL,
    has_programming_exp INTEGER DEFAULT 0,
    programming_exp_desc TEXT,
    start_time TEXT DEFAULT (datetime('now')),
    end_time TEXT,
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT 'started',
    logic_score REAL DEFAULT 0,
    creativity_score REAL DEFAULT 0,
    concept_score REAL DEFAULT 0,
    focus_score REAL DEFAULT 0,
    collaboration_score REAL DEFAULT 0,
    total_score REAL DEFAULT 0,
    report_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_assessments_no ON assessments(assessment_no);
CREATE INDEX IF NOT EXISTS idx_assessments_grade_status ON assessments(grade_level, status);
CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at);

-- 3. 答题详情表
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option TEXT,
    score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(assessment_id, question_id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_answers_assessment ON answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);

-- 4. 结果解读表
CREATE TABLE IF NOT EXISTS result_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dimension TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    score_range_start REAL NOT NULL,
    score_range_end REAL NOT NULL,
    level TEXT NOT NULL,
    interpretation TEXT NOT NULL,
    suggestions TEXT,
    course_recommendations TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(dimension, grade_level, score_range_start, score_range_end)
);

CREATE INDEX IF NOT EXISTS idx_interpretations_dim_grade ON result_interpretations(dimension, grade_level);

-- 5. 课程推荐表
CREATE TABLE IF NOT EXISTS course_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    category TEXT NOT NULL,
    suitable_grade INTEGER NOT NULL,
    suitable_dimensions TEXT,
    description TEXT,
    features TEXT,
    outcomes TEXT,
    duration INTEGER,
    price REAL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_courses_category_grade ON course_recommendations(category, suitable_grade);
CREATE INDEX IF NOT EXISTS idx_courses_active ON course_recommendations(is_active);

-- 6. 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 插入默认配置
INSERT OR IGNORE INTO system_config (config_key, config_value, description) VALUES
('site_name', '爱创发明 - 青少年编程天赋测评', '站点名称'),
('logo_url', '/images/logo.png', 'Logo URL'),
('primary_color', '#FF6B35', '主题色（橙）'),
('secondary_color', '#4ECDC4', '辅助色（青）'),
('questions_per_assessment', '10', '每次测评题目数'),
('time_limit', '1800', '测评时间限制（秒）'),
('pass_score', '60', '通过分数');

-- 插入样例题目（1-3年级）
INSERT OR IGNORE INTO questions (question_id, grade_level, dimension, difficulty, question_type, question_text, option_a, option_b, option_c, option_d, score_a, score_b, score_c, score_d, explanation, tags) VALUES
('Q1_G1_01', 1, 'logic', 2, 'choice', '小猫想从A点走到B点，下面哪条路最近？', '路1：直线', '路2：弯弯曲曲的路', '路3：绕远路', '都一样近', 4, 2, 1, 0, '直线距离最短，这是几何基本概念', '空间思维,基础逻辑'),
('Q2_G1_02', 1, 'creativity', 2, 'scenario', '如果你可以设计自己的机器人，你希望它有什么功能？', '帮我写作业', '陪我玩，讲故事', '帮我打扫房间', '以上都可以', 2, 3, 2, 4, '创意没有标准答案，但要考虑实用性和可行性', '想象力,设计思维'),
('Q3_G1_03', 1, 'concept', 1, 'choice', '编程是什么？', '玩游戏', '用电脑命令让机器做事', '看电视', '画画', 0, 4, 0, 1, '编程是编写指令让计算机执行任务的过程', '基础概念'),
('Q4_G1_04', 1, 'focus', 2, 'practical', '你能坚持完成一个困难的拼图吗？', '马上就放弃', '试试看，不行就放弃', '坚持完成', '找人帮忙', 0, 2, 4, 2, '专注力和毅力是编程学习的重要品质', '毅力,专注'),
('Q5_G1_05', 1, 'collaboration', 2, 'scenario', '小组做项目时，你愿意？', '自己单独做', '和大家一起讨论', '让他人做得多', '随便', 1, 4, 2, 0, '团队协作需要沟通和分工', '沟通,合作');

-- 插入结果解读数据
INSERT OR IGNORE INTO result_interpretations (dimension, grade_level, score_range_start, score_range_end, level, interpretation, suggestions, course_recommendations) VALUES
('logic', 1, 0, 40, '待提高', '逻辑思维还在发展中，需要通过游戏和简单练习培养。', '建议从简单的分类、排序游戏开始，培养基础逻辑感。', '["乐高建构", "逻辑思维启蒙"]'),
('logic', 1, 40, 70, '中等', '具备基础逻辑思维能力，可以开始系统学习。', '通过编程游戏和图形化编程培养逻辑思维能力。', '["ScratchJR", "逻辑思维训练"]'),
('logic', 1, 70, 101, '优秀', '逻辑思维能力突出，具备良好的问题分析能力。', '可以继续深入学习，尝试更复杂的编程项目和逻辑挑战。', '["Scratch编程", "机器人入门"]');

-- 插入课程推荐数据
INSERT OR IGNORE INTO course_recommendations (course_code, course_name, category, suitable_grade, suitable_dimensions, description, features, outcomes, duration, price) VALUES
('LEGO_001', '乐高建构启蒙', 'lego', 1, 'logic,creativity,focus', '通过乐高积木搭建，培养空间思维和创造力', '["动手实践", "创意搭建", "团队合作"]', '["空间想象力", "动手能力", "逻辑思维"]', 16, 1280.00),
('SCRATCH_001', 'ScratchJR动画编程', 'programming', 1, 'logic,creativity,concept', '使用ScratchJR创作互动故事和游戏', '["图形化编程", "故事创作", "逻辑序列"]', '["基础编程概念", "创意表达", "逻辑思考"]', 24, 1680.00),
('ROBOT_001', '机器人入门', 'robot', 2, 'logic,creativity,focus,collaboration', '学习机器人搭建和基础编程控制', '["LEGO EV3", "传感器应用", "任务挑战"]', '["工程思维", "编程逻辑", "问题解决"]', 32, 2380.00);
