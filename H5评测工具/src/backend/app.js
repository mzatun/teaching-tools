const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '../database/db.json');

// 中间件
app.use(cors()); // 允许跨域（支持 file:// 协议直接访问 API）
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== 数据库操作封装（纯 fs，零依赖）=====
function readDB() {
    try {
        if (!fs.existsSync(DB_PATH)) writeDB(getDefaultDB());
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
        console.error('读取数据库失败:', e.message);
        return getDefaultDB();
    }
}

function writeDB(data) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getDefaultDB() {
    return { questions: [], assessments: [], answers: [], result_interpretations: [], course_recommendations: [], system_config: [] };
}

function initDB() {
    // 确保文件存在
    if (!fs.existsSync(DB_PATH)) writeDB(getDefaultDB());
    const data = readDB();
    let changed = false;

    if (!Array.isArray(data.system_config) || data.system_config.length === 0) {
        data.system_config = [
            { id: 1, config_key: 'site_name', config_value: '爱创发明 - 青少年编程天赋测评', description: '站点名称' },
            { id: 2, config_key: 'logo_url', config_value: '/images/logo.png', description: 'Logo URL' },
            { id: 3, config_key: 'primary_color', config_value: '#FF6B35', description: '主题色（橙）' },
            { id: 4, config_key: 'secondary_color', config_value: '#4ECDC4', description: '辅助色（青）' },
            { id: 5, config_key: 'questions_per_assessment', config_value: '10', description: '每次测评题目数' },
            { id: 6, config_key: 'time_limit', config_value: '1800', description: '测评时间限制（秒）' },
            { id: 7, config_key: 'pass_score', config_value: '60', description: '通过分数' }
        ];
        changed = true;
    }

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
        data.questions = [
            { id: 1, question_id: 'Q1_G1_01', grade_level: 1, dimension: 'logic', difficulty: 2, question_type: 'choice', question_text: '小猫想从A点走到B点，下面哪条路最近？', option_a: '路1：直线', option_b: '路2：弯弯曲曲的路', option_c: '路3：绕远路', option_d: '都一样近', option_e: '', score_a: 4, score_b: 2, score_c: 1, score_d: 0, score_e: 0, explanation: '直线距离最短，这是几何基本概念', tags: '空间思维,基础逻辑', is_active: 1 },
            { id: 2, question_id: 'Q2_G1_02', grade_level: 1, dimension: 'creativity', difficulty: 2, question_type: 'scenario', question_text: '如果你可以设计自己的机器人，你希望它有什么功能？', option_a: '帮我写作业', option_b: '陪我玩，讲故事', option_c: '帮我打扫房间', option_d: '以上都可以', option_e: '', score_a: 2, score_b: 3, score_c: 2, score_d: 4, score_e: 0, explanation: '创意没有标准答案，但要考虑实用性和可行性', tags: '想象力,设计思维', is_active: 1 },
            { id: 3, question_id: 'Q3_G1_03', grade_level: 1, dimension: 'concept', difficulty: 1, question_type: 'choice', question_text: '编程是什么？', option_a: '玩游戏', option_b: '用电脑命令让机器做事', option_c: '看电视', option_d: '画画', option_e: '', score_a: 0, score_b: 4, score_c: 0, score_d: 1, score_e: 0, explanation: '编程是编写指令让计算机执行任务的过程', tags: '基础概念', is_active: 1 },
            { id: 4, question_id: 'Q4_G1_04', grade_level: 1, dimension: 'focus', difficulty: 2, question_type: 'practical', question_text: '你能坚持完成一个困难的拼图吗？', option_a: '马上就放弃', option_b: '试试看，不行就放弃', option_c: '坚持完成', option_d: '找人帮忙', option_e: '', score_a: 0, score_b: 2, score_c: 4, score_d: 2, score_e: 0, explanation: '专注力和毅力是编程学习的重要品质', tags: '毅力,专注', is_active: 1 },
            { id: 5, question_id: 'Q5_G1_05', grade_level: 1, dimension: 'collaboration', difficulty: 2, question_type: 'scenario', question_text: '小组做项目时，你愿意？', option_a: '自己单独做', option_b: '和大家一起讨论', option_c: '让他人做得多', option_d: '随便', option_e: '', score_a: 1, score_b: 4, score_c: 2, score_d: 0, score_e: 0, explanation: '团队协作需要沟通和分工', tags: '沟通,合作', is_active: 1 }
        ];
        changed = true;
    }

    if (!Array.isArray(data.result_interpretations) || data.result_interpretations.length === 0) {
        data.result_interpretations = [
            { id: 1, dimension: 'logic', grade_level: 1, score_range_start: 0, score_range_end: 40, level: '待提高', interpretation: '逻辑思维还在发展中，需要通过游戏和简单练习培养。', suggestions: '建议从简单的分类、排序游戏开始，培养基础逻辑感。', course_recommendations: '["乐高建构", "逻辑思维启蒙"]' },
            { id: 2, dimension: 'logic', grade_level: 1, score_range_start: 40, score_range_end: 70, level: '中等', interpretation: '具备基础逻辑思维能力，可以开始系统学习。', suggestions: '通过编程游戏和图形化编程培养逻辑思维能力。', course_recommendations: '["ScratchJR", "逻辑思维训练"]' },
            { id: 3, dimension: 'logic', grade_level: 1, score_range_start: 70, score_range_end: 101, level: '优秀', interpretation: '逻辑思维能力突出，具备良好的问题分析能力。', suggestions: '可以继续深入学习，尝试更复杂的编程项目和逻辑挑战。', course_recommendations: '["Scratch编程", "机器人入门"]' }
        ];
        changed = true;
    }

    if (!Array.isArray(data.course_recommendations) || data.course_recommendations.length === 0) {
        data.course_recommendations = [
            { id: 1, course_code: 'LEGO_001', course_name: '乐高建构启蒙', category: 'lego', suitable_grade: 1, suitable_dimensions: 'logic,creativity,focus', description: '通过乐高积木搭建，培养空间思维和创造力', features: '["动手实践", "创意搭建", "团队合作"]', outcomes: '["空间想象力", "动手能力", "逻辑思维"]', duration: 16, price: 1280.00, is_active: 1 },
            { id: 2, course_code: 'SCRATCH_001', course_name: 'ScratchJR动画编程', category: 'programming', suitable_grade: 1, suitable_dimensions: 'logic,creativity,concept', description: '使用ScratchJR创作互动故事和游戏', features: '["图形化编程", "故事创作", "逻辑序列"]', outcomes: '["基础编程概念", "创意表达", "逻辑思考"]', duration: 24, price: 1680.00, is_active: 1 },
            { id: 3, course_code: 'ROBOT_001', course_name: '机器人入门', category: 'robot', suitable_grade: 2, suitable_dimensions: 'logic,creativity,focus,collaboration', description: '学习机器人搭建和基础编程控制', features: '["LEGO EV3", "传感器应用", "任务挑战"]', outcomes: '["工程思维", "编程逻辑", "问题解决"]', duration: 32, price: 2380.00, is_active: 1 }
        ];
        changed = true;
    }

    if (changed) {
        writeDB(data);
        console.log('✅ 数据库初始数据已写入');
    }
}

// 工具：生成新ID
function nextId(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 1;
    return Math.max(...arr.map(i => i.id || 0)) + 1;
}

// 初始化
initDB();
console.log('✅ JSON数据库已就绪:', DB_PATH);

// ===== API路由 =====

// 1. 获取题目列表
app.get('/api/questions', (req, res) => {
    try {
        let data = readDB();
        let rows = (data.questions || []).filter(q => q.is_active !== 0);
        if (req.query.grade_level) rows = rows.filter(q => q.grade_level === Number(req.query.grade_level));
        if (req.query.dimension) rows = rows.filter(q => q.dimension === req.query.dimension);
        // 随机
        const limit = Number(req.query.limit) || 10;
        rows = rows.sort(() => Math.random() - 0.5).slice(0, limit);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 开始新测评
app.post('/api/assessments', (req, res) => {
    try {
        const { student_name, gender, birth_date, grade_level, has_programming_exp, programming_exp_desc } = req.body;
        if (!student_name || !grade_level) return res.status(400).json({ error: '缺少必要参数' });

        const data = readDB();
        const id = nextId(data.assessments);
        const assessment_no = 'ASMT' + Date.now() + Math.random().toString(36).substring(2, 7);
        const now = new Date().toISOString();

        const record = {
            id, assessment_no, student_name,
            gender: gender || null,
            birth_date: birth_date || null,
            grade_level: Number(grade_level),
            has_programming_exp: has_programming_exp ? 1 : 0,
            programming_exp_desc: programming_exp_desc || null,
            start_time: now, end_time: null, duration: 0,
            status: 'started', logic_score: 0, creativity_score: 0,
            concept_score: 0, focus_score: 0, collaboration_score: 0,
            total_score: 0, report_url: null,
            created_at: now, updated_at: now
        };
        data.assessments.push(record);
        writeDB(data);

        res.json({ success: true, data: { id, assessment_no, message: '测评创建成功' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 提交答案
app.post('/api/answers', (req, res) => {
    try {
        const { assessment_id, question_id, selected_option, time_spent } = req.body;
        if (!assessment_id || !question_id || !selected_option)
            return res.status(400).json({ error: '缺少必要参数' });

        const data = readDB();
        const question = (data.questions || []).find(q => q.id === Number(question_id));
        if (!question) return res.status(404).json({ error: '题目不存在' });

        const scoreKey = 'score_' + selected_option.toLowerCase();
        const score = question[scoreKey] || 0;
        const id = nextId(data.answers);

        data.answers.push({
            id, assessment_id: Number(assessment_id),
            question_id: Number(question_id),
            selected_option, score, time_spent: time_spent || 0,
            created_at: new Date().toISOString()
        });
        writeDB(data);

        res.json({ success: true, data: { id, score, message: '答案提交成功' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. 完成测评并计算得分
app.post('/api/assessments/:id/complete', (req, res) => {
    try {
        const assessment_id = Number(req.params.id);
        const data = readDB();
        const answers = (data.answers || []).filter(a => a.assessment_id === assessment_id);
        const questions = data.questions || [];

        let logic_sum = 0, creativity_sum = 0, concept_sum = 0, focus_sum = 0, collab_sum = 0;
        let logic_cnt = 0, creativity_cnt = 0, concept_cnt = 0, focus_cnt = 0, collab_cnt = 0;

        answers.forEach(a => {
            const q = questions.find(q => q.id === a.question_id);
            if (!q) return;
            const dim = q.dimension;
            if (dim === 'logic') { logic_sum += a.score; logic_cnt++; }
            else if (dim === 'creativity') { creativity_sum += a.score; creativity_cnt++; }
            else if (dim === 'concept') { concept_sum += a.score; concept_cnt++; }
            else if (dim === 'focus') { focus_sum += a.score; focus_cnt++; }
            else if (dim === 'collaboration') { collab_sum += a.score; collab_cnt++; }
        });

        const calc = (sum, cnt) => cnt > 0 ? (sum / cnt) * 25 : 0;
        const logic_score = Math.round(calc(logic_sum, logic_cnt) * 100) / 100;
        const creativity_score = Math.round(calc(creativity_sum, creativity_cnt) * 100) / 100;
        const concept_score = Math.round(calc(concept_sum, concept_cnt) * 100) / 100;
        const focus_score = Math.round(calc(focus_sum, focus_cnt) * 100) / 100;
        const collaboration_score = Math.round(calc(collab_sum, collab_cnt) * 100) / 100;
        const total_score = Math.round(((logic_score + creativity_score + concept_score + focus_score + collaboration_score) / 5) * 100) / 100;

        // 计算时长
        const assessment = (data.assessments || []).find(a => a.id === assessment_id);
        let duration = 0;
        if (assessment && assessment.start_time) {
            duration = Math.floor((Date.now() - new Date(assessment.start_time).getTime()) / 1000);
        }

        // 更新测评记录
        data.assessments = (data.assessments || []).map(a => {
            if (a.id === assessment_id) {
                return { ...a,
                    logic_score, creativity_score, concept_score, focus_score, collaboration_score,
                    total_score, status: 'completed',
                    end_time: new Date().toISOString(), duration, updated_at: new Date().toISOString()
                };
            }
            return a;
        });
        writeDB(data);

        res.json({
            success: true,
            data: {
                assessment_id,
                scores: {
                    logic: Math.round(logic_score),
                    creativity: Math.round(creativity_score),
                    concept: Math.round(concept_score),
                    focus: Math.round(focus_score),
                    collaboration: Math.round(collaboration_score),
                    total: Math.round(total_score)
                },
                duration,
                message: '测评完成，得分已计算'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. 获取测评结果和解读
app.get('/api/assessments/:id/result', (req, res) => {
    try {
        const assessment_id = Number(req.params.id);
        const data = readDB();
        const assessment = (data.assessments || []).find(a => a.id === assessment_id);
        if (!assessment) return res.status(404).json({ error: '测评记录不存在' });

        const dimensions = ['logic', 'creativity', 'concept', 'focus', 'collaboration'];
        const interpretations = {};
        dimensions.forEach(dim => {
            const score = assessment[dim + '_score'] || 0;
            const interp = (data.result_interpretations || []).find(r =>
                r.dimension === dim && r.grade_level === assessment.grade_level
                && r.score_range_start <= score && score < r.score_range_end
            );
            interpretations[dim] = interp || { level: '未知', interpretation: '暂无解读', suggestions: '' };
        });

        const courses = (data.course_recommendations || [])
            .filter(c => c.suitable_grade === assessment.grade_level && c.is_active !== 0)
            .slice(0, 3);

        res.json({ success: true, data: { assessment, interpretations, course_recommendations: courses } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. 获取系统配置
app.get('/api/config', (req, res) => {
    try {
        const data = readDB();
        const config = {};
        (data.system_config || []).forEach(r => { config[r.config_key] = r.config_value; });
        res.json({ success: true, data: config });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. 获取测评统计
app.get('/api/stats', (req, res) => {
    try {
        const data = readDB();
        const stats = {};
        (data.assessments || []).filter(a => a.status === 'completed').forEach(a => {
            const date = (a.created_at || '').substring(0, 10);
            const key = date + '|' + a.grade_level;
            if (!stats[key]) stats[key] = { date, grade_level: a.grade_level, count: 0, total: 0 };
            stats[key].count++;
            stats[key].total += a.total_score || 0;
        });
        const result = Object.values(stats).map(s => ({
            date: s.date, grade_level: s.grade_level, total_assessments: s.count,
            avg_score: Math.round(s.total / s.count * 100) / 100
        }));
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 静态页面兜底
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🚀 青少年编程天赋测评H5工具已启动');
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log('🎨 品牌: 爱创发明');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭...');
    process.exit(0);
});
