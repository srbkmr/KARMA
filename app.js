// Karma Student Financial Empowerment Platform State Engine

class KarmaApp {
  constructor() {
    // 1. Dual-State User Wallet & Profile
    this.currentUser = {
      username: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena",
      activeRole: "Student", // Student (Earn Cash) vs Seeker (Post Gigs)
      cashWallet: 120.00,    // Cash balance in dollar wallet
      karmaTrust: 250,       // Karma Trust Points score
      solvesCount: 14,       // Gigs completed
      viewsCount: 1480,
      lifetimeEarnings: 480.00,
      escrowLocked: 0.00,    // Pledged escrows (for Seeker Mode)
      rankName: "Elite Scholar"
    };

    // Filters and Sorting
    this.activeScopeFilter = "All"; // All, Virtual, Physical
    this.searchQuery = "";
    this.sortBy = "cash"; // cash, karma, newest
    this.activeProblemId = null;
    this.newProblemScope = "Virtual"; // Default for form creation
    this.isLedgerPaneOpen = false;

    // GPS Simulation States
    this.gpsInterval = null;
    this.gpsProgress = 0;
    this.activeTaskStep = 0; // 0: Posted, 1: Assigned, 2: In-Progress, 3: Submitted, 4: Paid

    // 2. Immutable Cryptographic Trust Ledger (Pre-populated Historical Footprint)
    this.trustLedger = [
      {
        index: 1,
        timestamp: "2026-05-18 10:14",
        provider: "Elena Rostova",
        event: "Completed Calculus II Homework Solver gig",
        pointsChange: 40,
        prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
        hash: "001a4f78e239db1c5e67fa890c23ef89dcb4ef78c2e9d28a34bc789e001abc4f"
      },
      {
        index: 2,
        timestamp: "2026-05-19 14:32",
        provider: "Elena Rostova",
        event: "Completed Local Lawn Mowing & Trim gig",
        pointsChange: 60,
        prevHash: "001a4f78e239db1c5e67fa890c23ef89dcb4ef78c2e9d28a34bc789e001abc4f",
        hash: "005b8e90c283ef9b7cf8da10d29abcb4ef57d29bc1e28fa0b5cd78ee004f29a0"
      },
      {
        index: 3,
        timestamp: "2026-05-20 16:50",
        provider: "Elena Rostova",
        event: "Completed Virtual Web Design Proofread gig",
        pointsChange: 30,
        prevHash: "005b8e90c283ef9b7cf8da10d29abcb4ef57d29bc1e28fa0b5cd78ee004f29a0",
        hash: "00bfa28dcb4e2bda90fa0c1efda89bcaef10cd56b23d9fa87ecb8f650079dc1e"
      }
    ];

    // 3. Gigs & Tasks Mock Database (Omnichannel: Virtual and Geolocation Physical)
    this.problems = [
      {
        id: 1,
        title: "Local Car Wash: Complete SUV Exterior Wash & Wax",
        scope: "Physical",
        category: "Hyperlocal Physical",
        cashBounty: 35.00,
        karmaBounty: 50,
        seeker: {
          name: "Marcus Vance",
          avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Marcus",
          rank: "Resident Client"
        },
        address: "Student Parking Lot C, Row 4",
        coordinates: { start: { x: 40, y: 50 }, end: { x: 560, y: 180 } },
        description: `Looking for a student to do a thorough exterior wash on a dynamic SUV model parked in Student Lot C, Row 4. I will leave the bucket, premium car soap, and microfiber sponges next to the rear license plate. No interior access required.\n\n**Fulfillment Rules:**\n- Bring a water container or use the campus utility spigot nearby.\n- Wipe down completely to avoid water spots.\n- Appends +50 KP to your Immutable Trust score upon release.`,
        views: 45,
        date: "2 hours ago",
        status: "POSTED", // POSTED, ASSIGNED, IN_PROGRESS, WORK_SUBMITTED, COMPLETED
        escrowStatus: "LOCKED", // LOCKED, RELEASED, REFUNDED
        solutions: [
          {
            id: 101,
            author: "David_K",
            avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=David",
            rank: "Silver Solver",
            body: "I am available right now. I have experience detailing cars and have my own chamois leather to ensure a spot-free finish. Let me know!",
            score: 2,
            voted: null,
            accepted: false,
            replies: []
          }
        ]
      },
      {
        id: 2,
        title: "Virtual Calculus II Homework Tutor & Solver Sheets",
        scope: "Virtual",
        category: "Virtual / Academic",
        cashBounty: 60.00,
        karmaBounty: 40,
        seeker: {
          name: "Dr. Clara Sun",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clara",
          rank: "Professor Client"
        },
        address: "Digital Delivery Portal",
        coordinates: null,
        description: `Need step-by-step math solver diagrams explaining second-order homogeneous linear differential equations with constant coefficients. Follow calculus conventions.\n\n**Academic constraints:**\n- Provide rigorous proofs for the characteristic equation roots.\n- Format response in clear markdown.\n- Zero copypasting from AI models; needs detailed handwritten explanation graphs.`,
        views: 112,
        date: "4 hours ago",
        status: "POSTED",
        escrowStatus: "LOCKED",
        solutions: []
      },
      {
        id: 3,
        title: "Hyperlocal Laundry Pick-up & Campus Delivery",
        scope: "Physical",
        category: "Hyperlocal Physical",
        cashBounty: 20.00,
        karmaBounty: 30,
        seeker: {
          name: "Aiden Chen",
          avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Aiden",
          rank: "Resident Client"
        },
        address: "Downtown Laundromat to Dorm Hall B Lobby",
        coordinates: { start: { x: 40, y: 50 }, end: { x: 560, y: 180 } },
        description: `Collect a medium-sized duffel bag of clean folded laundry from the Downtown Laundromat (Counter ticket #408) and deliver it directly to the lobby of Dorm Hall B.\n\n**Instructions:**\n- Verify the ticket matches counter staff records.\n- Drop off bag with the front desk receptionist at Dorm B.\n- Real-time GPS tracking coordinates are active for this physical gig.`,
        views: 68,
        date: "1 day ago",
        status: "POSTED",
        escrowStatus: "LOCKED",
        solutions: [
          {
            id: 301,
            author: "Sophia_W",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
            rank: "Elite Scholar",
            body: "I am headed downtown in 10 minutes and can easily grab this and drop it off at Dorm Hall B by 6:00 PM.",
            score: 3,
            voted: null,
            accepted: false,
            replies: []
          }
        ]
      },
      {
        id: 4,
        title: "Virtual Product Vector Landing Page Banner Art",
        scope: "Virtual",
        category: "Virtual / Academic",
        cashBounty: 85.00,
        karmaBounty: 45,
        seeker: {
          name: "AuraDesigner",
          avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aura",
          rank: "Premium Client"
        },
        address: "Digital Delivery Portal",
        coordinates: null,
        description: `Need a modern vector illustration concept depicting interconnected neural nets for a new landing page banner. Color palette must use Electric Blue accents.\n\n**Deliverable Rules:**\n- Clean scalable vector SVG markup.\n- Incorporate subtle drop shadows to create a cloud-card depth.`,
        views: 240,
        date: "2 days ago",
        status: "POSTED",
        escrowStatus: "LOCKED",
        solutions: []
      }
    ];

    // Global Council Leaderboard of Students
    this.leaderboard = [
      { rank: 1, name: "Sophia_W", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia", specialty: "Academic STEM Writing", score: 489, badgeClass: "badge-grandmaster", badgeName: "Grandmaster" },
      { rank: 2, name: "Dr. Aris Thorne", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aris", specialty: "Hyperlocal Logistics & Driving", score: 420, badgeClass: "badge-grandmaster", badgeName: "Grandmaster" },
      { rank: 3, name: "GroundedFounder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Founder", specialty: "Product UX Design Tasks", score: 380, badgeClass: "badge-expert", badgeName: "Expert Solver" },
      { rank: 4, name: "Marcus Vance", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Marcus", specialty: "Software Engineering Help", score: 320, badgeClass: "badge-expert", badgeName: "Expert Solver" }
    ];

    this.syncUserToLeaderboard();
    this.init();
  }

  init() {
    this.renderFeed();
    this.updateUserWidgets();
    this.initSimulation();
    this.initAvatarUploadListeners();
  }

  // 4. ROLE SWITCHING CONTROLLERS
  setRole(roleName) {
    this.currentUser.activeRole = roleName;

    // Toggle button active visual states
    const btnStudent = document.getElementById("role-btn-student");
    const btnSeeker = document.getElementById("role-btn-seeker");

    if (roleName === "Student") {
      btnStudent.classList.add("active");
      btnSeeker.classList.remove("active");
      document.getElementById("widget-rank").innerText = "Student Provider";
      document.getElementById("widget-rank").style.color = "var(--primary)";
    } else {
      btnStudent.classList.remove("active");
      btnSeeker.classList.add("active");
      document.getElementById("widget-rank").innerText = "Seeker Client";
      document.getElementById("widget-rank").style.color = "var(--cash-green)";
    }

    this.updateUserWidgets();
    
    // Refresh active views
    const feedActive = document.getElementById("view-feed").classList.contains("active");
    const hubActive = document.getElementById("view-hub").classList.contains("active");

    if (feedActive) this.renderFeed();
    if (hubActive) this.renderHubDashboard();
  }

  // Sync user values into student leaderboard
  syncUserToLeaderboard() {
    const existingIndex = this.leaderboard.findIndex(m => m.name === this.currentUser.username);
    const memberObj = {
      rank: 42, // default mock rank
      name: this.currentUser.username,
      avatar: this.currentUser.avatar,
      specialty: "Fullstack Gigs & Academic writing",
      score: this.currentUser.karmaTrust,
      badgeClass: "badge-expert",
      badgeName: this.currentUser.rankName
    };

    if (existingIndex !== -1) {
      this.leaderboard[existingIndex] = memberObj;
    } else {
      this.leaderboard.push(memberObj);
    }
    this.sortLeaderboard();
  }

  sortLeaderboard() {
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard.forEach((member, index) => {
      member.rank = index + 1;
    });
  }

  // Update stats wallets and values across screens
  updateUserWidgets() {
    // Sidebar profile
    document.getElementById("widget-username").innerText = this.currentUser.username;
    document.getElementById("widget-cash").innerText = "₹" + this.currentUser.cashWallet.toFixed(2);
    document.getElementById("widget-karma").innerText = this.currentUser.karmaTrust + " KP";
    document.getElementById("widget-avatar").src = this.currentUser.avatar;

    // Form creation available balances
    document.getElementById("form-available-cash").innerText = "₹" + this.currentUser.cashWallet.toFixed(2);
  }

  // 5. VIEW ROUTER
  switchView(viewId) {
    document.querySelector(".main-viewport").scrollTop = 0;

    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    menuItems.forEach(item => item.classList.remove("active"));

    const currentNav = document.getElementById(`nav-${viewId}`);
    if (currentNav) {
      currentNav.classList.add("active");
    }

    const views = document.querySelectorAll(".view-section");
    views.forEach(view => view.classList.remove("active"));

    const activeView = document.getElementById(`view-${viewId}`);
    if (activeView) {
      activeView.classList.add("active");
    }

    if (viewId === "feed") {
      this.renderFeed();
    } else if (viewId === "hub") {
      this.renderHubDashboard();
    } else if (viewId === "council") {
      this.renderLeaderboard();
    }
  }

  // 6. OMNICHANNEL MARKETPLACE SEARCH & SORT
  handleSearch() {
    this.searchQuery = document.getElementById("search-bar").value.toLowerCase();
    this.renderFeed();
  }

  filterByScope(scopeName) {
    this.activeScopeFilter = scopeName;

    const pills = document.querySelectorAll("#tags-filter-container .tag-pill");
    pills.forEach(pill => {
      if (pill.innerText.includes(scopeName) || (scopeName === "All" && pill.innerText.includes("All"))) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    this.renderFeed();
  }

  handleSort() {
    this.sortBy = document.getElementById("feed-sort").value;
    this.renderFeed();
  }

  // 7. RENDER MARKETPLACE FEED
  renderFeed() {
    const feedContainer = document.getElementById("problems-feed");
    feedContainer.innerHTML = "";

    // Toggle Feed Titles based on Role
    const titleEl = document.getElementById("feed-title");
    const subEl = document.getElementById("feed-subtitle");
    if (this.currentUser.activeRole === "Student") {
      titleEl.innerText = "Task Marketplace";
      subEl.innerText = "Earn direct cash payouts in protected escrows while building your verified academic trust footprint.";
    } else {
      titleEl.innerText = "Active Client Gigs";
      subEl.innerText = "Monitor task progress coordinates, manage secure escrow wallets, or publish new local and digital requirements.";
    }

    // Filter Gigs
    let filtered = this.problems.filter(prob => {
      const matchScope = this.activeScopeFilter === "All" || prob.scope === this.activeScopeFilter;
      const matchSearch = prob.title.toLowerCase().includes(this.searchQuery) ||
                          prob.category.toLowerCase().includes(this.searchQuery) ||
                          prob.description.toLowerCase().includes(this.searchQuery) ||
                          prob.address.toLowerCase().includes(this.searchQuery);
      return matchScope && matchSearch;
    });

    // Sort Gigs
    if (this.sortBy === "cash") {
      filtered.sort((a, b) => b.cashBounty - a.cashBounty);
    } else if (this.sortBy === "karma") {
      filtered.sort((a, b) => b.karmaBounty - a.karmaBounty);
    } else if (this.sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-svg" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="empty-state-title">No Gigs Found</h4>
          <p class="empty-state-text">Refine your search parameters or adjust filters above to view tasks.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(prob => {
      const card = document.createElement("div");
      card.className = "problem-card";
      card.onclick = () => this.viewProblemDetails(prob.id);

      // Status pill overlays
      let statusBadge = "";
      if (prob.status !== "POSTED") {
        const color = prob.status === "COMPLETED" ? "var(--cash-green)" : "var(--primary)";
        statusBadge = `<span style="font-size: 10px; background: rgba(0,0,0,0.05); color: ${color}; font-weight: 700; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">${prob.status.replace('_', ' ')}</span>`;
      }

      card.innerHTML = `
        <div class="card-header">
          <div class="card-meta">
            <span class="card-tag tag-${prob.scope.toLowerCase() === 'virtual' ? 'technical' : 'personal'}">${prob.category}</span>
            <span style="font-size: 12px; color: var(--text-muted);">${prob.date}</span>
            ${statusBadge}
          </div>
          <div class="card-bounty-container">
            <div class="card-cash-badge">
              ₹${prob.cashBounty.toFixed(2)}
            </div>
            <div class="card-karma-badge">
              +${prob.karmaBounty} KP
            </div>
          </div>
        </div>
        
        <h3 class="card-title">${prob.title}</h3>
        <p class="card-excerpt" style="font-size:14px; line-height:1.6; color:var(--text-muted);">${prob.description.substring(0, 160)}...</p>
        
        <div class="card-footer">
          <div class="seeker-row">
            <img src="${prob.seeker.avatar}" class="seeker-avatar" alt="seeker">
            <div style="display: flex; flex-direction: column;">
              <span class="seeker-name">${prob.seeker.name}</span>
              <span class="seeker-rank-small">${prob.seeker.rank}</span>
            </div>
          </div>
          
          <div class="card-stats">
            <div class="card-stat" style="font-size:12px;">
              📍 ${prob.address.substring(0, 30)}${prob.address.length > 30 ? '...' : ''}
            </div>
            <div class="card-stat">
              👁 ${prob.views}
            </div>
          </div>
        </div>
      `;

      feedContainer.appendChild(card);
    });
  }

  // 8. TASK DETAILS VIEWER
  viewProblemDetails(id) {
    this.activeProblemId = id;
    const prob = this.problems.find(p => p.id === id);
    if (!prob) return;

    prob.views += 1;
    this.switchView("detail");

    // Hide simulator modules by default
    document.getElementById("detail-map-container").style.display = "none";
    document.getElementById("detail-timeline-container").style.display = "none";
    document.getElementById("detail-ledger-block-container").style.display = "none";
    document.getElementById("detail-chat-container").style.display = "none";

    // Stop existing geotracking intervals
    if (this.gpsInterval) {
      clearInterval(this.gpsInterval);
      this.gpsInterval = null;
    }

    // Hero details
    const heroCard = document.getElementById("detail-hero-card");
    
    // Status lock description
    let escrowBadge = `<span style="font-size:11px; font-weight:700; color:var(--escrow-gold); background:var(--escrow-gold-bg); padding:4px 10px; border-radius:12px; text-transform:uppercase;">🔒 PLEDGED IN ESCROW</span>`;
    if (prob.escrowStatus === "RELEASED") {
      escrowBadge = `<span style="font-size:11px; font-weight:700; color:var(--cash-green); background:var(--cash-light); padding:4px 10px; border-radius:12px; text-transform:uppercase;">✓ DISBURSED TO SOLVER</span>`;
    }

    heroCard.innerHTML = `
      <div class="hero-meta">
        <div class="card-meta">
          <span class="card-tag tag-${prob.scope.toLowerCase() === 'virtual' ? 'technical' : 'personal'}">${prob.category}</span>
          <span style="font-size: 13px; color: var(--text-muted);">${prob.date} • ${prob.address}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${escrowBadge}
          <div class="card-cash-badge" style="font-size: 15px; padding: 6px 14px;">₹${prob.cashBounty.toFixed(2)} INR</div>
          <div class="card-karma-badge" style="font-size: 15px; padding: 6px 14px;">+${prob.karmaBounty} KP</div>
        </div>
      </div>
      
      <h1 style="font-size: 26px; margin-bottom: 16px;">${prob.title}</h1>
      
      <div class="seeker-row" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <img src="${prob.seeker.avatar}" class="seeker-avatar" style="width: 32px; height: 32px;" alt="seeker">
        <div style="display: flex; flex-direction: column;">
          <span class="seeker-name" style="font-size: 14px;">${prob.seeker.name}</span>
          <span class="seeker-rank-small">${prob.seeker.rank}</span>
        </div>
      </div>
      
      <div class="problem-description-full">${this.formatDescription(prob.description)}</div>
    `;

    // Activate Real-Time Status timeline & Map if claimed
    if (prob.status !== "POSTED") {
      document.getElementById("detail-timeline-container").style.display = "block";
      this.updateTimelineUI(prob.status);

      if (prob.scope === "Physical" && prob.coordinates) {
        document.getElementById("detail-map-container").style.display = "block";
        this.restoreGPSPosition(prob.status);
      }

      // If completed, show immutable trust blocks
      if (prob.status === "COMPLETED") {
        document.getElementById("detail-ledger-block-container").style.display = "block";
        this.renderLedgerList(prob.id);
      }
    }

    // Dynamic claims / solutions layout
    this.renderSolutionsList(prob);
    this.renderActionFormBox(prob);

    // Dynamic Peer-to-Peer Secure Chat Layout
    this.renderChatUI(prob);
  }

  formatDescription(text) {
    let formatted = text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/>\s*([^\n]+)/g, '<blockquote>$1</blockquote>');
    return formatted;
  }

  // 9. DYNAMIC SUBMISSION WORKFLOWS (STUDENT VS SEEKER GIG ACTIONS)
  renderActionFormBox(prob) {
    const actionBox = document.getElementById("claim-submission-box");
    const editorTitle = document.getElementById("action-editor-title");
    const textarea = document.getElementById("new-solution-textarea");
    const buttonSlot = document.getElementById("action-button-slot");

    // Default student claims a posted task
    if (prob.status === "POSTED") {
      if (this.currentUser.activeRole === "Student") {
        actionBox.style.display = "block";
        editorTitle.innerText = "Propose Service Claim";
        textarea.placeholder = "Detail your qualification, availability, and how you plan to complete this assignment or gig...";
        textarea.value = "";
        buttonSlot.innerHTML = `<button class="btn-primary btn-cash" onclick="app.claimTask(${prob.id})">Secure Escrow & Claim Task</button>`;
      } else {
        // Seeker sees active posted but unclaimed task
        actionBox.style.display = "block";
        editorTitle.innerText = "Task Marketplace Status";
        textarea.style.display = "none";
        buttonSlot.innerHTML = `<span style="font-size:13px; color:var(--text-muted);">This task is posted and awaiting claims from Student Providers in the campus network.</span>`;
      }
    } 
    // Task is active and claimed by user
    else if (prob.status === "ASSIGNED" || prob.status === "IN_PROGRESS") {
      actionBox.style.display = "block";
      textarea.style.display = "block";

      if (this.currentUser.activeRole === "Student") {
        editorTitle.innerText = "Fulfill Service & Submit Work";
        textarea.placeholder = "Include details of the completion (e.g. Wash completed! Key placed back under rear plate / Attached the differential solved paper link)...";
        buttonSlot.innerHTML = `<button class="btn-primary" onclick="app.submitFulfillment(${prob.id})">Submit Completed Work</button>`;
      } else {
        editorTitle.innerText = "Fulfillment In Progress";
        textarea.style.display = "none";
        buttonSlot.innerHTML = `<span style="font-size:13px; color:var(--primary); font-weight:600;">Student is actively working on your task. Real-time geotracking updates are updating below.</span>`;
      }
    } 
    // Work is submitted, Seeker needs to verify and release payments
    else if (prob.status === "WORK_SUBMITTED") {
      actionBox.style.display = "block";
      textarea.style.display = "none";

      if (this.currentUser.activeRole === "Seeker") {
        editorTitle.innerText = "Verify Deliverables & Release Escrow";
        buttonSlot.innerHTML = `
          <button class="btn-secondary" style="margin-right: 10px;" onclick="app.disputeFulfillment(${prob.id})">Reject / Dispute</button>
          <button class="btn-primary btn-cash" onclick="app.releaseEscrowPayout(${prob.id})">Approve & Release Cash Escrow</button>
        `;
      } else {
        editorTitle.innerText = "Awaiting Client Payment Release";
        buttonSlot.innerHTML = `<span style="font-size:13px; color:var(--cash-green); font-weight:600;">Work submitted successfully. Pledges are secure in Escrow. Awaiting client's verification.</span>`;
      }
    } 
    // Completed tasks
    else if (prob.status === "COMPLETED") {
      actionBox.style.display = "none";
    }
  }

  // Student claims a task
  claimTask(probId) {
    const prob = this.problems.find(p => p.id === probId);
    if (!prob) return;

    prob.status = "ASSIGNED";
    
    // Add student claim record
    prob.solutions.push({
      id: Date.now(),
      author: this.currentUser.username,
      avatar: this.currentUser.avatar,
      rank: this.currentUser.rankName,
      body: document.getElementById("new-solution-textarea").value.trim() || "Claimed task. Ready to initiate immediate fulfillment.",
      score: 1,
      voted: 'up',
      accepted: true,
      replies: []
    });

    this.showToast("Escrow Secured!", `Pledged ₹${prob.cashBounty.toFixed(2)} locks in the Escrow gateway.`, false);
    
    // Reload Details View to activate tracker timelines
    this.viewProblemDetails(probId);

    // Concurrency transitions: Move to in progress, start map movements after 2.5 seconds
    setTimeout(() => {
      if (this.activeProblemId === probId) {
        prob.status = "IN_PROGRESS";
        this.updateTimelineUI("IN_PROGRESS");
        this.showToast("Task In Transit", "Student provider is moving to coordinates.", false);

        if (prob.scope === "Physical") {
          this.initGPSMapMovement(prob);
        }
      }
    }, 2500);
  }

  // Dynamic interval map tracking simulator
  initGPSMapMovement(prob) {
    const dot = document.getElementById("gps-pulsing-dot");
    const statusText = document.getElementById("map-concurrency-status");
    if (!dot) return;

    this.gpsProgress = 0;
    statusText.innerText = "GPS Tracker Active: Provider moving along Main Road";

    // Path corners coordinates
    const startX = 40, startY = 50;
    const corner1X = 300, corner1Y = 50;
    const corner2X = 300, corner2Y = 180;
    const endX = 560, endY = 180;

    this.gpsInterval = setInterval(() => {
      this.gpsProgress += 4; // increment coordinate percentages

      let currentX = startX;
      let currentY = startY;

      if (this.gpsProgress < 40) {
        // Path Segment 1: horizontal to 300px
        const ratio = this.gpsProgress / 40;
        currentX = startX + (corner1X - startX) * ratio;
        currentY = startY;
      } else if (this.gpsProgress < 70) {
        // Path Segment 2: vertical down to 180px
        const ratio = (this.gpsProgress - 40) / 30;
        currentX = corner1X;
        currentY = corner1Y + (corner2Y - corner1Y) * ratio;
      } else if (this.gpsProgress <= 100) {
        // Path Segment 3: horizontal right to 560px
        const ratio = (this.gpsProgress - 70) / 30;
        currentX = corner2X + (endX - corner2X) * ratio;
        currentY = corner2Y;
      }

      // Render coordinates
      dot.style.left = currentX + "px";
      dot.style.top = currentY + "px";

      if (this.gpsProgress >= 100) {
        clearInterval(this.gpsInterval);
        this.gpsInterval = null;
        statusText.innerText = "GPS Tracking: Provider arrived at destination";
        this.showToast("Task Location Reached", "Student provider arrived at Lot C.", false);
      }
    }, 500);
  }

  restoreGPSPosition(status) {
    const dot = document.getElementById("gps-pulsing-dot");
    if (!dot) return;

    if (status === "COMPLETED" || status === "WORK_SUBMITTED") {
      dot.style.left = "560px";
      dot.style.top = "180px";
      document.getElementById("map-concurrency-status").innerText = "Fulfillment coordinates completed";
    } else {
      dot.style.left = "40px";
      dot.style.top = "50px";
    }
  }

  // Student submits the work
  submitFulfillment(probId) {
    const prob = this.problems.find(p => p.id === probId);
    if (!prob) return;

    prob.status = "WORK_SUBMITTED";
    
    // Append answer detail
    const text = document.getElementById("new-solution-textarea").value.trim() || "Fulfillment completed. Photographic evidence uploaded.";
    prob.solutions.push({
      id: Date.now(),
      author: this.currentUser.username,
      avatar: this.currentUser.avatar,
      rank: this.currentUser.rankName,
      body: "**[SERVICE DELIVERABLE SUBMITTED]**\n\n" + text,
      score: 1,
      voted: 'up',
      accepted: false,
      replies: []
    });

    this.showToast("Work Submitted!", "Awaiting client's verification to release payments.", false);
    this.viewProblemDetails(probId);
  }

  // Seeker releases cash escrow and creates cryptographic trust ledger
  releaseEscrowPayout(probId) {
    const prob = this.problems.find(p => p.id === probId);
    if (!prob) return;

    prob.status = "COMPLETED";
    prob.escrowStatus = "RELEASED";

    // Transfer Cash to student (Elena Rostova is always student here)
    this.currentUser.cashWallet += prob.cashBounty;
    this.currentUser.karmaTrust += prob.karmaBounty;
    this.currentUser.solvesCount += 1;
    this.currentUser.lifetimeEarnings += prob.cashBounty;

    // Cryptographic Block chain Hashing logic
    const lastBlock = this.trustLedger[this.trustLedger.length - 1];
    const newBlockIndex = this.trustLedger.length + 1;
    const newTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Generate simulated SHA-256 hash linked to previous block
    const prevHash = lastBlock.hash;
    const newHash = this.calculateSimulatedHash(newBlockIndex, prevHash, newTimestamp, prob.title, prob.karmaBounty);

    const newBlockObj = {
      index: newBlockIndex,
      timestamp: newTimestamp,
      provider: "Elena Rostova",
      event: `Completed: ${prob.title}`,
      pointsChange: prob.karmaBounty,
      prevHash: prevHash,
      hash: newHash
    };

    this.trustLedger.push(newBlockObj);
    this.syncUserToLeaderboard();

    this.showToast("Escrow Released!", `Direct payout of ₹${prob.cashBounty.toFixed(2)} transferred to Student!`, false);
    this.showToast("Ledger Appended!", `Block #${newBlockIndex} computed. +${prob.karmaBounty} KP trust verified.`, true);

    this.viewProblemDetails(probId);
    this.updateUserWidgets();
  }

  calculateSimulatedHash(index, prevHash, timestamp, event, points) {
    // Generate a beautiful, realistic SHA-256 looking hexadecimal hash
    const str = `${index}${prevHash}${timestamp}${event}${points}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0') + 
                Math.abs(hash * 31).toString(16).padStart(8, '0') + 
                Math.abs(hash * 97).toString(16).padStart(8, '0') +
                Math.abs(hash * 13).toString(16).padStart(8, '0');
    return "00" + hex.substring(0, 62);
  }

  disputeFulfillment(probId) {
    alert("Task verification suspended. Request routed to High Council dispute resolving team.");
  }

  // Update Status Steps Timeline indicator
  updateTimelineUI(status) {
    // Reset classes
    const steps = ["step-posted", "step-assigned", "step-progress", "step-submitted", "step-completed"];
    steps.forEach(s => {
      document.getElementById(s).classList.remove("active", "completed");
    });

    if (status === "ASSIGNED") {
      document.getElementById("step-posted").classList.add("completed");
      document.getElementById("step-assigned").classList.add("active");
    } else if (status === "IN_PROGRESS") {
      document.getElementById("step-posted").classList.add("completed");
      document.getElementById("step-assigned").classList.add("completed");
      document.getElementById("step-progress").classList.add("active");
    } else if (status === "WORK_SUBMITTED") {
      document.getElementById("step-posted").classList.add("completed");
      document.getElementById("step-assigned").classList.add("completed");
      document.getElementById("step-progress").classList.add("completed");
      document.getElementById("step-submitted").classList.add("active");
    } else if (status === "COMPLETED") {
      steps.forEach(s => document.getElementById(s).classList.add("completed"));
    }
  }

  // 10. RENDER SOLUTIONS / CLAIMS ITEMS LIST
  renderSolutionsList(prob) {
    const listContainer = document.getElementById("detail-solutions-list");
    listContainer.innerHTML = "";

    document.getElementById("detail-solves-count").innerText = `${prob.solutions.length} Claim Offer${prob.solutions.length !== 1 ? 's' : ''}`;

    if (prob.solutions.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-std); padding: 40px;">
          <h4 class="empty-state-title" style="font-size: 16px;">Awaiting Claims</h4>
          <p class="empty-state-text" style="font-size: 13px;">No active claims proposed yet. Student providers can submit details below.</p>
        </div>
      `;
      return;
    }

    prob.solutions.forEach(sol => {
      const card = document.createElement("div");
      card.className = `solution-card ${sol.accepted ? 'accepted' : ''}`;
      card.style.display = "flex";
      card.style.gap = "16px";

      card.innerHTML = `
        <div class="solution-main-content" style="width: 100%;">
          <div class="solution-card-header">
            <div class="solver-info">
              <img src="${sol.avatar}" class="solver-avatar" alt="avatar">
              <div>
                <span class="solver-name">${sol.author}</span>
                <span class="solver-rank-tag">${sol.rank}</span>
              </div>
            </div>
            ${sol.accepted ? `<span class="accepted-badge-indicator" style="background: var(--cash-light); color: var(--cash-green);">✓ Bound Provider</span>` : ''}
          </div>
          
          <div class="solution-body">${this.formatDescription(sol.body)}</div>
        </div>
      `;

      listContainer.appendChild(card);
    });
  }

  // Collapsible Trust Ledger panel Toggler
  toggleLedgerPane() {
    this.isLedgerPaneOpen = !this.isLedgerPaneOpen;
    const btn = document.getElementById("ledger-toggle-btn");
    const pane = document.getElementById("ledger-content-pane");

    if (this.isLedgerPaneOpen) {
      btn.classList.add("open");
      pane.classList.add("open");
    } else {
      btn.classList.remove("open");
      pane.classList.remove("open");
    }
  }

  // Render list of verified cryptographic blocks
  renderLedgerList(probId) {
    const pane = document.getElementById("ledger-content-pane");
    pane.innerHTML = "";

    // Load ledger blocks
    this.trustLedger.forEach(block => {
      const blockCard = document.createElement("div");
      blockCard.className = "ledger-block-card";

      blockCard.innerHTML = `
        <div class="block-row">
          <span class="block-lbl">BLOCK INDEX:</span>
          <span style="color:#FFF; font-weight:700;">#${block.index}</span>
        </div>
        <div class="block-row">
          <span class="block-lbl">TIMESTAMP:</span>
          <span>${block.timestamp} UTC</span>
        </div>
        <div class="block-row">
          <span class="block-lbl">TRUST PROVIDER:</span>
          <span>${block.provider}</span>
        </div>
        <div class="block-row">
          <span class="block-lbl">VERIFIED EVENT:</span>
          <span style="color:var(--primary);">${block.event}</span>
        </div>
        <div class="block-row">
          <span class="block-lbl">TRUST INCENTIVE:</span>
          <span style="color:var(--escrow-gold); font-weight:700;">+${block.pointsChange} KP</span>
        </div>
        <div class="block-row" style="border-top:1px dashed #333; padding-top:6px; margin-top:4px;">
          <span class="block-lbl">PREV BLOCK HASH:</span>
          <span style="font-size:10px; color:#AEAEB2; word-break:break-all;">${block.prevHash}</span>
        </div>
        <div class="block-row">
          <span class="block-lbl">CURRENT HASH:</span>
          <span class="block-val-hash">${block.hash}</span>
        </div>
      `;

      pane.appendChild(blockCard);
    });
  }

  // 11. FORM SELECTION & PUBLISHING
  selectFormScope(element, scopeName) {
    this.newProblemScope = scopeName;
    const cards = document.querySelectorAll(".category-radio-btn");
    cards.forEach(c => c.classList.remove("selected"));
    element.classList.add("selected");

    // Show/hide address inputs
    const geoGroup = document.getElementById("form-geolocation-group");
    if (scopeName === "Physical") {
      geoGroup.style.display = "block";
    } else {
      geoGroup.style.display = "none";
    }
  }

  submitNewProblem() {
    const titleVal = document.getElementById("post-title").value.trim();
    const descVal = document.getElementById("post-desc").value.trim();
    const cashVal = parseFloat(document.getElementById("post-cash").value);
    const karmaBountyVal = parseInt(document.getElementById("post-karma").value);
    const addressVal = document.getElementById("post-address").value.trim() || "Digital Delivery Portal";

    if (!titleVal || !descVal || isNaN(cashVal) || isNaN(karmaBountyVal)) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (this.currentUser.activeRole !== "Seeker") {
      alert("You must switch to Client Mode to publish tasks and lock escrows.");
      return;
    }

    if (cashVal > this.currentUser.cashWallet) {
      alert("You cannot lock more cash than you currently hold in your wallet.");
      return;
    }

    // Deduct cash and lock in Escrow account
    this.currentUser.cashWallet -= cashVal;
    this.currentUser.escrowLocked += cashVal;

    const newGig = {
      id: this.problems.length + 1,
      title: titleVal,
      scope: this.newProblemScope,
      category: this.newProblemScope === "Virtual" ? "Virtual / Academic" : "Hyperlocal Physical",
      cashBounty: cashVal,
      karmaBounty: karmaBountyVal,
      seeker: {
        name: this.currentUser.username,
        avatar: this.currentUser.avatar,
        rank: "Client Parent"
      },
      address: addressVal,
      coordinates: this.newProblemScope === "Physical" ? { start: { x: 40, y: 50 }, end: { x: 560, y: 180 } } : null,
      description: descVal,
      views: 1,
      date: "Just now",
      status: "POSTED",
      escrowStatus: "LOCKED",
      solutions: []
    };

    this.problems.unshift(newGig);

    // Reset Form
    document.getElementById("post-title").value = "";
    document.getElementById("post-desc").value = "";
    document.getElementById("post-cash").value = 25;
    document.getElementById("post-karma").value = 30;
    document.getElementById("post-address").value = "";

    this.showToast("Escrow Locked!", `Secured ₹${cashVal.toFixed(2)} in task Escrow contract.`, false);
    this.updateUserWidgets();
    this.switchView("feed");
  }

  // 12. DUAL-MODE HUB DASHBOARD GENERATOR
  renderHubDashboard() {
    const statsGrid = document.getElementById("hub-stats-grid");
    const activeList = document.getElementById("hub-active-problems-list");
    const asideBox = document.getElementById("hub-aside-box");

    // Dynamic Title & Header
    const hubTitle = document.getElementById("hub-header-title");
    const hubSub = document.getElementById("hub-header-subtitle");
    const hubListTitle = document.getElementById("hub-list-title");

    activeList.innerHTML = "";

    if (this.currentUser.activeRole === "Student") {
      hubTitle.innerText = "Student Command Center";
      hubSub.innerText = "Monitor active hyperlocal gigs, claimed virtual homework, audited trust ledger hashes, and cash earnings.";
      hubListTitle.innerText = "My Claimed Gigs";

      // Render Student Stats Grid
      statsGrid.innerHTML = `
        <div class="hub-stat-card">
          <span class="hub-stat-title">Cash Wallet</span>
          <span class="hub-stat-number" style="color:var(--cash-green);">₹${this.currentUser.cashWallet.toFixed(2)}</span>
          <span class="hub-stat-trend trend-up" style="color:var(--cash-green);">
            Lifetime Earned: ₹${this.currentUser.lifetimeEarnings.toFixed(2)}
          </span>
        </div>
        <div class="hub-stat-card">
          <span class="hub-stat-title">Trust Score</span>
          <span class="hub-stat-number" style="color:var(--escrow-gold);">${this.currentUser.karmaTrust} KP</span>
          <span class="hub-stat-trend trend-up" style="color:var(--escrow-gold);">
            Audited Ledger Blocks: ${this.trustLedger.length}
          </span>
        </div>
        <div class="hub-stat-card">
          <span class="hub-stat-title">Completed Tasks</span>
          <span class="hub-stat-number">${this.currentUser.solvesCount} Gigs</span>
          <span class="hub-stat-trend trend-flat">98% Acceptance Rate</span>
        </div>
      `;

      // Render Student claimed list
      const claimedGigs = this.problems.filter(p => 
        p.status !== "POSTED" && p.solutions.some(s => s.author === this.currentUser.username)
      );

      if (claimedGigs.length === 0) {
        activeList.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
            You have no active claims. Browse the Marketplace to claim gigs!
          </div>
        `;
      } else {
        claimedGigs.forEach(p => {
          const item = document.createElement("div");
          item.className = "dashboard-list-item";
          item.onclick = () => this.viewProblemDetails(p.id);
          item.style.cursor = "pointer";

          item.innerHTML = `
            <div>
              <span class="dash-item-title">${p.title}</span>
              <div class="dash-item-meta">${p.category} • Bounty: ₹${p.cashBounty.toFixed(2)}</div>
            </div>
            <span class="badge-pill" style="background: rgba(0,0,0,0.04); color: var(--primary); font-size: 11px;">
              ${p.status.replace('_', ' ')}
            </span>
          `;
          activeList.appendChild(item);
        });
      }

      // Update student prestige panel in Hub dynamically
      const activeRank = this.currentUser.rankName || this.getUserRankName(this.currentUser.karmaTrust);
      document.getElementById("hub-rank-name").innerText = activeRank;
      document.getElementById("hub-rank-tier").innerText = `Level ${Math.floor(this.currentUser.karmaTrust / 120) + 1} Trust Provider`;
      document.getElementById("hub-karma-progress").innerText = `${this.currentUser.karmaTrust} / 500 KP`;
      
      const percent = Math.min(100, (this.currentUser.karmaTrust / 500) * 100);
      document.getElementById("hub-progress-bar-fill").style.width = `${percent}%`;
      
      const initials = this.currentUser.username.split(' ').map(n => n[0]).join('');
      document.getElementById("hub-avatar-initials").innerText = initials.toUpperCase().substring(0, 2);

      // Restore Student prestige box
      asideBox.style.display = "block";

    } else {
      // Seeker Mode Dashboard
      hubTitle.innerText = "Client Command Center";
      hubSub.innerText = "Create task escrows, manage active local/digital gigs, review submissions, and release payments.";
      hubListTitle.innerText = "Active Posted Tasks";

      // Render Seeker Stats Grid
      statsGrid.innerHTML = `
        <div class="hub-stat-card">
          <span class="hub-stat-title">Escrow Lockbox</span>
          <span class="hub-stat-number" style="color:var(--escrow-gold);">₹${this.currentUser.escrowLocked.toFixed(2)}</span>
          <span class="hub-stat-trend trend-up" style="color:var(--text-muted);">
            Active Escrow Accounts: ${this.problems.filter(p => p.seeker.name === this.currentUser.username && p.escrowStatus === 'LOCKED').length}
          </span>
        </div>
        <div class="hub-stat-card">
          <span class="hub-stat-title">Remaining Wallet</span>
          <span class="hub-stat-number" style="color:var(--cash-green);">₹${this.currentUser.cashWallet.toFixed(2)}</span>
          <span class="hub-stat-trend trend-up">
            Pre-funded Balance
          </span>
        </div>
        <div class="hub-stat-card">
          <span class="hub-stat-title">Total Gigs Posted</span>
          <span class="hub-stat-number">${this.problems.filter(p => p.seeker.name === this.currentUser.username).length} Gigs</span>
          <span class="hub-stat-trend trend-flat">Active Campus Gigs</span>
        </div>
      `;

      // Render Seeker posted tasks list
      const postedGigs = this.problems.filter(p => p.seeker.name === this.currentUser.username);

      if (postedGigs.length === 0) {
        activeList.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
            You have no posted tasks yet. Switch to "Post a Task" to fund an Escrow!
          </div>
        `;
      } else {
        postedGigs.forEach(p => {
          const item = document.createElement("div");
          item.className = "dashboard-list-item";
          item.onclick = () => this.viewProblemDetails(p.id);
          item.style.cursor = "pointer";

          item.innerHTML = `
            <div>
              <span class="dash-item-title">${p.title}</span>
              <div class="dash-item-meta">${p.category} • Pledged: ₹${p.cashBounty.toFixed(2)}</div>
            </div>
            <span class="badge-pill" style="background: rgba(0,0,0,0.04); color: var(--cash-green); font-size: 11px;">
              ${p.status.replace('_', ' ')}
            </span>
          `;
          activeList.appendChild(item);
        });
      }

      // Hide prestige box in seeker mode (not applicable)
      asideBox.style.display = "none";
    }
  }

  // 13. AUDITED LEADERBOARD RENDER
  renderLeaderboard() {
    this.syncUserToLeaderboard();
    const tableBody = document.getElementById("leaderboard-rows-container");
    tableBody.innerHTML = "";

    this.leaderboard.forEach(member => {
      const row = document.createElement("tr");

      let rankClass = "";
      if (member.rank === 1) rankClass = "rank-gold";
      if (member.rank === 2) rankClass = "rank-silver";
      if (member.rank === 3) rankClass = "rank-bronze";

      const isMe = member.name === this.currentUser.username;
      if (isMe) {
        row.style.background = "rgba(0, 122, 255, 0.03)";
        row.style.fontWeight = "600";
      }

      row.innerHTML = `
        <td class="rank-cell ${rankClass}">#${member.rank}</td>
        <td>
          <div class="member-cell">
            <img src="${member.avatar}" class="member-avatar" alt="avatar">
            <div>
              <span class="member-name">${member.name} ${isMe ? ' (You)' : ''}</span>
              <div style="font-size: 11px; color: var(--text-muted);">${member.specialty}</div>
            </div>
          </div>
        </td>
        <td style="font-size: 13px; color: var(--text-muted);">${member.specialty}</td>
        <td class="council-points">${member.score} KP</td>
        <td>
          <span class="badge-pill ${member.badgeClass}">${member.badgeName}</span>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  // 14. HIGH-CONCURRENCY REAL-TIME EVENT STREAM SIMULATOR
  initSimulation() {
    const studentNames = ["David_K", "Sophia_W", "Julian", "Chloe_B", "DevWizard"];
    const virtualTaskNames = ["Solve Calculus Differential Equations", "Proofread Term Paper on Epistemic Models", "Write Custom JavaScript WebGL Instancing buffers"];
    const physicalTaskNames = ["Wash Sedan near Campus Parking Lot B", "Deliver laundry groceries from counter", "Grocery Drop-off Dorm A Lobby"];

    setInterval(() => {
      // 35% chance of triggering simulated high-concurrency platform activity
      if (Math.random() < 0.35) {
        const student = studentNames[Math.floor(Math.random() * studentNames.length)];
        const isVirtual = Math.random() < 0.5;
        const taskTitle = isVirtual 
          ? virtualTaskNames[Math.floor(Math.random() * virtualTaskNames.length)]
          : physicalTaskNames[Math.floor(Math.random() * physicalTaskNames.length)];

        const cash = Math.floor(Math.random() * 45) + 15;
        const rollEvent = Math.random();

        if (rollEvent < 0.3) {
          // Event A: Student claims a task
          this.showToast(
            "Task Claimed!", 
            `**${student}** claimed "${taskTitle.substring(0,30)}..." • **₹${cash} Locked in Escrow**`,
            false
          );
        } else if (rollEvent < 0.6) {
          // Event B: Seeker releases payment, appends a block
          const points = Math.floor(Math.random() * 20) + 20;
          this.showToast(
            "Escrow Disbursed!", 
            `**₹${cash.toFixed(2)} Cash** released to **${student}**! +${points} KP Trust verified.`,
            true
          );
        } else {
          // Event C: Dynamic cryptographic verification block trigger
          const blockIndex = this.trustLedger.length + Math.floor(Math.random() * 100) + 10;
          const hashSnippet = Math.abs(Math.random() * 100000).toString(16).padEnd(6, '0');
          this.showToast(
            "Ledger Appended!", 
            `Trust Block **#${blockIndex}** verified. Cryptographic hash recorded: \`00f68a${hashSnippet}...\``,
            false
          );
        }
      }
    }, 18000);
  }

  // Custom visual toasts
  showToast(title, bodyText, isSolve = false) {
    const toastLayer = document.getElementById("toast-layer");
    if (!toastLayer) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    
    // Icon styles based on event type
    let iconClass = "";
    let symbol = "✦";

    if (isSolve) {
      iconClass = "solve-toast"; // Gold trust points
      symbol = "★";
    } else if (bodyText.includes("Cash") || bodyText.includes("₹")) {
      iconClass = "cash-toast"; // Cash dollar wallet
      symbol = "₹";
    }

    toast.innerHTML = `
      <div class="toast-icon ${iconClass}">${symbol}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${bodyText}</div>
      </div>
    `;

    toastLayer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4500);
  }

  // Preset Avatar selector
  selectAvatarPreset(imgEl) {
    const items = document.querySelectorAll(".avatar-preset-item");
    items.forEach(item => item.classList.remove("selected"));
    imgEl.classList.add("selected");
    
    // Clear custom uploader preview
    const uploadCard = document.getElementById('custom-upload-card');
    const previewImg = document.getElementById('custom-upload-preview');
    const fileInput = document.getElementById('acc-avatar-file');
    
    if (uploadCard && previewImg) {
      uploadCard.classList.remove('selected');
      uploadCard.classList.remove('has-preview');
      previewImg.src = '';
    }
    if (fileInput) {
      fileInput.value = '';
    }

    document.getElementById("acc-avatar-url").value = imgEl.src;
  }

  // Uploader Drag and Drop listeners initialization
  initAvatarUploadListeners() {
    const card = document.getElementById("custom-upload-card");
    if (!card) return;

    // Drag over feedback
    ['dragenter', 'dragover'].forEach(eventName => {
      card.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        card.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      card.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        card.classList.remove('dragover');
      }, false);
    });

    // Drop file
    card.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        this.processAvatarFile(files[0]);
      }
    }, false);
  }

  // Handle Avatar image file upload
  handleAvatarFileUpload(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.processAvatarFile(files[0]);
    }
  }

  // Process selected photo file
  processAvatarFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    // Limit size to 5MB to be safe with base64 storage limits
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      
      // Update custom upload preview
      const previewImg = document.getElementById('custom-upload-preview');
      const uploadCard = document.getElementById('custom-upload-card');
      
      if (previewImg && uploadCard) {
        previewImg.src = dataUrl;
        uploadCard.classList.add('has-preview');
        uploadCard.classList.add('selected');
      }

      // De-select preset images
      const items = document.querySelectorAll(".avatar-preset-item");
      items.forEach(item => item.classList.remove("selected"));

      // Set underlying URL/Base64 input value
      document.getElementById("acc-avatar-url").value = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  // Helper to compute Rank Badge Tier Name based on Trust Score
  getUserRankName(points) {
    if (points >= 500) return "Grandmaster";
    if (points >= 300) return "Expert Solver";
    if (points >= 150) return "Elite Scholar";
    return "Silver Solver";
  }

  // Create new user profile account
  createNewProfile() {
    const username = document.getElementById("acc-username").value.trim();
    const role = document.getElementById("acc-role").value;
    const specialty = document.getElementById("acc-specialty").value.trim();
    const avatarUrl = document.getElementById("acc-avatar-url").value.trim();
    const cashVal = parseFloat(document.getElementById("acc-cash").value) || 0;
    const karmaVal = parseInt(document.getElementById("acc-karma").value) || 0;

    if (!username) {
      alert("Please enter a valid display name.");
      return;
    }

    // Update global currentUser state
    this.currentUser.username = username;
    this.currentUser.avatar = avatarUrl;
    this.currentUser.activeRole = role;
    this.currentUser.cashWallet = cashVal;
    this.currentUser.karmaTrust = karmaVal;
    this.currentUser.lifetimeEarnings = cashVal;
    this.currentUser.solvesCount = Math.floor(karmaVal / 20); // mock task solves count proportionally
    
    // Calculate new rank
    const newRankName = this.getUserRankName(karmaVal);
    this.currentUser.rankName = newRankName;

    // Apply role visuals
    this.setRole(role);

    // Sync to leaderboard
    this.syncUserToLeaderboard();

    // Show Success Toast
    this.showToast(
      "Profile Activated!", 
      `Welcome to Karma, **${username}**! Profile set as **${newRankName}** (${role}).`, 
      true
    );

    // Dynamic animation on user widget stats updating
    const widgetCash = document.getElementById("widget-cash");
    const widgetKarma = document.getElementById("widget-karma");
    widgetCash.classList.remove("pulse-number");
    widgetKarma.classList.remove("pulse-number");
    void widgetCash.offsetWidth; // trigger reflow
    void widgetKarma.offsetWidth; // trigger reflow
    widgetCash.classList.add("pulse-number");
    widgetKarma.classList.add("pulse-number");

    // Redirect to Hub Dashboard
    this.switchView("hub");
  }

  // Dynamic Peer-to-Peer Secure Chat UI Renderer
  renderChatUI(prob) {
    const chatContainer = document.getElementById("detail-chat-container");
    if (!chatContainer) return;

    // Always ensure visible in detailed view
    chatContainer.style.display = "block";

    const chatBody = document.getElementById("chat-messages-container");
    const chatHeader = chatContainer.querySelector(".chat-header");
    const chatFooter = chatContainer.querySelector(".chat-footer-input");

    // Initialize chatHistory array if not exists
    if (!prob.chatHistory) {
      prob.chatHistory = [];
    }

    // Determine client and provider names
    const clientName = prob.seeker.name;
    const providerName = prob.status === "POSTED" ? "Student Provider" : (prob.solutions[0]?.author || "Student Provider");

    // Dynamic Connection Header Title
    document.getElementById("chat-participants-title").innerText = `Secure Channel: ${clientName} • ${providerName}`;

    if (prob.status === "POSTED") {
      // Locked State
      chatBody.innerHTML = `
        <div class="chat-locked-state">
          <div class="chat-locked-icon">🔒</div>
          <h4 style="font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--charcoal);">Channel Secured & Encrypted</h4>
          <p style="font-size: 12.5px; color: var(--text-muted); line-height: 1.5; max-width: 320px; margin: 0 auto;">Escrow deposit pending. Peer-to-peer secure messaging unlocks automatically once a student claims this gig.</p>
        </div>
      `;
      chatFooter.style.display = "none";
      chatHeader.querySelector(".chat-status-pulse").style.backgroundColor = "var(--escrow-gold)";
    } else {
      // Unlocked State
      chatFooter.style.display = "flex";
      chatHeader.querySelector(".chat-status-pulse").style.backgroundColor = "var(--cash-green)";

      // If empty, pre-populate a realistic greeting message
      if (prob.chatHistory.length === 0) {
        prob.chatHistory.push({
          sender: clientName,
          avatar: prob.seeker.avatar,
          role: "Seeker",
          message: `Hi there! Pledged ₹${prob.cashBounty.toFixed(2)} is locked in Escrow. I'm ready to coordinate details for "${prob.title}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Render Messages
      chatBody.innerHTML = "";
      prob.chatHistory.forEach(msg => {
        const isMe = msg.sender === this.currentUser.username;
        const bubble = document.createElement("div");
        bubble.className = `chat-message-bubble ${isMe ? 'message-sent' : 'message-received'}`;

        bubble.innerHTML = `
          <div class="message-avatar-row">
            <img src="${msg.avatar}" class="chat-msg-avatar" alt="avatar">
            <span class="chat-msg-sender">${msg.sender} (${msg.role})</span>
          </div>
          <div class="chat-message-text">${msg.message}</div>
          <span class="chat-msg-time">${msg.timestamp}</span>
        `;
        chatBody.appendChild(bubble);
      });

      // Scroll to bottom
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // Send active chat messages and trigger AI agent simulator responses
  sendChatMessage() {
    const input = document.getElementById("chat-message-input");
    if (!input) return;

    const messageText = input.value.trim();
    if (!messageText) return;

    const prob = this.problems.find(p => p.id === this.activeProblemId);
    if (!prob) return;

    // Append sender message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    prob.chatHistory.push({
      sender: this.currentUser.username,
      avatar: this.currentUser.avatar,
      role: this.currentUser.activeRole === "Student" ? "Student" : "Seeker",
      message: messageText,
      timestamp: timestamp
    });

    // Clear input
    input.value = "";

    // Re-render chat lists
    this.renderChatUI(prob);

    // Trigger Typing simulator
    const chatBody = document.getElementById("chat-messages-container");
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.id = "chat-typing-indicator";
    typingIndicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate response delay
    setTimeout(() => {
      // Remove typing indicator if it exists
      const indicator = document.getElementById("chat-typing-indicator");
      if (indicator) indicator.remove();

      // Ensure we are still viewing the same problem thread
      if (this.activeProblemId !== prob.id) return;

      // Determine receiver details
      const receiverRole = this.currentUser.activeRole === "Student" ? "Seeker" : "Student";
      const receiverName = receiverRole === "Seeker" ? prob.seeker.name : (prob.solutions[0]?.author || "Elena Rostova");
      const receiverAvatar = receiverRole === "Seeker" 
        ? prob.seeker.avatar 
        : (this.problems.find(p => p.id === prob.id)?.solutions[0]?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena");

      // Generate context-aware AI simulated answer
      let simulatedMessage = "";

      if (receiverRole === "Seeker") {
        // Seeker Client replies to Student Provider
        if (prob.category.toLowerCase().includes("physical")) {
          const physicalResponses = [
            "Awesome, thanks for the quick reply! I'm nearby. Just let me know once you drop it off.",
            "Got it! Yes, the keys/supplies are right where I specified in the instructions.",
            "Perfect. Let me know when you reach coordinates, and I will keep an eye on the GPS tracker.",
            "Great job, looking forward to the delivery! Just drop it in the lobby.",
            "Understood, thank you. Ping me here if you run into any issues on campus!"
          ];
          simulatedMessage = physicalResponses[Math.floor(Math.random() * physicalResponses.length)];
        } else {
          const virtualResponses = [
            "Excellent. Please make sure the steps are highly detailed and readable.",
            "Perfect, thank you for working on this! Let me know if you have any questions about the math constraints.",
            "Sounds good! Take your time, quality is the most important part.",
            "Great, please attach the final sheets link or text here when you submit the work.",
            "Got it. I'll be online to approve and release the escrow payout immediately upon completion."
          ];
          simulatedMessage = virtualResponses[Math.floor(Math.random() * virtualResponses.length)];
        }
      } else {
        // Student Provider replies to Seeker Client
        if (prob.category.toLowerCase().includes("physical")) {
          const studentPhysicalResponses = [
            "I'm on my way to the starting coordinate node now. Should be there in 5 minutes!",
            "I've arrived and located the items. Starting work immediately.",
            "Perfect, I am picking up the duffel now and heading directly to the Dorm Hall B lobby.",
            "Just finished the job! Everything is in place. I am uploading the completion details now.",
            "Sure thing! The weather is great, so this will be done quickly. I'll message you when done."
          ];
          simulatedMessage = studentPhysicalResponses[Math.floor(Math.random() * studentPhysicalResponses.length)];
        } else {
          const studentVirtualResponses = [
            "I am reviewing the characteristic roots of the differential equations now. Rest assured, calculations will be detailed!",
            "On it! Hand-drafting the step diagram sheets as requested.",
            "I'm about 50% finished with the homework solutions. Will compile into clean markdown soon.",
            "Differential solvers are fully formatted. Submitting the proof sheet deliverables now!",
            "Excellent, I'm verifying the characteristic root characteristic solutions to ensure 100% correct bounds."
          ];
          simulatedMessage = studentVirtualResponses[Math.floor(Math.random() * studentVirtualResponses.length)];
        }
      }

      // Record in history
      prob.chatHistory.push({
        sender: receiverName,
        avatar: receiverAvatar,
        role: receiverRole,
        message: simulatedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Re-render
      this.renderChatUI(prob);

      // Trigger a beautiful notification
      this.showToast(
        `New Message from ${receiverName}`,
        `"${simulatedMessage.substring(0, 45)}..."`,
        false
      );
    }, 1500);
  }
}

// Initialize App
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new KarmaApp();
  window.app = app;
});
