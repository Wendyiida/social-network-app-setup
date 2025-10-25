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

### Phase 1: Mobile Navigation & Core UI (Priority: High)
- [ ] Fix mobile navigation layout and sizing
- [ ] Implement bottom tab navigation matching screenshot
- [ ] Create responsive design system
- [ ] Add proper mobile viewport handling
- **Estimated effort**: 800 tokens

### Phase 2: Authentication System (Priority: High)
- [ ] Implement Supabase auth with phone number support
- [ ] Add password recovery flow
- [ ] Create user onboarding process
- [ ] Set up user profiles table
- **Estimated effort**: 1200 tokens

### Phase 3: Profile Management (Priority: High)
- [ ] Profile editing interface
- [ ] Image upload with Supabase storage
- [ ] Privacy settings for location sharing
- [ ] Username and bio management
- **Estimated effort**: 1000 tokens

### Phase 4: Group Management (Priority: Medium)
- [ ] Group creation and management
- [ ] Member invitation system
- [ ] Group privacy settings
- [ ] Admin/moderator roles
- **Estimated effort**: 1400 tokens

### Phase 5: Social Features (Priority: Medium)
- [ ] Friend request system
- [ ] Block/unblock functionality
- [ ] User search and discovery
- [ ] Privacy controls implementation
- **Estimated effort**: 1200 tokens

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