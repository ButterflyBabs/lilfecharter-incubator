// Operations & Systems placeholders
function showCEODashboard() {
    renderCEODashboard();
}

function renderCEODashboard() {
    setActiveNav('command-center');
    
    const userName = currentUser ? (currentUser.firstName || currentUser.name || 'Babs') : 'Babs';
    
    let html = `
        <!-- Welcome Header Section -->
        <div style="margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 600; color: var(--ivory-light); margin: 0 0 8px 0;">Welcome back, ${userName}</h1>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 16px; margin: 0;">Your Command Suite is running smoothly. Here's what's happening today.</p>
                </div>
                <button class="btn btn-primary" onclick="showCreateTaskModal()" style="width: auto; padding: 12px 24px; display: flex; align-items: center; gap: 8px;">
                    <span>+</span> New Task
                </button>
            </div>
        </div>
        
        <!-- Quick Actions Row -->
        <div style="margin-bottom: 32px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                <button onclick="showContentCalendar()" style="background: rgba(31, 49, 91, 0.4); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; color: var(--ivory-light); font-family: inherit; font-size: 14px; font-weight: 500;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px; margin-bottom: 8px;">✍️</div>
                    <div>New Content</div>
                </button>
                <button onclick="showLeadDatabase()" style="background: rgba(31, 49, 91, 0.4); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; color: var(--ivory-light); font-family: inherit; font-size: 14px; font-weight: 500;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px; margin-bottom: 8px;">👥</div>
                    <div>Review Leads</div>
                </button>
                <button onclick="showClientJourney()" style="background: rgba(31, 49, 91, 0.4); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; color: var(--ivory-light); font-family: inherit; font-size: 14px; font-weight: 500;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px; margin-bottom: 8px;">🤝</div>
                    <div>Client Follow-up</div>
                </button>
                <button onclick="showWeeklyReport()" style="background: rgba(31, 49, 91, 0.4); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s; color: var(--ivory-light); font-family: inherit; font-size: 14px; font-weight: 500;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
                    <div>Weekly Report</div>
                </button>
            </div>
        </div>
        
        <!-- Three Column Layout: System Status | Active Workflows | Recent Activity -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            
            <!-- System Status -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--ivory-light);">System Status</h3>
                    <span style="background: rgba(76, 175, 80, 0.15); color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">All Operational</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;"></div>
                        <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Coach Brain</span>
                        <span style="margin-left: auto; color: #4CAF50; font-size: 12px;">Online</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;"></div>
                        <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Content Engine</span>
                        <span style="margin-left: auto; color: #4CAF50; font-size: 12px;">Online</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;"></div>
                        <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Client Journey</span>
                        <span style="margin-left: auto; color: #4CAF50; font-size: 12px;">Online</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;"></div>
                        <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Sales System</span>
                        <span style="margin-left: auto; color: #4CAF50; font-size: 12px;">Online</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;"></div>
                        <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Operations Hub</span>
                        <span style="margin-left: auto; color: #4CAF50; font-size: 12px;">Online</span>
                    </div>
                </div>
            </div>
            
            <!-- Active Workflows -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--ivory-light);">Active Workflows</h3>
                    <span style="background: rgba(212, 175, 99, 0.15); color: var(--warm-gold); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">12 Running</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">New Lead Nurture</span>
                            <span style="color: var(--warm-gold); font-size: 12px;">87%</span>
                        </div>
                        <div style="height: 6px; background: rgba(31, 49, 91, 0.5); border-radius: 3px;">
                            <div style="height: 100%; width: 87%; background: linear-gradient(90deg, var(--warm-gold), var(--sacred-teal)); border-radius: 3px;"></div>
                        </div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5); margin-top: 4px;">3 active</div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Content Publishing</span>
                            <span style="color: var(--warm-gold); font-size: 12px;">62%</span>
                        </div>
                        <div style="height: 6px; background: rgba(31, 49, 91, 0.5); border-radius: 3px;">
                            <div style="height: 100%; width: 62%; background: linear-gradient(90deg, var(--warm-gold), var(--sacred-teal)); border-radius: 3px;"></div>
                        </div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5); margin-top: 4px;">5 scheduled</div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: rgba(246, 241, 232, 0.8); font-size: 14px;">Client Onboarding</span>
                            <span style="color: var(--warm-gold); font-size: 12px;">45%</span>
                        </div>
                        <div style="height: 6px; background: rgba(31, 49, 91, 0.5); border-radius: 3px;">
                            <div style="height: 100%; width: 45%; background: linear-gradient(90deg, var(--warm-gold), var(--sacred-teal)); border-radius: 3px;"></div>
                        </div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5); margin-top: 4px;">2 active</div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--ivory-light);">Recent Activity</h3>
                    <a href="#" onclick="showAllActivity(); return false;" style="color: var(--warm-gold); font-size: 12px; text-decoration: none;">View All →</a>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(212, 175, 99, 0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">C</div>
                        <div>
                            <div style="color: rgba(246, 241, 232, 0.9); font-size: 13px; line-height: 1.4;">Content Agent published "3 Ways to Align Your Morning"</div>
                            <div style="color: rgba(246, 241, 232, 0.5); font-size: 11px; margin-top: 4px;">2 hours ago</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(46, 124, 131, 0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">S</div>
                        <div>
                            <div style="color: rgba(246, 241, 232, 0.9); font-size: 13px; line-height: 1.4;">Sales Agent qualified 2 new leads from discovery calls</div>
                            <div style="color: rgba(246, 241, 232, 0.5); font-size: 11px; margin-top: 4px;">4 hours ago</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(94, 59, 108, 0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">CS</div>
                        <div>
                            <div style="color: rgba(246, 241, 232, 0.9); font-size: 13px; line-height: 1.4;">Client Success completed follow-up for Sarah M.</div>
                            <div style="color: rgba(246, 241, 232, 0.5); font-size: 11px; margin-top: 4px;">6 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- AI Performance Metrics -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--ivory-light);">AI Performance</h3>
                <span style="background: rgba(76, 175, 80, 0.15); color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">+23% this week</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
                <div style="text-align: center;">
                    <div style="font-size: 36px; font-weight: 700; color: var(--warm-gold); font-family: 'Cormorant Garamond', serif;">94%</div>
                    <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">Content Quality</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 36px; font-weight: 700; color: var(--sacred-teal); font-family: 'Cormorant Garamond', serif;">87%</div>
                    <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">Lead Conversion</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 36px; font-weight: 700; color: var(--soft-lavender); font-family: 'Cormorant Garamond', serif;">96%</div>
                    <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">Client Satisfaction</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 36px; font-weight: 700; color: var(--royal-plum); font-family: 'Cormorant Garamond', serif;">12h</div>
                    <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">Time Saved</div>
                </div>
            </div>
        </div>
        
        <!-- Command Center Grid -->
        <div style="margin-bottom: 32px;">
            <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--ivory-light); margin: 0 0 20px 0;">Command Center</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                
                <!-- Coach Brain -->
                <div onclick="showCoachBrain()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(212, 175, 99, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">🧠</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Coach Brain</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Your wisdom, methodology, and voice—organized and accessible.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">Access →</div>
                </div>
                
                <!-- Content Engine -->
                <div onclick="showContentCalendar()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(46, 124, 131, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">✍️</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Content Engine</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Create, schedule, and publish content that sounds like you.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">Create →</div>
                </div>
                
                <!-- Client Journey -->
                <div onclick="showClientJourney()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(94, 59, 108, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">🛤️</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Client Journey</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Track, nurture, and serve clients from first touch to transformation.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">View →</div>
                </div>
                
                <!-- Offer Architecture -->
                <div onclick="showOfferArchitecture()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(205, 190, 214, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">📦</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Offer Architecture</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Your programs, pricing, and positioning—all in one place.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">Manage →</div>
                </div>
                
                <!-- Sales System -->
                <div onclick="showRevenueTracker()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(212, 175, 99, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">💰</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Sales System</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Lead capture, qualification, and conversion—automated.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">Review →</div>
                </div>
                
                <!-- Operations Hub -->
                <div onclick="showOperationsHub()" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='rgba(212, 175, 99, 0.3)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.borderColor='rgba(212, 175, 99, 0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(46, 124, 131, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">⚙️</div>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">Operations Hub</h3>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">Workflows, tasks, and team coordination—simplified.</p>
                    <div style="color: var(--warm-gold); font-size: 14px; font-weight: 500;">Organize →</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// CEO Dashboard Helper Functions
function showCreateTaskModal() {
    alert('Create Task feature coming soon! For now, use the Operations Hub to manage tasks.');
}

function showAllActivity() {
    alert('Full activity log coming soon!');
}

function showCoachBrain() {
    showFounderSoul();
}

function showOfferArchitecture() {
    const html = `
        <div class="breadcrumb">
            <a onclick="renderCEODashboard()">Dashboard</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Offer Architecture</span>
        </div>
        
        <div style="margin-bottom: 32px;">
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 36px; color: var(--ivory-light); margin: 0 0 8px 0;">Offer Architecture</h1>
            <p style="color: rgba(246, 241, 232, 0.6); font-size: 16px;">Your programs, pricing, and positioning—all in one place.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(212, 175, 99, 0.15); display: flex; align-items: center; justify-content: center; font-size: 24px;">🦋</div>
                    <div>
                        <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--ivory-light);">LifeCharter Incubator</h3>
                        <span style="background: rgba(76, 175, 80, 0.15); color: #4CAF50; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Free</span>
                    </div>
                </div>
                <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px; margin: 0 0 16px 0;">90-minute workshop introducing core LifeCharter principles.</p>
            </div>
            
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <div style="display: