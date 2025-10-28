# SocialNet - Planning Document

## Requirements

### Core Features
- **Mobile-First Design**: Responsive navigation with bottom tabs for mobile
- **User Authentication**: Phone number registration, email login, password recovery
- **Profile Management**: Photo upload, username, bio, privacy settings
- **Group Management**: Create, join, manage groups with member permissions
- **Location Sharing**: Granular privacy controls (nobody, public, friends, specific groups)
- **Social Features**: Block/unblock users, friend management
- **Real-time Messaging**: Group and direct messaging
- **Discovery**: Find nearby users and groups
- **Business Integration**: Local business features

### Technical Requirements
- React + TypeScript + Vite
- Supabase backend (auth, database, storage)
- Mobile-responsive design with bottom navigation
- Real-time subscriptions for messaging
- Image upload and optimization
- Geolocation services
- Push notifications (future)

## Design

### Mobile Navigation
- Bottom tab bar with 5 main sections: Home, Messages, Discover, Map, Profile
- Consistent with screenshot provided
- Smooth transitions and active states

### User Interface
- Modern, clean design with proper contrast
- Semantic color system using CSS custom properties
- Consistent spacing and typography
- Accessible components with proper ARIA labels

### Database Schema
- Users table with profiles, privacy settings
- Groups table with member management
- Messages table for real-time chat
- Locations table for position sharing
- Friendships table for social connections
- Blocks table for user blocking

## Tasks

### Phase 1: Mobile Navigation & Core UI (Priority: High) - COMPLETED
- [x] Fix mobile navigation layout and sizing
- [x] Implement bottom tab navigation matching screenshot
- [x] Create responsive design system
- [x] Add proper mobile viewport handling
- **Estimated effort**: 800 tokens

### Phase 2: Authentication System (Priority: High)
- [ ] **Task 2.1**: Set up Supabase database schema for users and profiles
- [ ] **Task 2.2**: Create Supabase client configuration and auth context
- [ ] **Task 2.3**: Implement phone number and email authentication flows
- [ ] **Task 2.4**: Build user onboarding and profile setup process
- [ ] **Task 2.5**: Add password recovery and account management
- **Estimated effort**: 1200 tokens

### Phase 3: Profile Management (Priority: High)
- [x] **Task 3.1**: Create profile types and interfaces
- [ ] **Task 3.2**: Build profile editing form component
- [ ] **Task 3.3**: Implement image upload with Supabase storage
- [ ] **Task 3.4**: Add privacy settings for location sharing
- [ ] **Task 3.5**: Create profile display component
- **Estimated effort**: 1200 tokens

### Phase 4: Social Features (Priority: Medium)
- [ ] **Task 4.1**: Create social relationship types and database schema
- [ ] **Task 4.2**: Implement friend request system
- [ ] **Task 4.3**: Build block/unblock functionality
- [ ] **Task 4.4**: Create user search and discovery interface
- [ ] **Task 4.5**: Add privacy controls for social interactions
- **Estimated effort**: 1200 tokens

### Phase 5: Group Management (Priority: Medium)
- [ ] **Task 5.1**: Create group types and database schema
- [ ] **Task 5.2**: Build group creation and management interface
- [ ] **Task 5.3**: Implement member invitation system
- [ ] **Task 5.4**: Add group privacy settings and admin roles
- **Estimated effort**: 1400 tokens

### Phase 6: Messaging System (Priority: Medium)
- [ ] Real-time messaging with Supabase
- [ ] Group chat functionality
- [ ] Message history and pagination
- [ ] Typing indicators and read receipts
- **Estimated effort**: 1600 tokens

### Phase 7: Location Features (Priority: Medium)
- [ ] Geolocation integration
- [ ] Map view with user positions
- [ ] Location privacy controls
- [ ] Nearby users discovery
- **Estimated effort**: 1000 tokens

### Phase 8: Advanced Features (Priority: Low)
- [ ] Business directory integration
- [ ] Event creation and management
- [ ] Push notifications setup
- [ ] Advanced search filters
- **Estimated effort**: 1800 tokens

## Discussions

### Mobile Navigation Issues
Current mobile navigation is not properly sized and positioned. Need to implement a fixed bottom navigation bar that matches the provided screenshot with proper spacing and active states.

### Authentication Strategy
Will use Supabase Auth with phone number as primary identifier, but also support email login. Need to implement proper onboarding flow with profile setup.

### Privacy Architecture
Location sharing privacy needs granular controls:
- Nobody: Location not shared
- Public: Visible to all users
- Friends: Only confirmed friends
- Groups: Specific group selections
- Custom: Individual user selections

### Database Design
Need to design efficient schema for:
- User relationships (friends, blocks)
- Group memberships with roles
- Location data with privacy flags
- Message threading and real-time updates

### Performance Considerations
- Implement proper pagination for messages and user lists
- Use React Query for caching and optimistic updates
- Optimize image uploads with compression
- Implement lazy loading for large lists

## Next Steps

1. **Immediate Priority**: Fix mobile navigation to match screenshot
2. **Database Setup**: Create core tables for users, groups, messages
3. **Authentication**: Implement phone number registration
4. **Profile System**: Build comprehensive profile management
5. **Social Features**: Add friend/block functionality