// 爱创发明 - 青少年编程天赋测评H5工具 - 主交互逻辑
// 创建时间: 2026-05-05

// ===== API 基础配置 =====
// 自动检测：如果通过 http:// 访问则用相对路径，如果通过 file:// 访问则指向本地服务
const API_BASE = (window.location.protocol === 'file:')
    ? 'http://localhost:3000'
    : '';

function apiURL(path) {
    return API_BASE + path;
}

// ===== 全局变量 =====
let currentAssessment = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let answers = {};
let startTime = null;

// ===== 启动画面控制 =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showHome();
    }, 2500);
});

// ===== 页面导航 =====
function showHome() {
    hideAllPages();
    document.getElementById('home-page').classList.add('active');
}

function showAssessmentForm() {
    hideAllPages();
    document.getElementById('form-page').classList.add('active');
    
    // 监听编程经验选择
    document.querySelectorAll('input[name="exp"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const expDescGroup = document.getElementById('exp-desc-group');
            if (e.target.value === 'yes') {
                expDescGroup.style.display = 'block';
            } else {
                expDescGroup.style.display = 'none';
            }
        });
    });
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// ===== 表单提交 - 开始测评 =====
document.getElementById('assessment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentName = document.getElementById('student-name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const birthDate = document.getElementById('birth-date').value;
    const grade = document.querySelector('input[name="grade"]:checked');
    const exp = document.querySelector('input[name="exp"]:checked');
    const expDesc = document.getElementById('exp-desc').value.trim();
    
    // 验证
    if (!studentName) {
        alert('请输入学生姓名');
        return;
    }
    
    if (!grade) {
        alert('请选择年级段');
        return;
    }
    
    // 创建测评
    try {
        const response = await fetch(apiURL('/api/assessments'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_name: studentName,
                gender: gender ? gender.value : null,
                birth_date: birthDate || null,
                grade_level: parseInt(grade.value),
                has_programming_exp: exp ? exp.value === 'yes' : false,
                programming_exp_desc: expDesc || null
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentAssessment = {
                id: result.data.id,
                assessment_no: result.data.assessment_no
            };
            
            // 获取题目
            await loadQuestions(parseInt(grade.value));
            
            // 跳转到测评页面
            createQuizPage();
        } else {
            alert('创建测评失败：' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('网络错误，请重试');
    }
});

// ===== 加载题目 =====
async function loadQuestions(gradeLevel) {
    try {
        const response = await fetch(apiURL(`/api/questions?grade_level=${gradeLevel}&limit=10`));
        const result = await response.json();
        
        if (result.success) {
            currentQuestions = result.data;
            currentQuestionIndex = 0;
            answers = {};
            startTime = new Date();
        } else {
            alert('加载题目失败');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('网络错误，请重试');
    }
}

// ===== 创建测评页面 =====
function createQuizPage() {
    // 移除旧的测评页面
    const oldQuizPage = document.getElementById('quiz-page');
    if (oldQuizPage) {
        oldQuizPage.remove();
    }
    
    // 创建新的测评页面
    const quizPage = document.createElement('div');
    quizPage.id = 'quiz-page';
    quizPage.className = 'page';
    
    quizPage.innerHTML = `
        <header class="header">
            <button class="btn-back" onclick="confirmExitQuiz()">
                <i class="fas fa-times"></i>
            </button>
            <div class="header-progress">
                <span id="question-progress">1/${currentQuestions.length}</span>
            </div>
            <div class="header-timer">
                <i class="fas fa-clock"></i>
                <span id="timer">00:00</span>
            </div>
        </header>
        
        <div class="quiz-container">
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            
            <div id="question-content">
                <!-- 题目内容动态加载 -->
            </div>
            
            <div class="quiz-navigation">
                <button class="btn-quiz-nav btn-prev" id="btn-prev" onclick="prevQuestion()" disabled>
                    <i class="fas fa-arrow-left"></i> 上一题
                </button>
                <button class="btn-quiz-nav btn-next" id="btn-next" onclick="nextQuestion()">
                    下一题 <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn-quiz-nav btn-submit" id="btn-submit" onclick="submitQuiz()" style="display: none;">
                    完成测评 <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('app').appendChild(quizPage);
    
    // 显示页面
    hideAllPages();
    quizPage.classList.add('active');
    
    // 加载第一题
    loadQuestion(currentQuestionIndex);
    
    // 启动计时器
    startTimer();
}

// ===== 加载题目 =====
function loadQuestion(index) {
    if (index < 0 || index >= currentQuestions.length) {
        return;
    }
    
    const question = currentQuestions[index];
    const questionContent = document.getElementById('question-content');
    
    // 更新进度
    document.getElementById('question-progress').textContent = `${index + 1}/${currentQuestions.length}`;
    document.getElementById('progress-fill').style.width = `${((index + 1) / currentQuestions.length) * 100}%`;
    
    // 更新按钮状态
    document.getElementById('btn-prev').disabled = index === 0;
    
    if (index === currentQuestions.length - 1) {
        document.getElementById('btn-next').style.display = 'none';
        document.getElementById('btn-submit').style.display = 'inline-flex';
    } else {
        document.getElementById('btn-next').style.display = 'inline-flex';
        document.getElementById('btn-submit').style.display = 'none';
    }
    
    // 渲染题目
    let optionsHtml = '';
    const options = ['A', 'B', 'C', 'D', 'E'];
    
    options.forEach(option => {
        const optionText = question[`option_${option.toLowerCase()}`];
        if (optionText) {
            const isSelected = answers[question.id] === option;
            optionsHtml += `
                <label class="option-item ${isSelected ? 'selected' : ''}" onclick="selectOption(${question.id}, '${option}')">
                    <input type="radio" name="question_${question.id}" value="${option}" ${isSelected ? 'checked' : ''}>
                    <span class="option-label">${option}</span>
                    <span class="option-text">${optionText}</span>
                </label>
            `;
        }
    });
    
    questionContent.innerHTML = `
        <div class="question-card">
            <div class="question-header">
                <span class="question-dimension">${getDimensionName(question.dimension)}</span>
                <span class="question-difficulty">难度：${'⭐'.repeat(question.difficulty)}</span>
            </div>
            <h3 class="question-text">${index + 1}. ${question.question_text}</h3>
            <div class="options-list">
                ${optionsHtml}
            </div>
        </div>
    `;
}

// ===== 选择选项 =====
function selectOption(questionId, option) {
    answers[questionId] = option;
    
    // 更新UI
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 自动跳转到下一题（延时）
    if (currentQuestionIndex < currentQuestions.length - 1) {
        setTimeout(() => {
            nextQuestion();
        }, 500);
    }
}

// ===== 上一题/下一题 =====
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

// ===== 提交测评 =====
async function submitQuiz() {
    // 检查是否所有题目都已作答
    const unanswered = currentQuestions.filter(q => !answers[q.id]);
    
    if (unanswered.length > 0) {
        const confirm = window.confirm(`还有 ${unanswered.length} 道题未作答，确定要提交吗？`);
        if (!confirm) {
            return;
        }
    }
    
    // 提交所有答案
    for (const questionId in answers) {
        const selectedOption = answers[questionId];
        const timeSpent = Math.floor((new Date() - startTime) / 1000 / currentQuestions.length);
        
        try {
            await fetch(apiURL('/api/answers'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessment_id: currentAssessment.id,
                    question_id: parseInt(questionId),
                    selected_option: selectedOption,
                    time_spent: timeSpent
                })
            });
        } catch (error) {
            console.error('提交答案失败:', error);
        }
    }
    
    // 完成测评
    try {
        const response = await fetch(apiURL(`/api/assessments/${currentAssessment.id}/complete`), {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 跳转到结果页面
            showResultPage(result.data);
        } else {
            alert('计算得分失败：' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('网络错误，请重试');
    }
}

// ===== 显示结果页面 =====
async function showResultPage(scores) {
    // 获取完整结果
    try {
        const response = await fetch(apiURL(`/api/assessments/${currentAssessment.id}/result`));
        const result = await response.json();
        
        if (result.success) {
            // 创建结果页面
            createResultPage(result.data);
        } else {
            alert('获取结果失败');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('网络错误');
    }
}

// ===== 创建结果页面 =====
function createResultPage(data) {
    // 移除旧的结果页面
    const oldResultPage = document.getElementById('result-page');
    if (oldResultPage) {
        oldResultPage.remove();
    }
    
    const assessment = data.assessment;
    const interpretations = data.interpretations;
    const courses = data.course_recommendations;
    
    // 创建结果页面
    const resultPage = document.createElement('div');
    resultPage.id = 'result-page';
    resultPage.className = 'page';
    
    resultPage.innerHTML = `
        <header class="header">
            <div class="header-content">
                <h2 class="header-title">测评结果</h2>
            </div>
        </header>
        
        <div class="result-container">
            <div class="result-header">
                <div class="result-avatar">🎉</div>
                <h3 class="result-name">${assessment.student_name}的测评报告</h3>
                <p class="result-desc">恭喜完成测评！以下是你的大脑超能力分析</p>
            </div>
            
            <div class="result-score-card">
                <div class="total-score">
                    <div class="score-number">${Math.round(assessment.total_score)}</div>
                    <div class="score-label">综合得分</div>
                </div>
                <div class="score-level">${getScoreLevel(assessment.total_score)}</div>
            </div>
            
            <div class="radar-chart-container">
                <canvas id="radar-chart"></canvas>
            </div>
            
            <div class="dimensions-result">
                ${renderDimensionResult('逻辑思维', assessment.logic_score, interpretations.logic)}
                ${renderDimensionResult('创意实现', assessment.creativity_score, interpretations.creativity)}
                ${renderDimensionResult('概念理解', assessment.concept_score, interpretations.concept)}
                ${renderDimensionResult('专注毅力', assessment.focus_score, interpretations.focus)}
                ${renderDimensionResult('协作沟通', assessment.collaboration_score, interpretations.collaboration)}
            </div>
            
            <div class="course-recommendations">
                <h3 class="section-title">推荐课程</h3>
                <div class="course-list">
                    ${courses.map(course => `
                        <div class="course-card">
                            <div class="course-icon">${getCourseIcon(course.category)}</div>
                            <div class="course-info">
                                <h4 class="course-name">${course.course_name}</h4>
                                <p class="course-desc">${course.description}</p>
                                <div class="course-meta">
                                    <span class="course-duration">📚 ${course.duration}课时</span>
                                    <span class="course-price">💰 ¥${course.price}</span>
                                </div>
                            </div>
                            <button class="btn-course-detail" onclick="showCourseDetail(${course.id})">
                                详情
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="result-actions">
                <button class="btn-primary" onclick="downloadReport()">
                    <i class="fas fa-download"></i> 下载报告
                </button>
                <button class="btn-secondary" onclick="shareResult()">
                    <i class="fas fa-share-alt"></i> 分享结果
                </button>
                <button class="btn-outline" onclick="showHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('app').appendChild(resultPage);
    
    // 显示页面
    hideAllPages();
    resultPage.classList.add('active');
    
    // 渲染雷达图
    renderRadarChart(assessment);
}

// ===== 渲染维度结果 =====
function renderDimensionResult(name, score, interpretation) {
    return `
        <div class="dimension-result-card">
            <div class="dimension-header">
                <span class="dimension-name">${name}</span>
                <span class="dimension-score">${Math.round(score)}分</span>
            </div>
            <div class="dimension-bar">
                <div class="dimension-fill" style="width: ${score}%"></div>
            </div>
            <div class="dimension-interpretation">
                <div class="interpretation-level">${interpretation.level}</div>
                <p class="interpretation-text">${interpretation.interpretation}</p>
                <p class="interpretation-suggestions">💡 ${interpretation.suggestions}</p>
            </div>
        </div>
    `;
}

// ===== 渲染雷达图 =====
function renderRadarChart(assessment) {
    const canvas = document.getElementById('radar-chart');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = 300;
    canvas.height = 300;
    
    const dimensions = [
        { name: '逻辑思维', value: assessment.logic_score },
        { name: '创意实现', value: assessment.creativity_score },
        { name: '概念理解', value: assessment.concept_score },
        { name: '专注毅力', value: assessment.focus_score },
        { name: '协作沟通', value: assessment.collaboration_score }
    ];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    // 绘制背景网格
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        for (let j = 0; j < dimensions.length; j++) {
            const angle = (j * 2 * Math.PI / dimensions.length) - Math.PI / 2;
            const x = centerX + (radius * i / 4) * Math.cos(angle);
            const y = centerY + (radius * i / 4) * Math.sin(angle);
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // 绘制数据
    ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < dimensions.length; i++) {
        const angle = (i * 2 * Math.PI / dimensions.length) - Math.PI / 2;
        const value = dimensions[i].value / 100;
        const x = centerX + radius * value * Math.cos(angle);
        const y = centerY + radius * value * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制标签
    ctx.fillStyle = '#2D3436';
    ctx.font = '12px PingFang SC';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < dimensions.length; i++) {
        const angle = (i * 2 * Math.PI / dimensions.length) - Math.PI / 2;
        const x = centerX + (radius + 20) * Math.cos(angle);
        const y = centerY + (radius + 20) * Math.sin(angle);
        
        ctx.fillText(dimensions[i].name, x, y);
    }
}

// ===== 工具函数 =====
function getDimensionName(dimension) {
    const names = {
        'logic': '逻辑思维',
        'creativity': '创意实现',
        'concept': '概念理解',
        'focus': '专注毅力',
        'collaboration': '协作沟通'
    };
    return names[dimension] || dimension;
}

function getScoreLevel(score) {
    if (score >= 80) return '🌟 天才小程序员';
    if (score >= 60) return '👍 潜力新星';
    return '💪 继续努力';
}

function getCourseIcon(category) {
    const icons = {
        'lego': '🧱',
        'robot': '🤖',
        'programming': '💻',
        'steam': '🔬'
    };
    return icons[category] || '📚';
}

function confirmExitQuiz() {
    const confirm = window.confirm('确定要退出测评吗？当前进度将不会保存。');
    if (confirm) {
        showHome();
    }
}

// ===== 计时器 =====
let timerInterval = null;
let secondsElapsed = 0;

function startTimer() {
    secondsElapsed = 0;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ===== 查看统计 =====
async function showStats() {
    try {
        const response = await fetch(apiURL('/api/stats'));
        const result = await response.json();
        
        if (result.success) {
            alert(`今日已完成 ${result.data.length} 次测评`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ===== 下载报告 =====
function downloadReport() {
    alert('报告生成中，即将下载...');
    // TODO: 实现PDF报告生成
}

// ===== 分享结果 =====
function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: '我的编程天赋测评结果',
            text: `我在爱创发明完成了编程天赋测评，得分${Math.round(currentAssessment.total_score)}分！`,
            url: window.location.href
        });
    } else {
        alert('复制链接分享给朋友吧！');
    }
}

// ===== 显示课程详情 =====
function showCourseDetail(courseId) {
    alert('课程详情页面开发中...');
    // TODO: 实现课程详情页
}

console.log('🚀 爱创发明 - 青少年编程天赋测评系统已加载');
