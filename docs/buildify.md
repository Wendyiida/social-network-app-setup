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
- Firebase backend (auth, Firestore, storage, FCM)
- Mobile-responsive design with bottom navigation
- Real-time subscriptions for messaging via Firestore
- Image upload and optimization
- Geolocation services
- Push notifications via Firebase Cloud Messaging

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

### Phase 0: Firebase Migration (Priority: CRITICAL) - COMPLETED
- [x] **Task 0.1**: Install Firebase SDK packages and update package.json
- [x] **Task 0.2**: Replace Supabase client with Firebase configuration
- [x] **Task 0.3**: Update database types for Firestore data model
- [x] **Task 0.4**: Migrate authentication hooks to Firebase Auth
- [x] **Task 0.5**: Update social hooks to use Firestore queries
- [x] **Task 0.6**: Replace Supabase storage with Firebase Storage
- [x] **Task 0.7**: Update all components using Supabase references
- [x] **Task 0.8**: Remove Supabase dependencies from package.json

### Phase 1: Mobile Navigation & Core UI (Priority: High) - COMPLETED
- [x] Fix mobile navigation layout and sizing
- [x] Implement bottom tab navigation matching screenshot
- [x] Create responsive design system
- [x] Add proper mobile viewport handling
- **Estimated effort**: 800 tokens

### Phase 2: Authentication System (Priority: High)
- [ ] **Task 2.1**: Set up Firestore collections for users and profiles
- [ ] **Task 2.2**: Create Firebase auth context with user state management
- [ ] **Task 2.3**: Implement phone number and email authentication flows
- [ ] **Task 2.4**: Build user onboarding and profile setup process
- [ ] **Task 2.5**: Add password recovery and account management

### Phase 3: Profile Management (Priority: High)
- [x] **Task 3.1**: Create profile types and interfaces
- [ ] **Task 3.2**: Build profile editing form component
- [ ] **Task 3.3**: Implement image upload with Firebase Storage
- [ ] **Task 3.4**: Add privacy settings for location sharing
- [ ] **Task 3.5**: Create profile display component

### Phase 4: Social Features (Priority: Medium)
- [x] **Task 4.1**: Create social relationship types and database schema
- [x] **Task 4.2**: Implement friend request system
- [ ] **Task 4.3**: Build block/unblock functionality
- [ ] **Task 4.4**: Create user search and discovery interface
- [ ] **Task 4.5**: Add privacy controls for social interactions
- **Estimated effort**: 1200 tokens

### Phase 5: Real-time Messaging System (Priority: High)
- [ ] **Task 5.1**: Create messaging database schema (messages, conversations, participants tables)
- [ ] **Task 5.2**: Define TypeScript types and interfaces for messaging
- [ ] **Task 5.3**: Build messaging hooks with real-time Supabase subscriptions
- [ ] **Task 5.4**: Create conversation list UI component
- [ ] **Task 5.5**: Build chat interface with message bubbles and input
- [ ] **Task 5.6**: Implement message sending and real-time updates
- [ ] **Task 5.7**: Add message pagination and infinite scroll
- [ ] **Task 5.8**: Create typing indicators and read receipts
- [ ] **Task 5.9**: Implement group chat functionality
- [ ] **Task 5.10**: Add message search and filtering

### Phase 6: Location Sharing System (Priority: High)
- [ ] **Task 6.1**: Create location database schema with privacy controls
- [ ] **Task 6.2**: Define location types and privacy level interfaces
- [ ] **Task 6.3**: Integrate browser Geolocation API
- [ ] **Task 6.4**: Build location permission and settings UI
- [ ] **Task 6.5**: Implement granular privacy controls (nobody, public, friends, groups, custom)
- [ ] **Task 6.6**: Create location update hook with background sync
- [ ] **Task 6.7**: Build map view component with user markers
- [ ] **Task 6.8**: Implement nearby users discovery with distance calculation
- [ ] **Task 6.9**: Add location sharing toggle and status indicator
- [ ] **Task 6.10**: Create location history and tracking features

### Phase 7: Group Management (Priority: Medium)
- [ ] **Task 7.1**: Create groups database schema (groups, members, roles, invitations)
- [ ] **Task 7.2**: Define group types and permission interfaces
- [ ] **Task 7.3**: Build group creation form with settings
- [ ] **Task 7.4**: Implement group discovery and search
- [ ] **Task 7.5**: Create group member management UI
- [ ] **Task 7.6**: Add role-based permissions (admin, moderator, member)
- [ ] **Task 7.7**: Build group invitation system
- [ ] **Task 7.8**: Implement group chat integration
- [ ] **Task 7.9**: Add group location sharing features
- [ ] **Task 7.10**: Create group settings and privacy controls

### Phase 8: Business Directory Integration (Priority: Medium)
- [ ] **Task 8.1**: Create business database schema (businesses, categories, reviews, hours)
- [ ] **Task 8.2**: Define business types and category interfaces
- [ ] **Task 8.3**: Build business profile creation and editing
- [ ] **Task 8.4**: Implement business search with filters (category, distance, rating)
- [ ] **Task 8.5**: Create business listing card component
- [ ] **Task 8.6**: Build business detail page with map integration
- [ ] **Task 8.7**: Add business reviews and ratings system
- [ ] **Task 8.8**: Implement business hours and availability
- [ ] **Task 8.9**: Create business-to-user messaging
- [ ] **Task 8.10**: Add business analytics dashboard

### Phase 9: Push Notifications (Priority: Low)
- [ ] **Task 9.1**: Set up service worker for PWA
- [ ] **Task 9.2**: Implement notification permission request flow
- [ ] **Task 9.3**: Create notification preferences UI
- [ ] **Task 9.4**: Build Supabase edge function for push notifications
- [ ] **Task 9.5**: Integrate with browser Push API
- [ ] **Task 9.6**: Add notification triggers (new message, friend request, location alert)
- [ ] **Task 9.7**: Implement notification history and management
- [ ] **Task 9.8**: Create notification sound and vibration settings
- [ ] **Task 9.9**: Add notification batching and throttling
- [ ] **Task 9.10**: Build notification analytics and delivery tracking

## Discussions

### Mobile Navigation Issues
Current mobile navigation is not properly sized and positioned. Need to implement a fixed bottom navigation bar that matches the provided screenshot with proper spacing and active states.

### Authentication Strategy
Will use Firebase Auth with phone number as primary identifier, but also support email login. Need to implement proper onboarding flow with profile setup. User profiles stored in Firestore with real-time sync.

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

### Real-time Messaging Architecture
**Database Design (Firestore Collections):**
- `conversations` collection: conversation metadata, type (direct/group), participants array
- `messages` subcollection: message content, sender, timestamps, read status
- `conversationParticipants` subcollection: user-conversation relationships with lastRead timestamp
- Use Firestore real-time listeners for instant message delivery

**Performance Optimizations:**
- Paginate messages (20-50 per page) with Firestore query cursors
- Cache conversations list with React Query
- Optimistic UI updates for sent messages
- Debounce typing indicators (500ms)
- Composite indexes on conversationId and createdAt for fast queries

**Security:**
- Firestore Security Rules to ensure users only see their conversations
- Validate message length and content in security rules
- Rate limiting via Firebase App Check

### Location Sharing Architecture
**Database Design (Firestore Collections):**
- `userLocations` collection: userId, geopoint (lat/lng), accuracy, updatedAt
- `locationPermissions` collection: granular permissions per user (who can see their location)
- Privacy levels stored in user profile document

**Geolocation Strategy:**
- Use browser Geolocation API with high accuracy mode
- Update location every 30 seconds when app is active
- Background sync when app is in background (service worker)
- Calculate distance using Firestore GeoPoint and geohash queries

**Privacy Implementation:**
- Five privacy levels: nobody, public, friends, groups, custom
- Custom level allows selecting specific users/groups
- Real-time location updates only sent to authorized users via Firestore listeners
- Location history retention: 7 days max

**Map Integration:**
- Use Leaflet.js or Mapbox GL for map rendering
- Cluster nearby users for better performance
- Show user avatars as map markers
- Real-time marker updates via Firestore listeners

### Business Directory Architecture
**Database Design (Firestore Collections):**
- `businesses` collection: name, description, category, ownerId, geopoint
- `businessCategories` collection: category hierarchy
- `businessHours` subcollection: operating hours per day
- `businessReviews` subcollection: ratings, comments, userId
- Business photos stored in Firebase Storage

**Search & Discovery:**
- Full-text search using Algolia or client-side filtering
- Filter by category, distance (geohash queries), rating, open now
- Sort by distance, rating, newest
- Use Firestore geohash queries for nearby businesses

**Integration Points:**
- Link businesses to map view (show on location map)
- Allow messaging business owners
- Show businesses in nearby discovery feed
- Business analytics: views, messages, reviews

### Push Notifications Architecture
**PWA Setup:**
- Service worker for offline support and push handling
- Web App Manifest for installability
- Cache static assets for offline access

**Notification System:**
- Supabase edge function to send push notifications
- Store push subscriptions in database
- Notification types: new message, friend request, location alert, business update
- User preferences for each notification type

**Implementation:**
- Request permission on first app load
- Subscribe to push service (FCM or native browser)
- Store subscription endpoint in database
- Edge function triggers on database events (new message, etc.)
- Batch notifications to avoid spam

## Next Steps

1. **Phase 5 Priority**: Start with messaging database schema and types
2. **Phase 6 Priority**: Implement location tracking after messaging is functional
3. **Phase 7 Priority**: Build group management to enable group messaging and location sharing
4. **Phase 8 Priority**: Add business directory once location features are complete
5. **Phase 9 Priority**: Implement push notifications last as enhancement layer