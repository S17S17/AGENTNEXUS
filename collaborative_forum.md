# Collaborative Forum with Version Control Specification

## Overview

The Collaborative Forum with Version Control is a vital component of AGENTNEXUS, designed to facilitate community collaboration, knowledge sharing, and iterative improvement of AI agents and workflows. This platform combines the features of a modern discussion forum with sophisticated version control capabilities, enabling developers to share, discuss, and evolve their work in a structured environment.

This specification details the architecture, features, workflows, and implementation strategies for the Collaborative Forum with Version Control.

## Design Goals

The Collaborative Forum with Version Control is designed with the following goals:

1. **Knowledge Sharing**: Enable effective sharing of knowledge, best practices, and experiences
2. **Collaborative Development**: Facilitate collaborative improvement of agents and workflows
3. **Version Tracking**: Maintain clear history of changes and evolution of shared content
4. **Quality Assurance**: Support peer review and quality improvement processes
5. **Community Building**: Foster a vibrant, supportive community of AI agent developers
6. **Discoverability**: Make valuable content easily discoverable
7. **Integration**: Seamlessly connect with other AGENTNEXUS components

## System Architecture

The Collaborative Forum with Version Control employs a modular architecture with distinct but interconnected components:

```
┌─────────────────────────────────────────────────────────────┐
│           Collaborative Forum with Version Control           │
├─────────────────────────────┬─────────────────────────────┤
│      Discussion Forum       │    Version Control System     │
├─────────────────────────────┴─────────────────────────────┤
│                  Content Management                         │
├─────────────────────────────────────────────────────────────┤
│                  Collaboration Tools                         │
└─────────────────────────────────────────────────────────────┘
```

### Discussion Forum

The Discussion Forum component provides structured conversations around agents, workflows, and related topics, supporting threaded discussions, categorization, and moderation.

### Version Control System

The Version Control System tracks changes to agents, workflows, and documentation, maintaining history, supporting branching and merging, and enabling collaborative development.

### Content Management

This component manages various content types, including discussions, documentation, code, and metadata, with support for organization, tagging, and search.

### Collaboration Tools

This component provides tools for collaborative work, including peer review, issue tracking, and project management features.

## Discussion Forum

### Forum Structure

The Discussion Forum is organized into a hierarchical structure:

1. **Categories**: Top-level organization for broad topics
2. **Subcategories**: More specific topics within categories
3. **Threads**: Individual discussion topics
4. **Posts**: Individual messages within threads
5. **Comments**: Responses to specific posts

Example categories include:

- Agent Development
- Workflow Sharing
- Integration Patterns
- Use Cases & Applications
- Platform Feedback
- Community Announcements

### Post Types

The forum supports various post types:

1. **Discussion**: General conversation topics
2. **Question**: Requests for help or information
3. **Showcase**: Presentation of completed work
4. **Tutorial**: Step-by-step guides
5. **Resource**: Sharing of useful resources
6. **Announcement**: Official communications
7. **Agent Share**: Sharing of an agent with version control
8. **Workflow Share**: Sharing of a workflow with version control

### Discussion Features

The forum includes modern discussion features:

1. **Rich Text Formatting**: Markdown-based text formatting
2. **Code Highlighting**: Syntax highlighting for code snippets
3. **Embedded Media**: Support for images, videos, and other media
4. **Mentions**: Tagging users in discussions
5. **Reactions**: Quick responses like upvotes or emojis
6. **Threading**: Nested conversation threads
7. **Bookmarking**: Saving discussions for later reference
8. **Notifications**: Alerts for relevant activity

### Moderation System

The forum includes comprehensive moderation capabilities:

1. **Content Policies**: Clear guidelines for acceptable content
2. **User Reporting**: Ability for users to report problematic content
3. **Moderation Queue**: Review system for flagged content
4. **Moderation Actions**: Tools for warning, muting, or banning users
5. **Automated Filtering**: AI-assisted detection of problematic content
6. **Moderation Logs**: Transparent record of moderation actions
7. **Appeals Process**: System for contesting moderation decisions

## Version Control System

### Version Control Model

The Version Control System uses a Git-inspired model with adaptations for AI agents:

1. **Repositories**: Containers for agent or workflow code and related files
2. **Commits**: Snapshots of repository state with metadata
3. **Branches**: Parallel development lines
4. **Merges**: Combining changes from different branches
5. **Tags**: Named references to specific commits (e.g., releases)
6. **Pull Requests**: Proposed changes for review before merging

### Agent Version Control

For AI agents, the system tracks:

1. **Agent Code**: Implementation code for the agent
2. **Configuration**: Agent configuration parameters
3. **Dependencies**: External libraries and services required
4. **Metadata**: Description, capabilities, and other information
5. **Documentation**: Usage instructions and examples
6. **Test Cases**: Validation tests for the agent

### Workflow Version Control

For workflows, the system tracks:

1. **Workflow Definition**: Structure and flow of the workflow
2. **Agent References**: References to included agents
3. **Integration Logic**: Code for connecting agents
4. **Configuration**: Workflow configuration parameters
5. **Documentation**: Usage instructions and examples
6. **Test Cases**: Validation tests for the workflow

### Versioning Schema

The system uses semantic versioning:

1. **Major Version**: Incompatible API changes
2. **Minor Version**: Backwards-compatible functionality additions
3. **Patch Version**: Backwards-compatible bug fixes
4. **Pre-release Identifiers**: Alpha, beta, or release candidate status

Example: `v1.2.3-beta.1`

### Branching Strategy

The system supports a flexible branching strategy:

1. **main**: Stable, released versions
2. **develop**: Integration branch for upcoming releases
3. **feature/***: Development of new features
4. **bugfix/***: Bug fixes
5. **release/***: Preparation for new releases
6. **hotfix/***: Urgent fixes for production issues

### Merge and Review Process

The system includes a structured review process:

1. **Pull Request Creation**: Developer submits changes for review
2. **Automated Validation**: System runs validation tests
3. **Peer Review**: Community members review the changes
4. **Discussion**: Reviewers and author discuss improvements
5. **Revision**: Author makes requested changes
6. **Approval**: Reviewers approve the final changes
7. **Merge**: Changes are incorporated into the target branch

## Content Management

### Content Types

The system manages various content types:

1. **Discussion Content**: Forum posts and comments
2. **Documentation**: Guides, references, and tutorials
3. **Code**: Agent and workflow implementations
4. **Metadata**: Information about agents and workflows
5. **Media**: Images, videos, and other media files
6. **Issues**: Bug reports and feature requests
7. **Reviews**: Peer reviews and feedback

### Content Organization

Content is organized through:

1. **Categories**: Hierarchical organization structure
2. **Tags**: Flexible, cross-cutting organization
3. **Collections**: User-curated groups of related content
4. **Projects**: Structured organization for collaborative work
5. **Spaces**: Team or topic-specific areas

### Content Discovery

The system supports content discovery through:

1. **Search**: Full-text search with filters
2. **Recommendations**: Personalized content suggestions
3. **Trending**: Currently popular content
4. **Featured**: Editorially selected content
5. **Following**: Content from followed users or topics
6. **Related Content**: Automatically linked similar content

### Content Lifecycle

The system manages content through its lifecycle:

1. **Creation**: Initial authoring of content
2. **Review**: Optional review before publication
3. **Publication**: Making content available to others
4. **Updates**: Modifications to existing content
5. **Archiving**: Moving outdated content to archive status
6. **Deletion**: Removing content when necessary

## Collaboration Tools

### Peer Review System

The peer review system facilitates quality improvement:

1. **Review Requests**: Soliciting feedback on work
2. **Review Assignment**: Matching reviewers to content
3. **Review Criteria**: Structured evaluation guidelines
4. **Inline Comments**: Feedback on specific parts of content
5. **Review Summaries**: Overall assessment and recommendations
6. **Review Status**: Tracking review progress
7. **Revision Tracking**: Following changes made in response to reviews

### Issue Tracking

The issue tracking system manages problems and enhancements:

1. **Issue Types**: Bugs, feature requests, improvements
2. **Issue States**: Open, in progress, resolved, closed
3. **Priority Levels**: Urgency and importance indicators
4. **Assignments**: Responsibility for addressing issues
5. **Related Issues**: Connections between related problems
6. **Issue Discussions**: Conversations about specific issues
7. **Resolution Tracking**: Recording how issues were resolved

### Collaborative Editing

The system supports collaborative content creation:

1. **Real-time Collaboration**: Simultaneous editing by multiple users
2. **Change Tracking**: Visible record of modifications
3. **Commenting**: Feedback on specific content sections
4. **Suggesting**: Proposing changes without direct editing
5. **Version Comparison**: Side-by-side view of different versions
6. **Conflict Resolution**: Tools for resolving editing conflicts

### Project Management

The project management tools help organize collaborative work:

1. **Project Boards**: Visual organization of tasks
2. **Milestones**: Grouping work into meaningful goals
3. **Task Assignment**: Allocating responsibilities
4. **Progress Tracking**: Monitoring project advancement
5. **Timelines**: Scheduling and deadline management
6. **Dependencies**: Managing relationships between tasks
7. **Resource Allocation**: Managing time and effort

## User Experience

### User Interface

The user interface is designed for clarity and efficiency:

1. **Responsive Design**: Adaptation to different devices and screen sizes
2. **Consistent Navigation**: Clear, predictable navigation patterns
3. **Context-Aware Actions**: Relevant actions based on current context
4. **Progressive Disclosure**: Revealing complexity as needed
5. **Accessibility**: Compliance with accessibility standards
6. **Customization**: User preferences for layout and behavior
7. **Performance**: Fast loading and interaction times

### User Workflows

The system supports key user workflows:

#### Agent Sharing Workflow

1. User creates or imports agent code
2. User adds metadata and documentation
3. System validates agent structure
4. User publishes agent to repository
5. User creates forum post linking to repository
6. Community discusses and provides feedback
7. User updates agent based on feedback
8. System tracks version history

#### Collaborative Improvement Workflow

1. User identifies agent to improve
2. User forks the agent repository
3. User makes improvements in their fork
4. User creates pull request with changes
5. Original author and community review changes
6. Discussion and revision occur
7. Changes are merged into original repository
8. New version is published

#### Knowledge Sharing Workflow

1. User identifies valuable knowledge to share
2. User creates appropriate content type (tutorial, guide, etc.)
3. User publishes content to forum
4. Community discusses and provides feedback
5. User refines content based on feedback
6. Content is categorized and tagged for discoverability
7. System recommends content to relevant users

### Notification System

The notification system keeps users informed:

1. **Activity Notifications**: Alerts about relevant activity
2. **Mention Notifications**: Alerts when user is mentioned
3. **Review Notifications**: Alerts about review requests and feedback
4. **Update Notifications**: Alerts about changes to followed content
5. **Digest Options**: Consolidated notifications at chosen frequency
6. **Notification Preferences**: User control over notification types
7. **Notification Channels**: Email, in-app, and optional mobile notifications

## Integration with Other Components

### Integration with Decentralized Registry

The forum integrates with the Decentralized Registry to:

1. **Link Discussions to Agents**: Connect forum threads to registry entries
2. **Import Agent Metadata**: Display agent information from the registry
3. **Publish to Registry**: Submit new or updated agents to the registry
4. **Track Registry Status**: Show validation and publication status
5. **Synchronize Versions**: Maintain version consistency between systems

### Integration with Reputation System

The forum works with the Reputation System to:

1. **Display Reputation**: Show user reputation in forum interactions
2. **Award Reputation**: Grant reputation for valuable contributions
3. **Use Reputation for Privileges**: Unlock capabilities based on reputation
4. **Track Contribution Value**: Measure impact of forum contributions
5. **Highlight Expertise**: Identify domain experts in discussions

### Integration with Search Engine

The forum provides data to the Search Engine to:

1. **Index Content**: Make forum content searchable
2. **Enhance Search Results**: Provide context for search findings
3. **Track Relevance Signals**: Identify valuable content through engagement
4. **Support Faceted Search**: Enable filtering by forum categories and tags
5. **Personalize Results**: Tailor search based on forum activity

### Integration with Validation Pipeline

The forum connects with the Validation Pipeline to:

1. **Display Validation Results**: Show validation status in discussions
2. **Trigger Validation**: Initiate validation from forum actions
3. **Discuss Validation Issues**: Create threads for validation problems
4. **Track Validation History**: Show validation results across versions
5. **Suggest Improvements**: Link validation recommendations to discussions

## Implementation Technologies

### Core Technologies

The Collaborative Forum with Version Control is built using:

1. **Next.js**: For the frontend application
2. **Node.js**: For the backend services
3. **PostgreSQL**: For relational data storage
4. **Redis**: For caching and real-time features
5. **Elasticsearch**: For search functionality
6. **Socket.IO**: For real-time collaboration
7. **Git**: For version control core functionality

### Version Control Implementation

The version control system is implemented using:

1. **Git Core**: Leveraging Git's distributed version control model
2. **Custom Storage Layer**: Optimized for AI agent and workflow storage
3. **Metadata Extensions**: Additional tracking for agent-specific information
4. **Web-based Interface**: Git functionality through web UI
5. **API Layer**: Programmatic access to version control features

### Forum Implementation

The discussion forum is implemented using:

1. **React**: For interactive UI components
2. **Redux**: For state management
3. **Prosemirror**: For rich text editing
4. **PostgreSQL**: For structured data storage
5. **WebSockets**: For real-time updates
6. **Service Workers**: For offline capabilities
7. **Server-Side Rendering**: For performance and SEO

## Code Examples

### Version Control Service

```typescript
// src/services/versionControl.ts

import { Repository, Commit, Branch, Tag, PullRequest } from '../models/versionControl';
import { User } from '../models/user';
import { Agent } from '../models/agent';
import { Workflow } from '../models/workflow';
import { GitService } from './gitService';
import { ValidationService } from './validationService';
import { NotificationService } from './notificationService';
import { RegistryService } from './registryService';

export class VersionControlService {
  private gitService: GitService;
  private validationService: ValidationService;
  private notificationService: NotificationService;
  private registryService: RegistryService;
  
  constructor(
    gitService: GitService,
    validationService: ValidationService,
    notificationService: NotificationService,
    registryService: RegistryService
  ) {
    this.gitService = gitService;
    this.validationService = validationService;
    this.notificationService = notificationService;
    this.registryService = registryService;
  }
  
  /**
   * Create a new repository for an agent or workflow
   */
  async createRepository(
    name: string,
    description: string,
    type: 'agent' | 'workflow',
    owner: User,
    initialContent?: any
  ): Promise<Repository> {
    // Create Git repository
    const repoPath = await this.gitService.initRepository(name, owner.id);
    
    // Create repository record
    const repository = await Repository.create({
      name,
      description,
      type,
      ownerId: owner.id,
      path: repoPath,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add initial content if provided
    if (initialContent) {
      await this.gitService.addFiles(repoPath, initialContent);
      await this.gitService.commit(repoPath, 'Initial commit', owner);
    }
    
    // Create default branch
    await this.createBranch(repository.id, 'main', null, owner);
    
    return repository;
  }
  
  /**
   * Fork an existing repository
   */
  async forkRepository(
    repositoryId: string,
    owner: User
  ): Promise<Repository> {
    const sourceRepo = await Repository.findById(repositoryId);
    if (!sourceRepo) {
      throw new Error('Repository not found');
    }
    
    // Create fork in Git
    const forkPath = await this.gitService.forkRepository(sourceRepo.path, owner.id);
    
    // Create repository record for fork
    const fork = await Repository.create({
      name: sourceRepo.name,
      description: `Fork of ${sourceRepo.name}`,
      type: sourceRepo.type,
      ownerId: owner.id,
      path: forkPath,
      forkedFromId: sourceRepo.id,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Notify original repository owner
    await this.notificationService.sendNotification(
      sourceRepo.ownerId,
      'repository_forked',
      {
        repositoryId: sourceRepo.id,
        repositoryName: sourceRepo.name,
        forkId: fork.id,
        userId: owner.id,
        userName: owner.username
      }
    );
    
    return fork;
  }
  
  /**
   * Create a new branch
   */
  async createBranch(
    repositoryId: string,
    name: string,
    sourceBranchName: string | null,
    user: User
  ): Promise<Branch> {
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }
    
    // Create branch in Git
    await this.gitService.createBranch(
      repository.path,
      name,
      sourceBranchName || 'main'
    );
    
    // Create branch record
    const branch = await Branch.create({
      name,
      repositoryId,
      createdById: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return branch;
  }
  
  /**
   * Create a commit
   */
  async createCommit(
    repositoryId: string,
    branchName: string,
    message: string,
    changes: any,
    user: User
  ): Promise<Commit> {
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }
    
    // Apply changes to Git repository
    await this.gitService.checkout(repository.path, branchName);
    await this.gitService.addFiles(repository.path, changes);
    const commitHash = await this.gitService.commit(repository.path, message, user);
    
    // Create commit record
    const commit = await Commit.create({
      hash: commitHash,
      message,
      repositoryId,
      branchName,
      authorId: user.id,
      createdAt: new Date()
    });
    
    // Update branch record
    await Branch.update(
      { updatedAt: new Date() },
      { where: { repositoryId, name: branchName } }
    );
    
    // Update repository record
    await Repository.update(
      { updatedAt: new Date() },
      { where: { id: repositoryId } }
    );
    
    return commit;
  }
  
  /**
   * Create a pull request
   */
  async createPullRequest(
    repositoryId: string,
    title: string,
    description: string,
    sourceBranchName: string,
    targetBranchName: string,
    user: User
  ): Promise<PullRequest> {
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }
    
    // Validate branches exist
    const sourceBranch = await Branch.findOne({
      where: { repositoryId, name: sourceBranchName }
    });
    
    const targetBranch = await Branch.findOne({
      where: { repositoryId, name: targetBranchName }
    });
    
    if (!sourceBranch || !targetBranch) {
      throw new Error('Branch not found');
    }
    
    // Check for conflicts
    const hasConflicts = await this.gitService.checkMergeConflicts(
      repository.path,
      sourceBranchName,
      targetBranchName
    );
    
    // Create pull request record
    const pullRequest = await PullRequest.create({
      title,
      description,
      repositoryId,
      sourceBranchName,
      targetBranchName,
      createdById: user.id,
      status: hasConflicts ? 'has_conflicts' : 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Run validation if this is an agent or workflow
    if (repository.type === 'agent' || repository.type === 'workflow') {
      // Get content from source branch
      const content = await this.gitService.getContent(
        repository.path,
        sourceBranchName
      );
      
      // Start validation
      await this.validationService.validateContent(
        content,
        repository.type,
        pullRequest.id
      );
    }
    
    // Notify repository owner if different from PR creator
    if (repository.ownerId !== user.id) {
      await this.notificationService.sendNotification(
        repository.ownerId,
        'pull_request_created',
        {
          repositoryId,
          repositoryName: repository.name,
          pullRequestId: pullRequest.id,
          pullRequestTitle: title,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    return pullRequest;
  }
  
  /**
   * Merge a pull request
   */
  async mergePullRequest(
    pullRequestId: string,
    user: User
  ): Promise<PullRequest> {
    const pullRequest = await PullRequest.findById(pullRequestId);
    if (!pullRequest) {
      throw new Error('Pull request not found');
    }
    
    if (pullRequest.status !== 'open') {
      throw new Error('Pull request cannot be merged');
    }
    
    const repository = await Repository.findById(pullRequest.repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }
    
    // Check user permissions
    const canMerge = await this.canUserMerge(user.id, repository.id);
    if (!canMerge) {
      throw new Error('User does not have permission to merge');
    }
    
    // Perform merge in Git
    const mergeCommitHash = await this.gitService.merge(
      repository.path,
      pullRequest.sourceBranchName,
      pullRequest.targetBranchName,
      `Merge pull request #${pullRequest.id}: ${pullRequest.title}`,
      user
    );
    
    // Update pull request status
    pullRequest.status = 'merged';
    pullRequest.mergedAt = new Date();
    pullRequest.mergedById = user.id;
    pullRequest.mergeCommitHash = mergeCommitHash;
    pullRequest.updatedAt = new Date();
    await pullRequest.save();
    
    // Create commit record for merge commit
    await Commit.create({
      hash: mergeCommitHash,
      message: `Merge pull request #${pullRequest.id}: ${pullRequest.title}`,
      repositoryId: repository.id,
      branchName: pullRequest.targetBranchName,
      authorId: user.id,
      createdAt: new Date()
    });
    
    // If this was merged to main branch and is an agent or workflow, update registry
    if (pullRequest.targetBranchName === 'main' && 
        (repository.type === 'agent' || repository.type === 'workflow')) {
      // Get content from main branch
      const content = await this.gitService.getContent(
        repository.path,
        'main'
      );
      
      // Update in registry
      if (repository.type === 'agent') {
        await this.registryService.updateAgent(repository.id, content);
      } else {
        await this.registryService.updateWorkflow(repository.id, content);
      }
    }
    
    // Notify relevant users
    await this.notificationService.sendNotification(
      pullRequest.createdById,
      'pull_request_merged',
      {
        repositoryId: repository.id,
        repositoryName: repository.name,
        pullRequestId: pullRequest.id,
        pullRequestTitle: pullRequest.title,
        userId: user.id,
        userName: user.username
      }
    );
    
    return pullRequest;
  }
  
  /**
   * Create a tag (release)
   */
  async createTag(
    repositoryId: string,
    name: string,
    commitHash: string,
    description: string,
    user: User
  ): Promise<Tag> {
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }
    
    // Validate commit exists
    const commit = await Commit.findOne({
      where: { repositoryId, hash: commitHash }
    });
    
    if (!commit) {
      throw new Error('Commit not found');
    }
    
    // Create tag in Git
    await this.gitService.createTag(
      repository.path,
      name,
      commitHash,
      description
    );
    
    // Create tag record
    const tag = await Tag.create({
      name,
      description,
      repositoryId,
      commitHash,
      createdById: user.id,
      createdAt: new Date()
    });
    
    // If this is a semantic version tag on main branch for an agent or workflow, update registry
    if (name.match(/^v\d+\.\d+\.\d+/) && commit.branchName === 'main' &&
        (repository.type === 'agent' || repository.type === 'workflow')) {
      // Get content at tag
      const content = await this.gitService.getContentAtRef(
        repository.path,
        name
      );
      
      // Update in registry with version
      const version = name.substring(1); // Remove 'v' prefix
      if (repository.type === 'agent') {
        await this.registryService.publishAgentVersion(repository.id, version, content);
      } else {
        await this.registryService.publishWorkflowVersion(repository.id, version, content);
      }
    }
    
    return tag;
  }
  
  /**
   * Check if user can merge to repository
   */
  private async canUserMerge(userId: string, repositoryId: string): Promise<boolean> {
    const repository = await Repository.findById(repositoryId);
    if (!repository) {
      return false;
    }
    
    // Repository owner can always merge
    if (repository.ownerId === userId) {
      return true;
    }
    
    // Check if user is a collaborator with merge permission
    const collaborator = await Collaborator.findOne({
      where: {
        repositoryId,
        userId,
        permission: { [Op.in]: ['write', 'admin'] }
      }
    });
    
    return !!collaborator;
  }
}
```

### Forum Service

```typescript
// src/services/forumService.ts

import { Category, Thread, Post, Comment, Reaction } from '../models/forum';
import { User } from '../models/user';
import { Repository } from '../models/versionControl';
import { NotificationService } from './notificationService';
import { SearchService } from './searchService';
import { ReputationService } from './reputationService';

export class ForumService {
  private notificationService: NotificationService;
  private searchService: SearchService;
  private reputationService: ReputationService;
  
  constructor(
    notificationService: NotificationService,
    searchService: SearchService,
    reputationService: ReputationService
  ) {
    this.notificationService = notificationService;
    this.searchService = searchService;
    this.reputationService = reputationService;
  }
  
  /**
   * Create a new thread
   */
  async createThread(
    categoryId: string,
    title: string,
    content: string,
    type: string,
    tags: string[],
    repositoryId?: string,
    user: User
  ): Promise<Thread> {
    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Create thread
    const thread = await Thread.create({
      title,
      type,
      categoryId,
      authorId: user.id,
      repositoryId,
      viewCount: 0,
      isSticky: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Create initial post
    const post = await Post.create({
      threadId: thread.id,
      authorId: user.id,
      content,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add tags
    if (tags && tags.length > 0) {
      await this.addTagsToThread(thread.id, tags);
    }
    
    // Index in search
    await this.searchService.indexThread(thread.id);
    
    // Award reputation for creating thread
    await this.reputationService.awardReputation(
      user.id,
      'thread_created',
      { threadId: thread.id, categoryId }
    );
    
    // If this is a repository thread, update repository with thread ID
    if (repositoryId) {
      await Repository.update(
        { threadId: thread.id },
        { where: { id: repositoryId } }
      );
    }
    
    return thread;
  }
  
  /**
   * Create a post in a thread
   */
  async createPost(
    threadId: string,
    content: string,
    user: User
  ): Promise<Post> {
    // Validate thread exists and is not locked
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    if (thread.isLocked) {
      throw new Error('Thread is locked');
    }
    
    // Create post
    const post = await Post.create({
      threadId,
      authorId: user.id,
      content,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update thread
    await Thread.update(
      { updatedAt: new Date() },
      { where: { id: threadId } }
    );
    
    // Index in search
    await this.searchService.indexPost(post.id);
    
    // Award reputation for creating post
    await this.reputationService.awardReputation(
      user.id,
      'post_created',
      { postId: post.id, threadId }
    );
    
    // Notify thread author if different from post author
    if (thread.authorId !== user.id) {
      await this.notificationService.sendNotification(
        thread.authorId,
        'new_post_in_thread',
        {
          threadId,
          threadTitle: thread.title,
          postId: post.id,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    // Notify other participants in the thread
    const participants = await this.getThreadParticipants(threadId);
    for (const participantId of participants) {
      if (participantId !== user.id && participantId !== thread.authorId) {
        await this.notificationService.sendNotification(
          participantId,
          'new_post_in_thread',
          {
            threadId,
            threadTitle: thread.title,
            postId: post.id,
            userId: user.id,
            userName: user.username
          }
        );
      }
    }
    
    return post;
  }
  
  /**
   * Create a comment on a post
   */
  async createComment(
    postId: string,
    content: string,
    user: User
  ): Promise<Comment> {
    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Get thread to check if locked
    const thread = await Thread.findById(post.threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    if (thread.isLocked) {
      throw new Error('Thread is locked');
    }
    
    // Create comment
    const comment = await Comment.create({
      postId,
      authorId: user.id,
      content,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update post and thread
    await Post.update(
      { updatedAt: new Date() },
      { where: { id: postId } }
    );
    
    await Thread.update(
      { updatedAt: new Date() },
      { where: { id: post.threadId } }
    );
    
    // Award reputation for creating comment
    await this.reputationService.awardReputation(
      user.id,
      'comment_created',
      { commentId: comment.id, postId, threadId: post.threadId }
    );
    
    // Notify post author if different from comment author
    if (post.authorId !== user.id) {
      await this.notificationService.sendNotification(
        post.authorId,
        'new_comment_on_post',
        {
          threadId: post.threadId,
          threadTitle: thread.title,
          postId,
          commentId: comment.id,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    return comment;
  }
  
  /**
   * Add reaction to a post or comment
   */
  async addReaction(
    targetType: 'post' | 'comment',
    targetId: string,
    reactionType: string,
    user: User
  ): Promise<Reaction> {
    // Validate target exists
    let target;
    if (targetType === 'post') {
      target = await Post.findById(targetId);
    } else {
      target = await Comment.findById(targetId);
    }
    
    if (!target) {
      throw new Error(`${targetType} not found`);
    }
    
    // Check if user already reacted
    const existingReaction = await Reaction.findOne({
      where: {
        targetType,
        targetId,
        userId: user.id
      }
    });
    
    if (existingReaction) {
      // Update existing reaction if type is different
      if (existingReaction.type !== reactionType) {
        existingReaction.type = reactionType;
        existingReaction.updatedAt = new Date();
        await existingReaction.save();
        return existingReaction;
      }
      
      // Otherwise, remove the reaction (toggle)
      await existingReaction.destroy();
      return null;
    }
    
    // Create new reaction
    const reaction = await Reaction.create({
      targetType,
      targetId,
      userId: user.id,
      type: reactionType,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Award reputation to target author for receiving positive reaction
    if (['like', 'helpful', 'insightful'].includes(reactionType)) {
      await this.reputationService.awardReputation(
        target.authorId,
        'received_positive_reaction',
        { 
          reactionType,
          targetType,
          targetId
        }
      );
    }
    
    // Notify target author if different from reaction author
    if (target.authorId !== user.id) {
      await this.notificationService.sendNotification(
        target.authorId,
        'new_reaction',
        {
          targetType,
          targetId,
          reactionType,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    return reaction;
  }
  
  /**
   * Get thread participants (unique user IDs of authors in thread)
   */
  private async getThreadParticipants(threadId: string): Promise<string[]> {
    // Get all posts in thread
    const posts = await Post.findAll({
      where: { threadId },
      attributes: ['authorId']
    });
    
    // Get all comments on posts in thread
    const postIds = posts.map(post => post.id);
    const comments = await Comment.findAll({
      where: { postId: { [Op.in]: postIds } },
      attributes: ['authorId']
    });
    
    // Combine and deduplicate
    const participantIds = [
      ...posts.map(post => post.authorId),
      ...comments.map(comment => comment.authorId)
    ];
    
    return [...new Set(participantIds)];
  }
  
  /**
   * Add tags to a thread
   */
  private async addTagsToThread(threadId: string, tagNames: string[]): Promise<void> {
    // Get or create tags
    const tags = [];
    for (const name of tagNames) {
      const [tag] = await Tag.findOrCreate({
        where: { name: name.toLowerCase() },
        defaults: {
          name: name.toLowerCase(),
          createdAt: new Date()
        }
      });
      tags.push(tag);
    }
    
    // Associate tags with thread
    const thread = await Thread.findById(threadId);
    await thread.setTags(tags);
  }
  
  /**
   * Search threads
   */
  async searchThreads(
    query: string,
    filters: any = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ threads: Thread[], total: number }> {
    return this.searchService.searchThreads(query, filters, page, limit);
  }
  
  /**
   * Get recent threads
   */
  async getRecentThreads(
    categoryId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ threads: Thread[], total: number }> {
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    const { rows, count } = await Thread.findAndCountAll({
      where,
      order: [['updatedAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] },
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    
    return {
      threads: rows,
      total: count
    };
  }
  
  /**
   * Get thread by ID
   */
  async getThread(
    threadId: string,
    incrementView: boolean = true
  ): Promise<Thread> {
    const thread = await Thread.findById(threadId, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] },
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Repository, attributes: ['id', 'name', 'type'] }
      ]
    });
    
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    // Increment view count if requested
    if (incrementView) {
      thread.viewCount += 1;
      await thread.save();
    }
    
    return thread;
  }
  
  /**
   * Get posts in thread
   */
  async getThreadPosts(
    threadId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ posts: Post[], total: number }> {
    const { rows, count } = await Post.findAndCountAll({
      where: { threadId },
      order: [['createdAt', 'ASC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] },
        { 
          model: Comment,
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] },
            { 
              model: Reaction,
              include: [
                { model: User, attributes: ['id', 'username'] }
              ]
            }
          ]
        },
        { 
          model: Reaction,
          include: [
            { model: User, attributes: ['id', 'username'] }
          ]
        }
      ]
    });
    
    return {
      posts: rows,
      total: count
    };
  }
}
```

### Collaborative Editing Service

```typescript
// src/services/collaborativeEditingService.ts

import { Document, Operation, Change } from '../models/document';
import { User } from '../models/user';
import { WebSocketService } from './webSocketService';

export class CollaborativeEditingService {
  private webSocketService: WebSocketService;
  
  constructor(webSocketService: WebSocketService) {
    this.webSocketService = webSocketService;
  }
  
  /**
   * Create a new collaborative document
   */
  async createDocument(
    title: string,
    content: string,
    type: string,
    user: User
  ): Promise<Document> {
    // Create document record
    const document = await Document.create({
      title,
      content,
      type,
      ownerId: user.id,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Create initial change record
    await Change.create({
      documentId: document.id,
      userId: user.id,
      operations: [
        {
          type: 'insert',
          position: 0,
          text: content
        }
      ],
      version: 1,
      createdAt: new Date()
    });
    
    return document;
  }
  
  /**
   * Apply operations to a document
   */
  async applyOperations(
    documentId: string,
    operations: Operation[],
    user: User
  ): Promise<Document> {
    // Get document
    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Apply operations to content
    const newContent = this.applyOperationsToContent(document.content, operations);
    
    // Update document
    document.content = newContent;
    document.version += 1;
    document.updatedAt = new Date();
    await document.save();
    
    // Create change record
    await Change.create({
      documentId,
      userId: user.id,
      operations,
      version: document.version,
      createdAt: new Date()
    });
    
    // Broadcast changes to other users
    this.webSocketService.broadcastToDocument(documentId, 'document_updated', {
      documentId,
      operations,
      userId: user.id,
      userName: user.username,
      version: document.version
    });
    
    return document;
  }
  
  /**
   * Apply operations to content string
   */
  private applyOperationsToContent(content: string, operations: Operation[]): string {
    let result = content;
    
    // Sort operations by position (descending) to avoid position shifts
    const sortedOperations = [...operations].sort((a, b) => {
      if (a.position !== b.position) {
        return b.position - a.position;
      }
      // For same position, deletions come before insertions
      if (a.type === 'delete' && b.type === 'insert') {
        return -1;
      }
      if (a.type === 'insert' && b.type === 'delete') {
        return 1;
      }
      return 0;
    });
    
    // Apply each operation
    for (const op of sortedOperations) {
      if (op.type === 'insert') {
        result = result.substring(0, op.position) + op.text + result.substring(op.position);
      } else if (op.type === 'delete') {
        result = result.substring(0, op.position) + result.substring(op.position + op.length);
      }
    }
    
    return result;
  }
  
  /**
   * Get document history
   */
  async getDocumentHistory(
    documentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ changes: Change[], total: number }> {
    const { rows, count } = await Change.findAndCountAll({
      where: { documentId },
      order: [['version', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        { model: User, attributes: ['id', 'username', 'avatarUrl'] }
      ]
    });
    
    return {
      changes: rows,
      total: count
    };
  }
  
  /**
   * Get document at specific version
   */
  async getDocumentAtVersion(
    documentId: string,
    version: number
  ): Promise<{ content: string, version: number }> {
    // Get document
    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // If requested version is current, return current content
    if (version === document.version) {
      return {
        content: document.content,
        version: document.version
      };
    }
    
    // If requested version is greater than current, error
    if (version > document.version) {
      throw new Error('Requested version does not exist');
    }
    
    // Get all changes up to requested version
    const changes = await Change.findAll({
      where: {
        documentId,
        version: { [Op.lte]: version }
      },
      order: [['version', 'ASC']]
    });
    
    // Reconstruct content by applying changes sequentially
    let content = '';
    for (const change of changes) {
      content = this.applyOperationsToContent(content, change.operations);
    }
    
    return {
      content,
      version
    };
  }
  
  /**
   * Compare two versions of a document
   */
  async compareVersions(
    documentId: string,
    versionA: number,
    versionB: number
  ): Promise<{ contentA: string, contentB: string, diff: any }> {
    // Get content at both versions
    const { content: contentA } = await this.getDocumentAtVersion(documentId, versionA);
    const { content: contentB } = await this.getDocumentAtVersion(documentId, versionB);
    
    // Generate diff
    const diff = this.generateDiff(contentA, contentB);
    
    return {
      contentA,
      contentB,
      diff
    };
  }
  
  /**
   * Generate diff between two strings
   */
  private generateDiff(textA: string, textB: string): any {
    // In a real implementation, this would use a diff algorithm
    // For this example, we'll return a placeholder
    return {
      additions: 0,
      deletions: 0,
      changes: []
    };
  }
}
```

### Project Management Service

```typescript
// src/services/projectManagementService.ts

import { Project, Milestone, Task, TaskStatus } from '../models/project';
import { User } from '../models/user';
import { Repository } from '../models/versionControl';
import { NotificationService } from './notificationService';

export class ProjectManagementService {
  private notificationService: NotificationService;
  
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }
  
  /**
   * Create a new project
   */
  async createProject(
    name: string,
    description: string,
    repositoryId: string | null,
    user: User
  ): Promise<Project> {
    // Create project record
    const project = await Project.create({
      name,
      description,
      repositoryId,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add owner as member
    await project.addMember(user.id, 'owner');
    
    return project;
  }
  
  /**
   * Create a milestone
   */
  async createMilestone(
    projectId: string,
    title: string,
    description: string,
    dueDate: Date | null,
    user: User
  ): Promise<Milestone> {
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Check user permissions
    const canEdit = await this.canUserEditProject(user.id, projectId);
    if (!canEdit) {
      throw new Error('User does not have permission to edit project');
    }
    
    // Create milestone
    const milestone = await Milestone.create({
      projectId,
      title,
      description,
      dueDate,
      status: 'open',
      createdById: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Notify project members
    await this.notifyProjectMembers(
      projectId,
      user.id,
      'milestone_created',
      {
        projectId,
        projectName: project.name,
        milestoneId: milestone.id,
        milestoneTitle: milestone.title
      }
    );
    
    return milestone;
  }
  
  /**
   * Create a task
   */
  async createTask(
    projectId: string,
    milestoneId: string | null,
    title: string,
    description: string,
    assigneeId: string | null,
    dueDate: Date | null,
    user: User
  ): Promise<Task> {
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Validate milestone if provided
    if (milestoneId) {
      const milestone = await Milestone.findOne({
        where: { id: milestoneId, projectId }
      });
      
      if (!milestone) {
        throw new Error('Milestone not found in this project');
      }
    }
    
    // Check user permissions
    const canEdit = await this.canUserEditProject(user.id, projectId);
    if (!canEdit) {
      throw new Error('User does not have permission to edit project');
    }
    
    // Create task
    const task = await Task.create({
      projectId,
      milestoneId,
      title,
      description,
      assigneeId,
      dueDate,
      status: TaskStatus.TODO,
      createdById: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Notify assignee if different from creator
    if (assigneeId && assigneeId !== user.id) {
      await this.notificationService.sendNotification(
        assigneeId,
        'task_assigned',
        {
          projectId,
          projectName: project.name,
          taskId: task.id,
          taskTitle: task.title,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    return task;
  }
  
  /**
   * Update task status
   */
  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    // Check user permissions
    const canEdit = await this.canUserEditProject(user.id, task.projectId);
    if (!canEdit && task.assigneeId !== user.id) {
      throw new Error('User does not have permission to update this task');
    }
    
    // Update task
    task.status = status;
    task.updatedAt = new Date();
    await task.save();
    
    // Get project for notification
    const project = await Project.findById(task.projectId);
    
    // Notify task creator if different from updater
    if (task.createdById !== user.id) {
      await this.notificationService.sendNotification(
        task.createdById,
        'task_status_updated',
        {
          projectId: task.projectId,
          projectName: project.name,
          taskId: task.id,
          taskTitle: task.title,
          status,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    // Notify assignee if different from updater and creator
    if (task.assigneeId && task.assigneeId !== user.id && task.assigneeId !== task.createdById) {
      await this.notificationService.sendNotification(
        task.assigneeId,
        'task_status_updated',
        {
          projectId: task.projectId,
          projectName: project.name,
          taskId: task.id,
          taskTitle: task.title,
          status,
          userId: user.id,
          userName: user.username
        }
      );
    }
    
    return task;
  }
  
  /**
   * Get project board
   */
  async getProjectBoard(projectId: string): Promise<any> {
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Get all tasks for project
    const tasks = await Task.findAll({
      where: { projectId },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'username', 'avatarUrl'] },
        { model: User, as: 'createdBy', attributes: ['id', 'username', 'avatarUrl'] },
        { model: Milestone, attributes: ['id', 'title'] }
      ]
    });
    
    // Group tasks by status
    const board = {
      [TaskStatus.TODO]: tasks.filter(task => task.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.REVIEW]: tasks.filter(task => task.status === TaskStatus.REVIEW),
      [TaskStatus.DONE]: tasks.filter(task => task.status === TaskStatus.DONE)
    };
    
    return board;
  }
  
  /**
   * Check if user can edit project
   */
  private async canUserEditProject(userId: string, projectId: string): Promise<boolean> {
    // Get project membership
    const membership = await ProjectMember.findOne({
      where: {
        projectId,
        userId,
        role: { [Op.in]: ['owner', 'admin', 'member'] }
      }
    });
    
    return !!membership;
  }
  
  /**
   * Notify all project members
   */
  private async notifyProjectMembers(
    projectId: string,
    excludeUserId: string,
    type: string,
    data: any
  ): Promise<void> {
    // Get all project members
    const members = await ProjectMember.findAll({
      where: { projectId }
    });
    
    // Send notification to each member except excluded user
    for (const member of members) {
      if (member.userId !== excludeUserId) {
        await this.notificationService.sendNotification(
          member.userId,
          type,
          data
        );
      }
    }
  }
}
```

## API Specification

The Collaborative Forum with Version Control exposes the following APIs:

### RESTful API

#### Forum Management

```
GET /categories
```

Get all forum categories.

```
GET /categories/{categoryId}/threads
```

Get threads in a category.

```
POST /threads
```

Create a new thread.

Request body:
```json
{
  "categoryId": "cat_01234567-89ab-cdef-0123-456789abcdef",
  "title": "Introducing DataAnalysisAgent: A powerful tool for data scientists",
  "content": "I'm excited to share my new agent for data analysis...",
  "type": "agent_share",
  "tags": ["data-analysis", "visualization", "machine-learning"],
  "repositoryId": "repo_01234567-89ab-cdef-0123-456789abcdef"
}
```

```
GET /threads/{threadId}
```

Get thread details.

```
GET /threads/{threadId}/posts
```

Get posts in a thread.

```
POST /threads/{threadId}/posts
```

Create a post in a thread.

Request body:
```json
{
  "content": "This looks really interesting! Have you considered adding support for time series data?"
}
```

#### Version Control

```
POST /repositories
```

Create a new repository.

Request body:
```json
{
  "name": "DataAnalysisAgent",
  "description": "A powerful agent for data analysis and visualization",
  "type": "agent",
  "isPublic": true,
  "initialContent": {
    "agent.py": "# Agent implementation...",
    "config.json": "{ \"name\": \"DataAnalysisAgent\", ... }",
    "README.md": "# DataAnalysisAgent\n\nA powerful agent for data analysis..."
  }
}
```

```
GET /repositories/{repositoryId}
```

Get repository details.

```
GET /repositories/{repositoryId}/files
```

Get repository files.

```
GET /repositories/{repositoryId}/files/{path}
```

Get file content.

```
POST /repositories/{repositoryId}/branches
```

Create a new branch.

Request body:
```json
{
  "name": "feature/time-series-support",
  "sourceBranchName": "main"
}
```

```
POST /repositories/{repositoryId}/commits
```

Create a commit.

Request body:
```json
{
  "branchName": "feature/time-series-support",
  "message": "Add support for time series data",
  "changes": {
    "agent.py": "# Updated agent implementation...",
    "time_series.py": "# Time series implementation..."
  }
}
```

```
POST /repositories/{repositoryId}/pull-requests
```

Create a pull request.

Request body:
```json
{
  "title": "Add support for time series data",
  "description": "This PR adds support for analyzing time series data...",
  "sourceBranchName": "feature/time-series-support",
  "targetBranchName": "main"
}
```

```
GET /repositories/{repositoryId}/pull-requests
```

Get repository pull requests.

```
GET /pull-requests/{pullRequestId}
```

Get pull request details.

```
POST /pull-requests/{pullRequestId}/merge
```

Merge a pull request.

#### Collaborative Editing

```
POST /documents
```

Create a new collaborative document.

Request body:
```json
{
  "title": "Time Series Analysis Guide",
  "content": "# Introduction to Time Series Analysis\n\n...",
  "type": "guide"
}
```

```
GET /documents/{documentId}
```

Get document content.

```
POST /documents/{documentId}/operations
```

Apply operations to a document.

Request body:
```json
{
  "operations": [
    {
      "type": "insert",
      "position": 42,
      "text": "Time series data has unique characteristics..."
    },
    {
      "type": "delete",
      "position": 100,
      "length": 20
    }
  ]
}
```

```
GET /documents/{documentId}/history
```

Get document edit history.

#### Project Management

```
POST /projects
```

Create a new project.

Request body:
```json
{
  "name": "Time Series Analysis Enhancement",
  "description": "Project to add time series analysis capabilities to DataAnalysisAgent",
  "repositoryId": "repo_01234567-89ab-cdef-0123-456789abcdef"
}
```

```
GET /projects/{projectId}
```

Get project details.

```
POST /projects/{projectId}/milestones
```

Create a milestone.

Request body:
```json
{
  "title": "Time Series MVP",
  "description": "Minimum viable implementation of time series analysis",
  "dueDate": "2025-04-15T00:00:00Z"
}
```

```
POST /projects/{projectId}/tasks
```

Create a task.

Request body:
```json
{
  "title": "Implement ARIMA model support",
  "description": "Add support for ARIMA models for time series forecasting",
  "milestoneId": "milestone_01234567-89ab-cdef-0123-456789abcdef",
  "assigneeId": "user_01234567-89ab-cdef-0123-456789abcdef",
  "dueDate": "2025-04-10T00:00:00Z"
}
```

```
GET /projects/{projectId}/board
```

Get project board with tasks.

### GraphQL API

For more complex queries, a GraphQL API is provided:

```graphql
type Category {
  id: ID!
  name: String!
  description: String
  parentId: ID
  threads: [Thread!]!
}

type Thread {
  id: ID!
  title: String!
  type: String!
  category: Category!
  author: User!
  repository: Repository
  viewCount: Int!
  isSticky: Boolean!
  isLocked: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  posts: [Post!]!
  tags: [Tag!]!
}

type Post {
  id: ID!
  thread: Thread!
  author: User!
  content: String!
  isEdited: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  comments: [Comment!]!
  reactions: [Reaction!]!
}

type Repository {
  id: ID!
  name: String!
  description: String
  type: String!
  owner: User!
  isPublic: Boolean!
  forkedFrom: Repository
  thread: Thread
  branches: [Branch!]!
  pullRequests: [PullRequest!]!
  tags: [Tag!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type PullRequest {
  id: ID!
  title: String!
  description: String
  repository: Repository!
  sourceBranch: Branch!
  targetBranch: Branch!
  createdBy: User!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  mergedAt: DateTime
  mergedBy: User
  comments: [Comment!]!
}

type Project {
  id: ID!
  name: String!
  description: String
  repository: Repository
  owner: User!
  members: [ProjectMember!]!
  milestones: [Milestone!]!
  tasks: [Task!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  categories: [Category!]!
  
  category(id: ID!): Category
  
  threads(
    categoryId: ID,
    type: String,
    tags: [String!],
    page: Int = 1,
    limit: Int = 20
  ): ThreadConnection!
  
  thread(id: ID!): Thread
  
  repositories(
    type: String,
    ownerId: ID,
    page: Int = 1,
    limit: Int = 20
  ): RepositoryConnection!
  
  repository(id: ID!): Repository
  
  pullRequests(
    repositoryId: ID!,
    status: String,
    page: Int = 1,
    limit: Int = 20
  ): PullRequestConnection!
  
  pullRequest(id: ID!): PullRequest
  
  projects(
    ownerId: ID,
    page: Int = 1,
    limit: Int = 20
  ): ProjectConnection!
  
  project(id: ID!): Project
}

type Mutation {
  createThread(
    categoryId: ID!,
    title: String!,
    content: String!,
    type: String!,
    tags: [String!],
    repositoryId: ID
  ): Thread!
  
  createPost(
    threadId: ID!,
    content: String!
  ): Post!
  
  createRepository(
    name: String!,
    description: String,
    type: String!,
    isPublic: Boolean = true,
    initialContent: JSONObject
  ): Repository!
  
  createBranch(
    repositoryId: ID!,
    name: String!,
    sourceBranchName: String
  ): Branch!
  
  createCommit(
    repositoryId: ID!,
    branchName: String!,
    message: String!,
    changes: JSONObject!
  ): Commit!
  
  createPullRequest(
    repositoryId: ID!,
    title: String!,
    description: String,
    sourceBranchName: String!,
    targetBranchName: String!
  ): PullRequest!
  
  mergePullRequest(
    pullRequestId: ID!
  ): PullRequest!
  
  createProject(
    name: String!,
    description: String,
    repositoryId: ID
  ): Project!
  
  createTask(
    projectId: ID!,
    title: String!,
    description: String,
    milestoneId: ID,
    assigneeId: ID,
    dueDate: DateTime
  ): Task!
  
  updateTaskStatus(
    taskId: ID!,
    status: TaskStatus!
  ): Task!
}
```

## Integration with Other Components

### Integration with Decentralized Registry

The Collaborative Forum with Version Control integrates with the Decentralized Registry to:

1. **Publish Agents**: Submit agents from repositories to the registry
2. **Track Registry Status**: Display validation and publication status
3. **Import Registry Data**: Show agent metadata from the registry
4. **Link Discussions**: Connect forum threads to registry entries
5. **Version Synchronization**: Keep versions consistent between systems

### Integration with Reputation System

The forum works with the Reputation System to:

1. **Award Reputation**: Grant reputation for valuable contributions
2. **Display Reputation**: Show user reputation in forum interactions
3. **Unlock Privileges**: Provide additional capabilities based on reputation
4. **Track Quality**: Measure the quality and impact of contributions
5. **Identify Experts**: Highlight domain experts in discussions

### Integration with Search Engine

The forum provides data to the Search Engine to:

1. **Index Content**: Make forum content searchable
2. **Enhance Results**: Provide context for search findings
3. **Track Relevance**: Identify valuable content through engagement
4. **Support Filtering**: Enable filtering by forum categories and tags
5. **Personalize Results**: Tailor search based on forum activity

### Integration with Validation Pipeline

The forum connects with the Validation Pipeline to:

1. **Trigger Validation**: Initiate validation from forum actions
2. **Display Results**: Show validation status in discussions
3. **Discuss Issues**: Create threads for validation problems
4. **Track History**: Show validation results across versions
5. **Suggest Improvements**: Link validation recommendations to discussions

## Security Considerations

### Access Control

The system implements comprehensive access control:

1. **Repository Permissions**: Controls for read, write, and admin access
2. **Forum Moderation**: Tools for managing content and users
3. **Project Roles**: Different permission levels for project members
4. **Content Visibility**: Public, private, and restricted content options
5. **API Security**: Authentication and authorization for all API endpoints

### Content Security

To ensure content security:

1. **Content Validation**: Checking for malicious content
2. **Code Scanning**: Analyzing code for security issues
3. **Markdown Sanitization**: Preventing XSS in rendered content
4. **File Type Restrictions**: Limiting allowed file types
5. **Size Limits**: Enforcing reasonable size limits

### Privacy Protection

To protect user privacy:

1. **Data Minimization**: Collecting only necessary information
2. **Visibility Controls**: User control over profile visibility
3. **Activity Privacy**: Options for private contributions
4. **Notification Preferences**: Control over notification types
5. **Data Retention**: Clear policies for data retention

## Deployment Architecture

The Collaborative Forum with Version Control is deployed using a scalable microservices architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
┌───────────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
│  Forum Service     │ │  Version  │ │  Collab.      │
│                    │ │  Control  │ │  Service      │
└───────────┬───────┘ └─────┬─────┘ └───────┬───────┘
            │               │               │
            └───────┬───────┴───────┬───────┘
                    │               │
        ┌───────────▼───┐   ┌───────▼───────┐
        │ Database      │   │ File Storage  │
        │               │   │               │
        └───────────────┘   └───────────────┘
                    │               │
                    └───────┬───────┘
                            │
                  ┌─────────▼─────────┐
                  │  Search Index     │
                  │                   │
                  └───────────────────┘
```

### Scaling Considerations

1. **Horizontal Scaling**: Each service can be independently scaled
2. **Database Sharding**: Partitioning data for large-scale deployments
3. **Caching Layer**: Redis cache for frequently accessed data
4. **CDN Integration**: Content delivery network for static assets
5. **Load Balancing**: Distributing requests across service instances

## Future Enhancements

Potential future enhancements to the system include:

1. **AI-Assisted Collaboration**: Intelligent suggestions and summaries
2. **Advanced Analytics**: Deeper insights into collaboration patterns
3. **Integration Marketplace**: Plugins for third-party tools
4. **Mobile Applications**: Native mobile experience
5. **Workflow Automation**: Automated actions based on events
6. **Enhanced Visualization**: Better visualization of version differences
7. **Translation Support**: Multi-language collaboration

## Conclusion

The Collaborative Forum with Version Control specification provides a comprehensive framework for community collaboration, knowledge sharing, and iterative improvement of AI agents and workflows. By combining modern forum capabilities with sophisticated version control, the system creates a powerful platform for collaborative development.

The modular architecture allows for flexibility and extensibility, while the integration with other AGENTNEXUS components creates a cohesive platform experience. The security considerations ensure responsible collaboration practices, and the deployment architecture supports scalability to handle a growing community.

This system will be a key differentiator for AGENTNEXUS, enabling developers to share, discuss, and evolve their work in a structured environment, fostering a vibrant community of AI agent developers.
