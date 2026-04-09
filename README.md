# 📘 StudyTrack

A modern study management application built with React, TypeScript, and Vite. Track subjects, modules, topics, and manage your learning journey with beautiful UI and powerful features.

## ✨ Features

### 🎓 Core Study Management
- **Subject Management**: Add, organize, and track subjects with custom icons and colors
- **Module Organization**: Structure subjects into modules for better learning
- **Topic Tracking**: Break down modules into topics with completion tracking
- **Progress Tracking**: Visual progress bars showing completion percentage for subjects and overall study journey

### 📚 University Templates
- **Pre-built Curriculum**: Choose from university templates with complete curriculum structure
- **VIT Vellore** included with:
  - Applied Chemistry (6 modules)
  - Discrete Mathematics & Linear Algebra (6 modules)
  - Operating Systems (6 modules)
  - Data Structures & Algorithms (5 modules)
- **One-Click Import**: Select subjects and add entire module structure with one click

### ⏱️ Focus Timer
- **Pomodoro Timer**: Customizable work and break intervals
- **Session Tracking**: Track study sessions with duration
- **Focus Mode**: Dedicated timer interface for distraction-free studying

### 📊 Statistics & Analytics
- **Study Time Analytics**: Track total study hours and minutes
- **Completion Stats**: See completion percentage for each subject
- **Streak Tracking**: Maintain and view your study streak days
- **Performance Insights**: Identify weak subjects and areas needing attention

### 👤 User Profile
- **Profile Management**: Store registration number, name, branch, college info
- **Study Metrics**: View personal study statistics and achievements
- **Account Settings**: Manage profile information

### 🛡️ Admin Panel (Secure)
Access restricted to authorized administrators only (`reg_no: "25BYB0101"`)

#### Users Dashboard
- View all registered users
- Monitor user study metrics (study time, streak, etc.)
- Delete user accounts if needed
- User management table with detailed information

#### Templates Management
- View all university templates
- Edit template information
- Add/remove templates
- Manage curriculum structure

#### System Settings
- Enable/disable features
- Configure system parameters
- Data backup management
- Audit logging
- User activity monitoring
- Danger zone for advanced operations

### 🔐 Security Features
- **Role-Based Access Control**: Admin panel only accessible to authorized users
- **URL Protection**: Cannot bypass admin access via direct URL
- **Server-Side Validation**: Admin status verified on every session
- **Auth Integration**: Supabase authentication for secure login

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Context API
- **Database**: PostgreSQL via Supabase

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account
- GitHub account (optional, for deployment)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/anur1g5473/StudyTrack.git
cd StudyTrack
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - Create a Supabase project at https://supabase.com
   - Get your project URL and anon key
   - Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Setup Database**
   - Run the SQL schemas from `supabase/schema.sql`, `schema2.sql`, and `schema3.sql` in your Supabase SQL editor

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📝 Database Schema

### Tables
- **profiles**: User profile information (reg_no, name, branch, college, study stats)
- **subjects**: Subject entries with icon and color
- **modules**: Module groupings within subjects
- **topics**: Individual topics within modules with completion status
- **study_sessions**: Recording of study session timestamps and duration

## 🚀 Build & Deployment

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

### Deploy to Production
The app can be deployed to:
- **Vercel**: Connect GitHub repo and auto-deploy
- **Netlify**: Drag & drop the `dist/` folder
- **GitHub Pages**: Configure in Settings
- **Any static hosting**: Serve the `dist/` folder

## 📱 App Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Login/signup interface
│   ├── Home.tsx        # Dashboard with quick actions
│   ├── Subjects.tsx    # Subject list and management
│   ├── SubjectDetail.tsx     # Subject details with modules
│   ├── TopicDetail.tsx       # Topic details and study notes
│   ├── Focus.tsx       # Pomodoro timer
│   ├── Stats.tsx       # Statistics and analytics
│   ├── Profile.tsx     # User profile management
│   ├── Templates.tsx   # University template selector
│   ├── Admin.tsx       # Admin panel (12KB, secure)
│   ├── Layout.tsx      # Main layout wrapper
│   ├── BottomNav.tsx   # Navigation bar
│   └── ...
├── context/
│   └── AppContext.tsx  # Global app state with admin auth
├── data/
│   └── templates.ts    # University curriculum templates
├── lib/
│   └── supabase.ts     # Supabase client
├── types/
│   └── index.ts        # TypeScript interfaces
└── utils/
    └── cn.ts           # Utility functions
```

## 🎯 Usage Guide

### For Students
1. **Sign up** with registration number and college info
2. **Add subjects** either manually or via templates
3. **Track topics** as you study
4. **Use Focus mode** for Pomodoro sessions
5. **View stats** to monitor progress

### For Admins
1. Log in with authorized account (`reg_no: 25BYB0101`)
2. Access **Admin Panel** from home quick actions
3. **Users Tab**: Monitor and manage user accounts
4. **Templates Tab**: Edit curriculum templates
5. **Settings Tab**: Configure system parameters

## 🔄 Features Roadmap

- [ ] Offline mode support
- [ ] Dark/Light theme toggle
- [ ] Export study data to PDF
- [ ] Study notes editor with rich text
- [ ] Collaborative study groups
- [ ] Mobile app (React Native)
- [ ] AI-powered study insights
- [ ] Integration with Google Calendar

## 🐛 Known Issues

- Line ending warnings during git operations (cosmetic, doesn't affect functionality)
- Deprecated baseUrl in tsconfig (set ignoreDeprecations for now)

## 📄 License

MIT License - feel free to use this project for education and personal use.

## 👨‍💻 Author

**Anura** - [@anur1g5473](https://github.com/anur1g5473)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review the codebase for examples

## 🙏 Acknowledgments

- VIT Vellore curriculum structure for template
- Supabase for backend infrastructure
- React community for amazing ecosystem
- Tailwind CSS for styling framework
- Lucide for beautiful icons

---

**Happy Learning! 📚✨**

Last Updated: April 2026
