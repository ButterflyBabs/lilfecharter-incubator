// LifeCharter Alignment Snapshot - Application Logic
// Based on Soul Builder template

// 12 Dimensions with 3 questions each (36 total - short version)
const dimensions = [
    {
        id: 'quality_of_life',
        name: 'My Quality of Life',
        description: 'Daily lived experience, peace, ease, enjoyment, and whether life feels nourishing instead of only demanding.',
        questions: [
            { id: 'QOL-01', text: 'My daily life includes moments of peace, beauty, or genuine enjoyment.' },
            { id: 'QOL-02', text: 'I have enough spaciousness in my life to breathe, rest, and be present.' },
            { id: 'QOL-03', text: 'The way I spend my time reflects what truly matters to me.' }
        ]
    },
    {
        id: 'character',
        name: 'My Character',
        description: 'Integrity, self-honesty, responsibility, consistency, and the way you live in relationship with your own values.',
        questions: [
            { id: 'CHR-01', text: 'My choices generally reflect the values I say matter most to me.' },
            { id: 'CHR-02', text: 'I am willing to tell myself the truth, even when it is uncomfortable.' },
            { id: 'CHR-03', text: 'I take responsibility for my next faithful step without collapsing into shame.' }
        ]
    },
    {
        id: 'intellectual_life',
        name: 'My Intellectual Life',
        description: 'Curiosity, learning, mental stimulation, thought patterns, and whether you are feeding your mind with life-giving ideas.',
        questions: [
            { id: 'INT-01', text: 'I regularly engage with ideas, learning, or conversations that expand me.' },
            { id: 'INT-02', text: 'My inner dialogue helps me grow instead of keeping me trapped in old stories.' },
            { id: 'INT-03', text: 'I am open to seeing things differently when Truth invites me to grow.' }
        ]
    },
    {
        id: 'emotional_life',
        name: 'My Emotional Life',
        description: 'Emotional awareness, regulation, honesty, resilience, and the ability to stay present with feelings without being ruled by them.',
        questions: [
            { id: 'EMO-01', text: 'I can name what I am feeling without judging myself for feeling it.' },
            { id: 'EMO-02', text: 'I have healthy ways to process disappointment, fear, anger, grief, or uncertainty.' },
            { id: 'EMO-03', text: 'I do not regularly abandon myself in order to keep the peace.' }
        ]
    },
    {
        id: 'health_fitness',
        name: 'My Health and Fitness',
        description: 'Body stewardship, energy, rest, movement, nourishment, and the relationship between physical care and spiritual alignment.',
        questions: [
            { id: 'HLT-01', text: 'I treat my body as a sacred partner rather than a problem to punish, ignore, or drag behind me.' },
            { id: 'HLT-02', text: 'My current habits support my energy, strength, rest, and overall wellbeing.' },
            { id: 'HLT-03', text: 'I listen to my body before it has to speak through exhaustion, pain, or shutdown.' }
        ]
    },
    {
        id: 'love_relationships',
        name: 'My Love Relationships',
        description: 'Intimacy, partnership, connection, boundaries, truth-telling, trust, and the ability to love without losing the self.',
        questions: [
            { id: 'LOV-01', text: 'The love relationships closest to me feel rooted in honesty, respect, and mutual care.' },
            { id: 'LOV-02', text: 'I can communicate my needs and boundaries without abandoning love or truth.' },
            { id: 'LOV-03', text: 'I feel seen, valued, and emotionally safe in my closest love relationships.' }
        ]
    },
    {
        id: 'parenting',
        name: 'My Parenting',
        description: 'Relationship to parenting, caregiving, legacy, guidance, repair, and emotional presence. For those without children, this reflects care for those you influence or mentor.',
        questions: [
            { id: 'PAR-01', text: 'I show up for those in my care with presence, patience, and honest love as often as I am able.' },
            { id: 'PAR-02', text: 'I am willing to repair, apologize, and grow when I do not show up the way I intended.' },
            { id: 'PAR-03', text: 'My parenting or caregiving reflects the values I hope to pass forward.' }
        ]
    },
    {
        id: 'career',
        name: 'My Career',
        description: 'Vocation, contribution, purpose in work, right livelihood, energy exchange, leadership, and whether daily work reflects inner alignment.',
        questions: [
            { id: 'CAR-01', text: 'The work I do feels connected to my gifts, values, or sense of contribution.' },
            { id: 'CAR-02', text: 'My current work life supports the kind of person I am becoming.' },
            { id: 'CAR-03', text: 'I have clarity about the next aligned step in my work, business, calling, or contribution.' }
        ]
    },
    {
        id: 'spiritual_life',
        name: 'My Spiritual Life',
        description: 'Relationship with God, inner wisdom, prayer, stillness, spiritual practice, trust, surrender, and living from Truth rather than fear.',
        questions: [
            { id: 'SPI-01', text: 'I make space to listen for God, Truth, inner wisdom, or the still small voice.' },
            { id: 'SPI-02', text: 'My spiritual life is something I practice, not only something I believe.' },
            { id: 'SPI-03', text: 'When life feels uncertain, I can return to trust without needing to control everything.' }
        ]
    },
    {
        id: 'social_life',
        name: 'My Social Life',
        description: 'Friendship, belonging, community, mutual support, social energy, loneliness, and connection that honors authenticity.',
        questions: [
            { id: 'SOC-01', text: 'I have relationships where I can be honest, known, and supported.' },
            { id: 'SOC-02', text: 'My social life nourishes me rather than consistently draining or distracting me.' },
            { id: 'SOC-03', text: 'I make room for meaningful connection, not just obligation, performance, or scrolling.' }
        ]
    },
    {
        id: 'financial_life',
        name: 'My Financial Life',
        description: 'Money clarity, stewardship, sufficiency, responsibility, earning, receiving, generosity, and financial alignment with values.',
        questions: [
            { id: 'FIN-01', text: 'I have an honest understanding of my current financial reality.' },
            { id: 'FIN-02', text: 'My financial choices reflect my values, responsibilities, and future vision.' },
            { id: 'FIN-03', text: 'I am building a healthier relationship with earning, receiving, spending, saving, and giving.' }
        ]
    },
    {
        id: 'life_vision',
        name: 'My Life Vision',
        description: 'Purpose, direction, desire, clarity, imagination, faithful action, and whether the user is living by design rather than drift.',
        questions: [
            { id: 'VIS-01', text: 'I have a clear sense of the life I am being called to create, embody, or become.' },
            { id: 'VIS-02', text: 'My daily choices are connected to a larger purpose or direction.' },
            { id: 'VIS-03', text: 'I can name what matters most in this season of my life.' }
        ]
    }
];

// Alignment Patterns
const alignmentPatterns = {
    overextended_giver: {
        name: 'The Overextended Giver',
        description: 'You may be showing up for others while neglecting your own emotional, physical, or spiritual needs. Your care for others is beautiful, but it may be coming at a cost to your own wellbeing.',
        supportive_truth: 'Your generosity is a gift. Your needs matter too.',
        risk: 'Without sustainable boundaries, your capacity to give will eventually collapse.',
        next_step: 'Create one non-negotiable daily pause that belongs only to you.',
        offer: 'LifeCharter Incubator'
    },
    sacred_drifter: {
        name: 'The Sacred Drifter',
        description: 'You may have deep inner longing or spiritual sensitivity but lack a clear practical structure for moving forward. You sense there is more, but the path feels unclear.',
        supportive_truth: 'The longing is holy. The clarity will come.',
        risk: 'Without grounded action, your vision may remain beautiful but distant.',
        next_step: 'Name one decision you have been postponing and take one small aligned action.',
        offer: 'LifeCharter Summit'
    },
    quiet_achiever: {
        name: 'The Quiet Achiever',
        description: 'You may be capable, responsible, and productive, but disconnected from emotional nourishment or deeper fulfillment. Success on the outside may not match satisfaction on the inside.',
        supportive_truth: 'Your competence is real. Your soul matters too.',
        risk: 'Without inner alignment, achievement becomes hollow.',
        next_step: 'Ask: "What am I succeeding at that is no longer feeding my soul?"',
        offer: 'LifeCharter Circle'
    },
    survival_strategist: {
        name: 'The Survival Strategist',
        description: 'You may be operating from endurance, reaction, and survival rather than alignment, rest, and vision. Life may feel like a series of emergencies rather than a journey of purpose.',
        supportive_truth: 'You have survived. Now you can begin to thrive.',
        risk: 'Without stabilization, survival mode becomes a permanent address.',
        next_step: 'Choose one stabilizing practice for the next 24 hours, not a full life overhaul.',
        offer: 'LifeCharter Summit'
    },
    disconnected_visionary: {
        name: 'The Disconnected Visionary',
        description: 'You may see what is possible but struggle to translate vision into embodied structure and daily action. Your dreams are clear, but the bridge to reality feels uncertain.',
        supportive_truth: 'The vision is not the problem. The container may need care.',
        risk: 'Without practical structure, your vision may remain inspiring but difficult to live consistently.',
        next_step: 'Turn one vision into one calendar-based action.',
        offer: 'LifeCharter Incubator'
    },
    relationship_tethered: {
        name: 'The Relationship-Tethered Traveler',
        description: 'You may be growing internally while navigating relational strain, loneliness, conflict, or unclear boundaries. Your inner work is strong, but relationships may feel complicated.',
        supportive_truth: 'You can grow and love. Both are possible.',
        risk: 'Without relational clarity, your growth may feel isolated or constrained.',
        next_step: 'Name one relationship where love and truth need to stand together.',
        offer: 'LifeCharter Circle'
    },
    purpose_ready: {
        name: 'The Purpose-Ready Butterfly',
        description: 'You may be ready for refinement, structure, accountability, and expanded aligned action. You have done significant work and are poised for the next level.',
        supportive_truth: 'You are ready. The next chapter awaits.',
        risk: 'Without a container for your readiness, you may stay in preparation mode.',
        next_step: 'Choose a guided container to help turn clarity into consistent movement.',
        offer: 'LifeCharter Circle'
    }
};

// State management
let currentDimension = 0;
let responses = {};
let userProfile = {};

// Initialize
function init() {
    renderDimensions();
}

// Render all dimension sections
function renderDimensions() {
    const container = document.getElementById('dimensionsContainer');
    container.innerHTML = '';

    dimensions.forEach((dim, index) => {
        const section = document.createElement('div');
        section.className = 'dimension-section';
        section.id = `dimension-${index}`;
        
        let questionsHtml = '';
        dim.questions.forEach((q, qIndex) => {
            questionsHtml += `
                <div class="question">
                    <p class="question-text">${qIndex + 1}. ${q.text}</p>
                    <div class="scale-container">
                        <div class="scale-option">
                            <input type="radio" name="${q.id}" id="${q.id}-1" value="1" onchange="saveResponse('${q.id}', 1)">
                            <label for="${q.id}-1">1</label>
                        </div>
                        <div class="scale-option">
                            <input type="radio" name="${q.id}" id="${q.id}-2" value="2" onchange="saveResponse('${q.id}', 2)">
                            <label for="${q.id}-2">2</label>
                        </div>
                        <div class="scale-option">
                            <input type="radio" name="${q.id}" id="${q.id}-3" value="3" onchange="saveResponse('${q.id}', 3)">
                            <label for="${q.id}-3">3</label>
                        </div>
                        <div class="scale-option">
                            <input type="radio" name="${q.id}" id="${q.id}-4" value="4" onchange="saveResponse('${q.id}', 4)">
                            <label for="${q.id}-4">4</label>
                        </div>
                        <div class="scale-option">
                            <input type="radio" name="${q.id}" id="${q.id}-5" value="5" onchange="saveResponse('${q.id}', 5)">
                            <label for="${q.id}-5">5</label>
                        </div>
                    </div>
                    <div class="scale-labels">
                        <span>Deeply misaligned</span>
                        <span>Deeply aligned</span>
                    </div>
                </div>
            `;
        });

        section.innerHTML = `
            <div class="dimension-header">
                <div class="dimension-number">Dimension ${index + 1} of 12</div>
                <h3 class="dimension-title">${dim.name}</h3>
                <p class="dimension-description">${dim.description}</p>
            </div>
            ${questionsHtml}
        `;

        container.appendChild(section);
    });
}

// Save response
function saveResponse(questionId, value) {
    responses[questionId] = parseInt(value);
}

// Navigation
function showWelcome() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
}

function startAssessment() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('assessmentContainer').style.display = 'block';
    showDimension(0);
}

function showDimension(index) {
    // Hide all dimensions
    document.querySelectorAll('.dimension-section').forEach(el => {
        el.classList.remove('active');
    });

    // Show current dimension
    document.getElementById(`dimension-${index}`).classList.add('active');

    // Update progress
    const progress = ((index + 1) / dimensions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Update navigation buttons
    document.getElementById('prevBtn').style.visibility = index === 0 ? 'hidden' : 'visible';
    document.getElementById('nextBtn').textContent = index === dimensions.length - 1 ? 'Complete Assessment' : 'Next →';

    currentDimension = index;
}

function nextDimension() {
    // Check if all questions in current dimension are answered
    const dim = dimensions[currentDimension];
    const unanswered = dim.questions.filter(q => !responses[q.id]);

    if (unanswered.length > 0) {
        alert('Please answer all questions in this dimension before continuing.');
        return;
    }

    if (currentDimension < dimensions.length - 1) {
        showDimension(currentDimension + 1);
    } else {
        // Assessment complete, show email capture
        document.getElementById('assessmentContainer').style.display = 'none';
        document.getElementById('emailCapture').style.display = 'block';
    }
}

function previousDimension() {
    if (currentDimension > 0) {
        showDimension(currentDimension - 1);
    }
}

// Email capture and results
function submitEmail() {
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const consent = document.getElementById('emailConsent').checked;

    if (!firstName || !email) {
        alert('Please enter your first name and email address.');
        return;
    }

    if (!consent) {
        alert('Please consent to receive your Alignment Snapshot and LifeCharter resources.');
        return;
    }

    // Save user profile
    userProfile = { firstName, email };

    // Show loading screen
    document.getElementById('emailCapture').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'block';

    // Simulate processing delay
    setTimeout(() => {
        generateResults();
    }, 3000);
}

// Calculate scores and generate results
async function generateResults() {
    // Calculate dimension scores
    const dimensionScores = dimensions.map(dim => {
        const scores = dim.questions.map(q => responses[q.id] || 3);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const score = Math.round((avg / 5) * 100);
        
        let level = 'Red Light';
        if (score >= 70) level = 'Green Light';
        else if (score >= 40) level = 'Yellow Light';

        return {
            id: dim.id,
            name: dim.name,
            score,
            level
        };
    });

    // Calculate overall score
    const overallScore = Math.round(dimensionScores.reduce((a, b) => a + b.score, 0) / dimensionScores.length);
    
    let overallLevel = 'Red Light';
    let readinessLevel = 'Stabilize';
    if (overallScore >= 70) {
        overallLevel = 'Green Light';
        readinessLevel = 'Refine';
    } else if (overallScore >= 40) {
        overallLevel = 'Yellow Light';
        readinessLevel = 'Realign';
    }

    // Sort dimensions by score
    const sortedDimensions = [...dimensionScores].sort((a, b) => a.score - b.score);
    const topDimensions = sortedDimensions.slice(-3).reverse();
    const bottomDimensions = sortedDimensions.slice(0, 3);

    // Determine alignment pattern
    const pattern = determinePattern(dimensionScores, bottomDimensions);

    // Prepare data for AI report
    const scoreSummary = {
        overall_alignment_score: overallScore,
        overall_alignment_level: overallLevel,
        alignment_gap_score: topDimensions[0].score - bottomDimensions[0].score,
        readiness_level: readinessLevel
    };

    const dimensionScoresForAI = dimensionScores.map((dim, index) => ({
        dimension_id: dim.id,
        dimension_name: dim.name,
        score: dim.score,
        alignment_level: dim.level,
        rank_from_lowest: sortedDimensions.findIndex(d => d.id === dim.id) + 1
    }));

    const offerRouting = {
        recommended_offer: pattern.offer,
        cta_url: getOfferURL(pattern.offer)
    };

    // Call AI API to generate full report
    try {
        const aiReport = await generateAIReport({
            user_profile: {
                first_name: userProfile.firstName,
                email: userProfile.email,
                completion_date: new Date().toISOString().split('T')[0]
            },
            score_summary: scoreSummary,
            dimension_scores: dimensionScoresForAI,
            open_reflections: {},
            offer_routing: offerRouting
        });

        // Display results with AI report
        displayResults({
            overallScore,
            overallLevel,
            readinessLevel,
            dimensionScores,
            topDimensions,
            bottomDimensions,
            pattern,
            aiReport
        });
    } catch (error) {
        console.error('AI report generation failed:', error);
        // Fall back to basic results without AI
        displayResults({
            overallScore,
            overallLevel,
            readinessLevel,
            dimensionScores,
            topDimensions,
            bottomDimensions,
            pattern,
            aiReport: null
        });
    }
}

// Generate AI report via API
async function generateAIReport(data) {
    const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to generate AI report');
    }

    return await response.json();
}

// Get offer URL
function getOfferURL(offer) {
    const urls = {
        'LifeCharter Summit': 'https://amilynnecarroll.com/summit',
        'LifeCharter Incubator': 'https://lifecharter-incubator.vercel.app/',
        'LifeCharter Circle': 'https://life-charter.vercel.app/',
        'Self-Directed LifeCharter': 'https://amilynnecarroll.com/self-directed',
        'LifeCharter Conversation': 'https://amilynnecarroll.com/conversation',
        '21 Day Challenge': 'https://amilynnecarroll.com/21-day-challenge',
        'Conversations of Consequence': 'https://amilynnecarroll.com/conversations-of-consequence',
        'Immediate Support': 'https://amilynnecarroll.com/support'
    };
    return urls[offer] || 'https://amilynnecarroll.com';
}

function determinePattern(scores, bottomThree) {
    const scoreMap = {};
    scores.forEach(s => scoreMap[s.id] = s.score);

    const bottomIds = bottomThree.map(d => d.id);

    // Pattern detection logic
    if (bottomIds.includes('emotional_life') && bottomIds.includes('health_fitness') && bottomIds.includes('quality_of_life')) {
        if (scoreMap['love_relationships'] > 60 || scoreMap['parenting'] > 60) {
            return alignmentPatterns.overextended_giver;
        }
    }

    if (bottomIds.includes('life_vision') && bottomIds.includes('career') && bottomIds.includes('financial_life')) {
        if (scoreMap['spiritual_life'] > 60) {
            return alignmentPatterns.sacred_drifter;
        }
    }

    if (bottomIds.includes('career') && bottomIds.includes('character') && bottomIds.includes('intellectual_life')) {
        if (scoreMap['emotional_life'] < 60 || scoreMap['quality_of_life'] < 60) {
            return alignmentPatterns.quiet_achiever;
        }
    }

    if (bottomIds.includes('quality_of_life') && bottomIds.includes('emotional_life') && bottomIds.includes('financial_life')) {
        return alignmentPatterns.survival_strategist;
    }

    if ((bottomIds.includes('life_vision') || scoreMap['life_vision'] > 70) && 
        (bottomIds.includes('career') || bottomIds.includes('financial_life') || bottomIds.includes('health_fitness'))) {
        return alignmentPatterns.disconnected_visionary;
    }

    if (bottomIds.includes('love_relationships') || bottomIds.includes('parenting') || bottomIds.includes('social_life')) {
        if (scoreMap['character'] > 60 && scoreMap['spiritual_life'] > 60) {
            return alignmentPatterns.relationship_tethered;
        }
    }

    if (overallScore >= 60 && scoreMap['life_vision'] > 65 && scoreMap['spiritual_life'] > 65) {
        return alignmentPatterns.purpose_ready;
    }

    // Default pattern
    return alignmentPatterns.disconnected_visionary;
}

function displayResults(results) {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'block';

    // User name
    document.getElementById('resultName').textContent = userProfile.firstName;

    // Overall score
    document.getElementById('overallScore').textContent = results.overallScore;
    
    const scoreCircle = document.getElementById('scoreCircle');
    const alignmentLevel = document.getElementById('alignmentLevel');
    
    scoreCircle.className = 'score-circle';
    alignmentLevel.className = 'alignment-level';
    
    if (results.overallScore >= 70) {
        scoreCircle.classList.add('green');
        alignmentLevel.classList.add('green');
        alignmentLevel.textContent = 'Green Light Season';
        document.getElementById('alignmentDescription').textContent = 'Your life may be ready for deeper refinement, expansion, and intentional growth.';
    } else if (results.overallScore >= 40) {
        scoreCircle.classList.add('yellow');
        alignmentLevel.classList.add('yellow');
        alignmentLevel.textContent = 'Yellow Light Season';
        document.getElementById('alignmentDescription').textContent = 'Your life may be asking for a pause, a reset, and a more honest way forward.';
    } else {
        scoreCircle.classList.add('red');
        alignmentLevel.classList.add('red');
        alignmentLevel.textContent = 'Red Light Season';
        document.getElementById('alignmentDescription').textContent = 'Your life may be asking for immediate care, clarity, and support.';
    }

    // Dimension bars
    const barsContainer = document.getElementById('dimensionBars');
    barsContainer.innerHTML = '';
    
    results.dimensionScores.forEach(dim => {
        const barClass = dim.score >= 70 ? 'green' : dim.score >= 40 ? 'yellow' : 'red';
        barsContainer.innerHTML += `
            <div class="dimension-bar">
                <div class="dimension-name">${dim.name.replace('My ', '')}</div>
                <div class="bar-container">
                    <div class="bar-fill ${barClass}" style="width: ${dim.score}%"></div>
                </div>
                <div class="bar-score">${dim.score}</div>
            </div>
        `;
    });

    // Use AI report data if available, otherwise fall back to basic
    if (results.aiReport) {
        const report = results.aiReport;
        
        // Top dimensions from AI
        const topList = document.getElementById('topDimensions');
        topList.innerHTML = report.insights.top_aligned_dimensions.map(d => 
            `<li>${d}</li>`
        ).join('');

        // Bottom dimensions from AI
        const bottomList = document.getElementById('bottomDimensions');
        bottomList.innerHTML = report.insights.top_misaligned_dimensions.map(d => 
            `<li>${d}</li>`
        ).join('');

        // Pattern from AI
        document.getElementById('patternName').textContent = report.primary_alignment_pattern.pattern_name;
        document.getElementById('patternDescription').textContent = report.primary_alignment_pattern.pattern_summary;

        // Next step from AI
        document.getElementById('nextStep').textContent = report.report_sections.next_faithful_step;

        // CTA from AI
        document.getElementById('ctaDescription').textContent = report.recommended_pathway.offer_reason;
        document.getElementById('ctaButton').textContent = report.recommended_pathway.cta_label;
        document.getElementById('ctaButton').onclick = () => window.open(report.recommended_pathway.cta_url, '_blank');

        // Store AI report for email
        window.aiReportData = report;
    } else {
        // Fall back to basic results
        const topList = document.getElementById('topDimensions');
        topList.innerHTML = results.topDimensions.map(d => 
            `<li>${d.name} (${d.score} - ${d.level})</li>`
        ).join('');

        const bottomList = document.getElementById('bottomDimensions');
        bottomList.innerHTML = results.bottomDimensions.map(d => 
            `<li>${d.name} (${d.score} - ${d.level})</li>`
        ).join('');

        document.getElementById('patternName').textContent = results.pattern.name;
        document.getElementById('patternDescription').textContent = results.pattern.description;
        document.getElementById('nextStep').textContent = results.pattern.next_step;
        document.getElementById('ctaDescription').textContent = 
            `Based on your ${results.overallLevel} season, we recommend exploring the ${results.pattern.offer}. ` +
            `This guided experience can help you ${results.overallScore >= 70 ? 'refine and expand' : results.overallScore >= 40 ? 'pause and realign' : 'stabilize and find support'}.`;
    }

    // Send data to CRM and email report
    await sendToCRM(results);
    await sendEmailReport(results);
}

// Send email report
async function sendEmailReport(results) {
    if (!results.aiReport) return;

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to_email: userProfile.email,
                first_name: userProfile.firstName,
                ai_report: results.aiReport
            })
        });

        if (!response.ok) {
            console.error('Failed to send email report');
        } else {
            console.log('Email report sent successfully');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Send data to Global Control CRM
async function sendToCRM(results) {
    const crmData = {
        user_profile: {
            first_name: userProfile.firstName,
            email: userProfile.email,
            phone: userProfile.phone || ''
        },
        score_summary: results.aiReport?.score_summary || {
            overall_alignment_score: results.overallScore,
            overall_alignment_level: results.overallLevel,
            alignment_gap_score: results.topDimensions[0].score - results.bottomDimensions[0].score,
            readiness_level: results.readinessLevel
        },
        dimension_scores: results.aiReport?.dimension_results || results.dimensionScores.map(dim => ({
            dimension_id: dim.id,
            dimension_name: dim.name,
            score: dim.score,
            alignment_level: dim.level,
            rank_from_lowest: 0
        })),
        primary_alignment_pattern: results.aiReport?.primary_alignment_pattern || {
            pattern_name: results.pattern.name,
            confidence: 'Moderate',
            pattern_summary: results.pattern.description
        },
        recommended_pathway: results.aiReport?.recommended_pathway || {
            offer_name: results.pattern.offer,
            cta_url: getOfferURL(results.pattern.offer)
        },
        // Full report sections for complete record
        report_sections: results.aiReport?.report_sections || {
            opening_reflection: '',
            overall_interpretation: '',
            strengths_summary: '',
            misalignment_summary: '',
            yellow_yield_practice: [],
            next_faithful_step: results.pattern.next_step || '',
            closing_encouragement: '',
            disclaimer: ''
        },
        insights: results.aiReport?.insights || {
            top_aligned_dimensions: results.topDimensions.map(d => d.name),
            top_misaligned_dimensions: results.bottomDimensions.map(d => d.name),
            alignment_gap_interpretation: '',
            core_invitation: ''
        },
        safety_flags: results.aiReport?.safety_flags || {
            crisis_language_detected: false,
            medical_claim_risk: false,
            financial_advice_risk: false,
            relationship_safety_risk: false,
            safety_note: 'No safety flags'
        },
        crm_tags: results.aiReport?.crm?.tags || [
            'snapshot',
            'Alignment Snapshot Completed',
            `Alignment Level: ${results.overallLevel}`,
            `Primary Pattern: ${results.pattern.name}`,
            `Recommended Offer: ${results.pattern.offer}`
        ],
        source_url: window.location.href,
        utm_params: getUTMParams()
    };

    try {
        const response = await fetch('/api/crm-sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(crmData)
        });

        if (!response.ok) {
            console.error('Failed to sync to CRM');
        } else {
            const data = await response.json();
            console.log('CRM sync successful:', data);
        }
    } catch (error) {
        console.error('Error syncing to CRM:', error);
    }
}

// Get UTM parameters from URL
function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || ''
    };
}

// Initialize on load
window.onload = init;