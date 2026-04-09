# ClientLoop - Product Documentation

## 📖 Product Overview

### What is ClientLoop?

ClientLoop is a **subscription-based B2B SaaS web application** designed specifically for agencies, freelancers, and consultants who work with clients. It provides a clean, professional client-facing portal that enables seamless communication without giving clients access to internal project management tools.

### Target Users

| User Type | Use Case |
|-----------|----------|
| **Digital Agencies** | Share design mockups, get approvals, collect feedback |
| **Marketing Agencies** | Share campaign assets, reports, and strategy documents |
| **Web Development Shops** | Share progress updates, staging links, and milestones |
| **Freelance Designers** | Professional client presentation and approval workflow |
| **Consultants** | Share deliverables and recommendations with clients |

### Core Value Proposition

> **"Your clients deserve clarity, not chaos."**

ClientLoop replaces the messy combination of:
- ❌ WhatsApp groups for quick updates
- ❌ Email threads for file sharing
- ❌ Google Drive links scattered everywhere
- ❌ Giving full ClickUp/Notion access to clients

With:
- ✅ One clean, professional portal
- ✅ Clear update timeline
- ✅ One-click approvals
- ✅ Organized file sharing
- ✅ Contextual comments

---

## 🎯 Design Principles

### 1. Extremely Simple UI
Clients should not need onboarding. The interface is self-explanatory with large, clear buttons and minimal cognitive load.

### 2. Fast and Distraction-Free
No unnecessary features or complex navigation. Focus on the core workflow: View → Review → Approve.

### 3. Clear Status Visibility
At a glance, both agencies and clients know exactly:
- What's pending
- What's approved
- What needs changes

### 4. Professional and Trustworthy Look
The design exudes professionalism through:
- Clean typography (Inter font)
- Neutral colors with subtle accent
- Soft shadows and rounded corners
- Smooth animations

### 5. Responsive Across Devices
Works perfectly on:
- Desktop computers
- Tablets
- Mobile phones (touch-optimized)

### 6. Feature-Limited by Design
We intentionally **exclude**:
- ❌ Internal task boards
- ❌ Team chat
- ❌ Time tracking
- ❌ Calendars
- ❌ Gantt charts
- ❌ Kanban boards
- ❌ CRM features

This keeps ClientLoop focused on **client communication only**.

---

## 👤 User Journeys

### Agency User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        AGENCY WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. CREATE CLIENT                                              │
│   └── Add client name, email, contact person                   │
│                                                                 │
│   2. CREATE PROJECT                                             │
│   └── Add project name, description, assign to client          │
│                                                                 │
│   3. POST UPDATE                                                │
│   ├── Write update title and description                       │
│   ├── Attach files (mockups, PDFs, etc.)                       │
│   └── Toggle "Request Approval" if needed                      │
│                                                                 │
│   4. WAIT FOR CLIENT RESPONSE                                   │
│   ├── View pending approvals in dashboard                      │
│   └── Receive notification when client responds                │
│                                                                 │
│   5. REVIEW FEEDBACK                                            │
│   ├── Read client comments                                     │
│   ├── Address change requests                                  │
│   └── Post follow-up update if needed                          │
│                                                                 │
│   6. MARK PROJECT COMPLETE                                      │
│   └── Change status to "Completed"                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Client User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. RECEIVE EMAIL NOTIFICATION                                 │
│   └── "New update posted for [Project Name]"                   │
│                                                                 │
│   2. LOGIN TO PORTAL                                            │
│   └── Simple login with email/password                         │
│                                                                 │
│   3. VIEW PROJECT UPDATES                                       │
│   ├── See timeline of all updates                              │
│   └── Download attached files                                  │
│                                                                 │
│   4. REVIEW AND DECIDE                                          │
│   ├── Read update description                                  │
│   ├── Review attached mockups/files                            │
│   └── Leave comments if questions                              │
│                                                                 │
│   5. TAKE ACTION                                                │
│   ├── Click "Approve" if satisfied                             │
│   └── Click "Request Changes" with feedback                    │
│                                                                 │
│   6. DONE                                                       │
│   └── Agency is notified of your response                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Feature Specifications

### Project Status States

| Status | Description | Badge Color |
|--------|-------------|-------------|
| **Not Started** | Project created but work hasn't begun | Gray |
| **In Progress** | Active work is being done | Blue |
| **Waiting for Approval** | Client action required | Orange/Yellow |
| **Completed** | Project finished | Green |

### Approval Status States

| Status | Description | Badge Color | Action |
|--------|-------------|-------------|--------|
| **Pending** | Awaiting client response | Orange | Client can Approve or Request Changes |
| **Approved** | Client approved the update | Green | No action needed |
| **Changes Requested** | Client wants revisions | Red | Agency should address feedback |

### Update Types

| Type | Description | Icon |
|------|-------------|------|
| **Progress** | Regular project update | FileText |
| **Milestone** | Major milestone reached | Flag |
| **Delivery** | Final deliverable shared | Package |

### File Types Supported

| Category | Extensions | Max Size |
|----------|------------|----------|
| Documents | PDF, DOCX, XLSX | 50MB |
| Images | PNG, JPG, GIF, WEBP | 50MB |
| Design Files | PSD, AI, SKETCH, FIG | 100MB |
| Archives | ZIP, RAR | 200MB |

---

## 💰 Subscription Plans

### Plan Comparison

| Feature | Free | Starter | Agency |
|---------|------|---------|--------|
| **Price** | $0/forever | $19/month | $49/month |
| **Clients** | 1 | Up to 5 | Unlimited |
| **Projects** | 3 | Unlimited | Unlimited |
| **Updates** | Basic | Full | Full |
| **Approval Workflows** | ❌ | ✅ | ✅ |
| **File Storage** | 50MB | 5GB | 50GB |
| **Team Members** | 1 | 3 | 10 |
| **Custom Branding** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | Email | Phone + Email |
| **Analytics** | ❌ | Basic | Advanced |

### Plan Enforcement

The system enforces subscription limits:

- **Client Limit**: Cannot add more clients than plan allows
- **Storage Limit**: File uploads blocked when storage is full
- **Team Limit**: Cannot invite more team members

When limits are reached, users see:
1. Warning banner on dashboard
2. Disabled "Add" buttons
3. Prompt to upgrade

---

## 🔔 Notification System

### Email Notifications

| Event | Recipient | Email Template |
|-------|-----------|----------------|
| New update posted | Client | "New Update on [Project]" |
| Approval requested | Client | "Approval Needed: [Update Title]" |
| Update approved | Agency | "[Client] Approved Your Update" |
| Changes requested | Agency | "[Client] Requested Changes" |
| New comment | Both | "New Comment on [Update]" |

### In-App Notifications

| Type | Icon | Description |
|------|------|-------------|
| Approval | CheckCircle | Update was approved |
| Changes | AlertCircle | Changes were requested |
| Comment | MessageSquare | New comment added |
| Update | FileText | New update posted |

---

## 🎨 Design System

### Color Palette

**Primary Colors (Indigo/Violet)**
```css
--color-primary-50:  #eef2ff  /* Lightest */
--color-primary-100: #e0e7ff
--color-primary-200: #c7d2fe
--color-primary-300: #a5b4fc
--color-primary-400: #818cf8
--color-primary-500: #6366f1  /* Main */
--color-primary-600: #4f46e5  /* Hover */
--color-primary-700: #4338ca
--color-primary-800: #3730a3
--color-primary-900: #312e81  /* Darkest */
```

**Semantic Colors**
```css
--color-success: #10b981  /* Approved, Completed */
--color-warning: #f59e0b  /* Pending, Waiting */
--color-error:   #ef4444  /* Changes Requested */
--color-info:    #3b82f6  /* In Progress */
```

### Typography

| Element | Size | Weight | Use Case |
|---------|------|--------|----------|
| Page Title | 24px (1.5rem) | Bold (700) | Page headers |
| Section Title | 18px (1.125rem) | Semibold (600) | Card headers |
| Body Text | 16px (1rem) | Regular (400) | Content |
| Small Text | 14px (0.875rem) | Regular (400) | Secondary info |
| Caption | 12px (0.75rem) | Medium (500) | Labels, helpers |

### Spacing Scale

```css
--space-1:  4px   (0.25rem)
--space-2:  8px   (0.5rem)
--space-3:  12px  (0.75rem)
--space-4:  16px  (1rem)
--space-5:  20px  (1.25rem)
--space-6:  24px  (1.5rem)
--space-8:  32px  (2rem)
--space-10: 40px  (2.5rem)
--space-12: 48px  (3rem)
--space-16: 64px  (4rem)
```

### Component Library

| Component | Description |
|-----------|-------------|
| `.btn` | Button variants (primary, secondary, ghost, danger) |
| `.card` | Container with shadow and border |
| `.badge` | Status indicators with color variants |
| `.form-input` | Text inputs, textareas, selects |
| `.modal` | Overlay dialogs |
| `.dropdown` | Menu dropdowns |
| `.avatar` | User avatars with gradients |
| `.timeline` | Vertical update timeline |
| `.tabs` | Tab navigation |
| `.table` | Data tables |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| **Desktop** | > 1024px | Full sidebar, multi-column grids |
| **Tablet** | 768px - 1024px | Collapsible sidebar, 2-column grids |
| **Mobile** | < 768px | No sidebar, single column, bottom nav |

### Mobile-Specific Adaptations

1. **Approval Buttons**: Full-width, stacked vertically
2. **Cards**: Single column layout
3. **Sidebar**: Hidden, accessible via hamburger menu
4. **Forms**: Full-width inputs
5. **Touch Targets**: Minimum 44px tap areas

---

## 🔒 Security Considerations

### Authentication

- Password hashing with bcrypt (salt rounds: 12)
- JWT tokens with 7-day expiry
- Refresh token rotation
- Rate limiting on login attempts

### Authorization

- Role-based access control (Agency vs Client)
- Resource-level permissions (clients can only see their projects)
- API endpoint protection

### Data Protection

- HTTPS enforced in production
- SQL injection prevention via parameterized queries
- XSS protection with React's built-in escaping
- CSRF tokens for form submissions

### File Security

- Signed URLs for file downloads
- Virus scanning on upload
- File type validation
- Size limits enforced

---

## 📈 Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Target | Description |
|--------|--------|-------------|
| **Time to First Approval** | < 24 hours | From update to client response |
| **Client Engagement Rate** | > 80% | Clients who respond to approvals |
| **Average Approvals per Week** | 5+ | Active usage indicator |
| **Client Satisfaction Score** | > 4.5/5 | Post-approval survey |
| **Agency Retention Rate** | > 90% | Monthly subscription retention |

### Analytics Events to Track

```javascript
// Key events for analytics
track('project_created', { clientId, projectName });
track('update_posted', { projectId, hasApproval, fileCount });
track('approval_requested', { updateId });
track('update_approved', { updateId, responseTime });
track('changes_requested', { updateId, reason });
track('comment_added', { updateId, authorRole });
track('file_downloaded', { fileId, fileType });
```

---

## 🚀 Launch Checklist

### Pre-Launch

- [ ] All pages tested on major browsers
- [ ] Mobile responsiveness verified
- [ ] Email templates designed
- [ ] Stripe integration tested
- [ ] Terms of Service and Privacy Policy
- [ ] GDPR compliance verified
- [ ] Performance optimization complete
- [ ] Error handling and 404 pages

### Post-Launch

- [ ] Analytics tracking verified
- [ ] Error monitoring setup (Sentry)
- [ ] Customer support channels ready
- [ ] Social media presence
- [ ] Blog content for SEO
- [ ] Feedback collection mechanism

---

## 📞 Contact & Support

- **Website**: https://clientloop.io
- **Support Email**: support@clientloop.io
- **Sales Email**: sales@clientloop.io
- **Status Page**: https://status.clientloop.io
- **Documentation**: https://docs.clientloop.io

---

*Last Updated: January 2026*
