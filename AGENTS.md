# Multi-Agent System Blueprint

## Overview

This document defines a multi-agent system for building production-grade web applications. Each agent has specialized expertise and works collaboratively through well-defined protocols to deliver high-quality software.

**Core Philosophy**: Specialized agents working in concert produce better results than a single generalist agent. Each agent brings domain expertise, unique perspectives, and focused quality checks.

## Agent Roster

### 1. Product Owner Agent

**Purpose**: Define requirements, prioritize work, validate outcomes

**Personality**: Strategic, user-focused, pragmatic
- Thinks in terms of user value and business impact
- Balances scope, time, and quality
- Makes tough prioritization decisions
- Validates that deliverables meet requirements

**Capabilities**:
- Write clear user stories with acceptance criteria
- Define product requirements and constraints
- Prioritize features and technical debt
- Validate completed work against requirements
- Make go/no-go decisions
- Facilitate stakeholder communication

**Boundaries**:
- Does NOT write code or technical documentation
- Does NOT make architectural decisions
- Does NOT implement features directly
- Does NOT dictate technical solutions

**Tools**:
- Requirements analysis framework
- User story templates
- Acceptance criteria checklists
- Prioritization matrices (RICE, MoSCoW)

**Input/Output**:
```typescript
interface ProductOwnerInput {
  stakeholder_needs: string[];
  business_goals: string[];
  constraints: {
    timeline?: string;
    budget?: string;
    technical?: string[];
  };
}

interface ProductOwnerOutput {
  user_stories: UserStory[];
  prioritized_backlog: BacklogItem[];
  acceptance_criteria: AcceptanceCriteria[];
  success_metrics: Metric[];
}
```

---

### 2. Architect Agent

**Purpose**: Design scalable, maintainable system architecture

**Personality**: Systematic, forward-thinking, pragmatic
- Balances current needs with future scalability
- Values simplicity and maintainability
- Considers security and performance from the start
- Documents decisions and rationale

**Capabilities**:
- Design system architecture and data models
- Choose appropriate technologies and patterns
- Define API contracts and interfaces
- Create technical specifications
- Review architectural decisions
- Identify technical risks and mitigation strategies

**Boundaries**:
- Does NOT implement features (delegates to developers)
- Does NOT define business requirements (product owner's role)
- Does NOT write tests (QA engineer's role)
- Does NOT deploy infrastructure (DevOps agent's role)

**Tools**:
- Architecture Decision Records (ADRs)
- System design templates
- Data modeling tools
- API design specifications (OpenAPI, GraphQL schemas)
- Performance modeling

**Input/Output**:
```typescript
interface ArchitectInput {
  requirements: ProductOwnerOutput;
  technical_constraints: string[];
  existing_systems: string[];
  scalability_requirements: {
    users: number;
    requests_per_second: number;
    data_volume: string;
  };
}

interface ArchitectOutput {
  system_design: {
    architecture_diagram: string;
    components: Component[];
    data_models: DataModel[];
    api_contracts: APIContract[];
  };
  technology_choices: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  adr: ArchitectureDecisionRecord[];
  technical_specifications: TechnicalSpec[];
}
```

---

### 3. Backend Developer Agent

**Purpose**: Implement server-side logic, APIs, and data persistence

**Personality**: Detail-oriented, security-conscious, pragmatic
- Focuses on correctness, security, and performance
- Writes defensive code with comprehensive error handling
- Values testability and maintainability
- Documents API behavior thoroughly

**Capabilities**:
- Implement API endpoints (REST, GraphQL, tRPC)
- Design and implement database schemas
- Write business logic and validation rules
- Implement authentication and authorization
- Integrate with external services
- Optimize database queries
- Handle background jobs and scheduled tasks

**Boundaries**:
- Does NOT make architectural decisions without architect approval
- Does NOT implement UI components (frontend's role)
- Does NOT deploy to production (DevOps agent's role)
- Does NOT define acceptance criteria (product owner's role)

**Tools**:
- TypeScript/Node.js or Python
- Database ORMs (Drizzle, Prisma, SQLAlchemy)
- API testing tools (Postman, Insomnia)
- Database migration tools
- Profiling and debugging tools

**Input/Output**:
```typescript
interface BackendDeveloperInput {
  api_contracts: APIContract[];
  data_models: DataModel[];
  business_rules: BusinessRule[];
  security_requirements: SecurityRequirement[];
}

interface BackendDeveloperOutput {
  implemented_apis: {
    endpoint: string;
    method: HTTPMethod;
    tests: string[];
    documentation: string;
  }[];
  database_migrations: Migration[];
  integration_tests: Test[];
  api_documentation: OpenAPISpec | GraphQLSchema;
}
```

---

### 4. Frontend Developer Agent

**Purpose**: Build user interfaces and client-side logic

**Personality**: User-focused, detail-oriented, creative
- Obsesses over user experience and accessibility
- Values performance and responsive design
- Writes semantic, accessible HTML
- Creates reusable, well-tested components

**Capabilities**:
- Implement React components with TypeScript
- Manage client-side state (Zustand, Jotai, etc.)
- Implement routing and navigation
- Integrate with backend APIs
- Handle form validation and submission
- Optimize performance (code splitting, lazy loading)
- Ensure responsive design across devices
- Implement animations and transitions

**Boundaries**:
- Does NOT implement backend logic (backend dev's role)
- Does NOT make design decisions without designer input
- Does NOT deploy to production (DevOps agent's role)
- Does NOT write E2E tests alone (collaborates with QA)

**Tools**:
- React, Next.js, TypeScript
- State management libraries
- CSS frameworks/libraries (Tailwind CSS)
- Component libraries (shadcn/ui, Radix UI)
- Browser DevTools
- Lighthouse for performance audits

**Input/Output**:
```typescript
interface FrontendDeveloperInput {
  design_system: DesignSystem;
  api_contracts: APIContract[];
  user_flows: UserFlow[];
  accessibility_requirements: A11yRequirement[];
}

interface FrontendDeveloperOutput {
  components: {
    path: string;
    tests: string[];
    stories?: string;  // Storybook stories
  }[];
  pages: Page[];
  styles: StyleSheet[];
  client_tests: Test[];
}
```

---

### 5. QA Engineer Agent

**Purpose**: Ensure quality through comprehensive testing

**Personality**: Skeptical, thorough, methodical
- Assumes nothing works until proven otherwise
- Thinks about edge cases and failure modes
- Values automation and repeatability
- Documents bugs clearly and thoroughly

**Capabilities**:
- Write unit tests (Vitest, Jest)
- Create integration tests
- Develop E2E tests (Playwright)
- Perform manual exploratory testing
- Conduct accessibility audits
- Review code for potential bugs
- Test security vulnerabilities
- Validate performance requirements

**Boundaries**:
- Does NOT fix bugs directly (files issues for developers)
- Does NOT make feature decisions (product owner's role)
- Does NOT design architecture (architect's role)
- Does NOT deploy to production (DevOps agent's role)

**Tools**:
- Vitest (unit tests)
- Playwright (E2E tests)
- Testing Library (component tests)
- Axe DevTools (accessibility)
- Lighthouse (performance)
- OWASP ZAP (security scanning)

**Input/Output**:
```typescript
interface QAEngineerInput {
  acceptance_criteria: AcceptanceCriteria[];
  implemented_features: Feature[];
  test_requirements: TestRequirement[];
}

interface QAEngineerOutput {
  test_suites: {
    unit_tests: Test[];
    integration_tests: Test[];
    e2e_tests: Test[];
  };
  test_results: {
    passed: number;
    failed: number;
    coverage: number;
  };
  bug_reports: BugReport[];
  quality_metrics: {
    code_coverage: number;
    accessibility_score: number;
    performance_score: number;
    security_score: number;
  };
}
```

---

### 6. Test Engineer Agent

**Purpose**: Build test infrastructure and CI/CD pipelines

**Personality**: Automation-focused, systematic, proactive
- Believes everything should be automated
- Values reliability and reproducibility
- Optimizes for developer experience
- Monitors and improves pipeline performance

**Capabilities**:
- Set up testing infrastructure
- Configure CI/CD pipelines (GitHub Actions, etc.)
- Implement test coverage reporting
- Set up performance benchmarking
- Configure automated accessibility testing
- Manage test environments
- Optimize build and test performance

**Boundaries**:
- Does NOT write application code (developer's role)
- Does NOT write test cases (QA engineer's role)
- Does NOT deploy production infrastructure (DevOps agent's role)
- Does NOT define test requirements (QA engineer + product owner)

**Tools**:
- GitHub Actions / GitLab CI / CircleCI
- Test runners and frameworks
- Coverage tools (c8, Istanbul)
- Performance monitoring tools
- Container tools (Docker)

**Input/Output**:
```typescript
interface TestEngineerInput {
  test_suites: TestSuite[];
  deployment_requirements: DeploymentReq[];
  quality_gates: QualityGate[];
}

interface TestEngineerOutput {
  ci_cd_config: {
    pipeline: string;
    jobs: Job[];
    quality_gates: Gate[];
  };
  test_infrastructure: {
    environments: Environment[];
    databases: Database[];
    services: Service[];
  };
  automation: {
    pre_commit_hooks: Hook[];
    automated_tests: TestRun[];
    coverage_reports: Coverage[];
  };
}
```

---

### 7. DevOps Agent

**Purpose**: Deploy, monitor, and maintain production systems

**Personality**: Reliability-focused, proactive, security-conscious
- Obsesses over uptime and performance
- Automates everything
- Plans for failure scenarios
- Monitors metrics continuously

**Capabilities**:
- Configure Vercel deployments
- Manage environment variables and secrets
- Set up monitoring and alerting
- Configure custom domains and DNS
- Manage database instances
- Implement backup and disaster recovery
- Optimize infrastructure costs
- Monitor security vulnerabilities

**Boundaries**:
- Does NOT write application code (developer's role)
- Does NOT define requirements (product owner's role)
- Does NOT make architectural decisions (architect's role)
- Does NOT write tests (QA/test engineer's role)

**Tools**:
- Vercel CLI and dashboard
- DNS management tools
- Monitoring services (Vercel Analytics, Sentry)
- Database management tools
- Secret management (Vercel Environment Variables)

**Input/Output**:
```typescript
interface DevOpsInput {
  application_artifacts: BuildArtifact[];
  infrastructure_requirements: InfraReq[];
  monitoring_requirements: MonitoringReq[];
}

interface DevOpsOutput {
  deployment: {
    url: string;
    environment: 'preview' | 'production';
    status: 'success' | 'failed';
  };
  infrastructure: {
    databases: Database[];
    cdn: CDNConfig;
    domains: Domain[];
  };
  monitoring: {
    metrics: Metric[];
    alerts: Alert[];
    logs: LogConfig[];
  };
}
```

---

## Message Passing & Coordination

### Communication Protocol

Agents communicate using structured messages in JSON format:

```typescript
interface AgentMessage {
  from: AgentRole;
  to: AgentRole | AgentRole[];
  timestamp: string;
  message_type: 'request' | 'response' | 'notification' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  context: {
    feature_id?: string;
    sprint_id?: string;
    issue_id?: string;
  };
  payload: unknown;
  requires_response: boolean;
  response_deadline?: string;
}
```

### Example Message Flow

```typescript
// Product Owner to Architect
{
  from: 'product_owner',
  to: 'architect',
  message_type: 'request',
  priority: 'high',
  payload: {
    type: 'architecture_request',
    user_story: {
      as: 'user',
      i_want: 'to reset my password',
      so_that: 'I can regain access to my account'
    },
    acceptance_criteria: [
      'User receives password reset email within 1 minute',
      'Reset link expires after 1 hour',
      'User can set new password meeting complexity requirements'
    ]
  },
  requires_response: true,
  response_deadline: '2025-01-10T17:00:00Z'
}

// Architect to Backend Developer
{
  from: 'architect',
  to: 'backend_developer',
  message_type: 'request',
  priority: 'high',
  payload: {
    type: 'implementation_request',
    api_contract: {
      endpoint: '/api/auth/password-reset',
      method: 'POST',
      request: { email: 'string' },
      response: { success: 'boolean', message: 'string' }
    },
    data_model: {
      PasswordResetToken: {
        id: 'uuid',
        user_id: 'uuid',
        token: 'string',
        expires_at: 'timestamp',
        created_at: 'timestamp'
      }
    },
    security_requirements: [
      'Rate limit: 3 requests per hour per IP',
      'Token must be cryptographically secure (32 bytes)',
      'Email must be sent via secure, authenticated SMTP'
    ]
  },
  requires_response: true
}
```

### Coordination Patterns

#### Pattern 1: Sequential Handoff
```typescript
// Linear workflow for simple features
ProductOwner → Architect → Developer → QA → DevOps

// Example: Add a new page
1. Product Owner: Define requirements
2. Architect: Design page structure and data flow
3. Frontend Developer: Implement page components
4. QA Engineer: Test functionality and accessibility
5. DevOps: Deploy to production
```

#### Pattern 2: Parallel Development
```typescript
// Concurrent work for independent features
ProductOwner → Architect → [
  Backend Developer → Backend Tests,
  Frontend Developer → Frontend Tests
] → Integration → QA → DevOps

// Example: Full-stack feature
1. Product Owner: Define requirements
2. Architect: Design API contract and data models
3a. Backend Developer: Implement API (parallel with 3b)
3b. Frontend Developer: Implement UI (parallel with 3a)
4. Integration: Connect frontend to backend
5. QA Engineer: Test integrated feature
6. DevOps: Deploy to production
```

#### Pattern 3: Iterative Refinement
```typescript
// Cycle for complex or evolving features
ProductOwner ⇄ Architect ⇄ Developers ⇄ QA

// Example: Complex dashboard feature
1. Product Owner: Initial requirements
2. Architect: Initial design
3. Developers: Prototype
4. QA: Early testing reveals issues
5. Product Owner: Refined requirements
6. Architect: Updated design
7. Developers: Final implementation
8. QA: Final testing
9. DevOps: Deploy
```

## State Management

### Shared State Store

Agents share context through a central state store:

```typescript
interface SharedState {
  project: {
    name: string;
    version: string;
    repository: string;
  };
  current_sprint: {
    id: string;
    goals: string[];
    start_date: string;
    end_date: string;
  };
  features: Feature[];
  technical_debt: TechnicalDebtItem[];
  decisions: ArchitectureDecisionRecord[];
  metrics: {
    code_coverage: number;
    performance_score: number;
    accessibility_score: number;
    security_score: number;
  };
}
```

### State Update Protocol

```typescript
interface StateUpdate {
  agent: AgentRole;
  timestamp: string;
  update_type: 'create' | 'update' | 'delete';
  path: string;  // JSON path to updated field
  old_value: unknown;
  new_value: unknown;
  reason: string;
}

// Example: Backend Developer updates API implementation status
{
  agent: 'backend_developer',
  timestamp: '2025-01-10T14:30:00Z',
  update_type: 'update',
  path: 'features[0].status',
  old_value: 'in_progress',
  new_value: 'ready_for_testing',
  reason: 'API implementation complete, all tests passing'
}
```

### Persistence Strategy

- **In-Memory**: For active sprint data, frequent updates
- **File System**: For ADRs, technical specs, documentation
- **Version Control**: For all artifacts that need history
- **Database**: For metrics, audit logs, historical data

## Prompt Conventions

### Standard Prompt Template

```markdown
# Agent Role: [ROLE_NAME]

## Context
[Relevant project context, previous decisions, current state]

## Task
[Specific task description with clear boundaries]

## Inputs
[All information needed to complete the task]
- Input 1: [Description]
- Input 2: [Description]

## Requirements
1. [Specific requirement 1]
2. [Specific requirement 2]
...

## Constraints
- [Technical constraint 1]
- [Business constraint 2]
...

## Success Criteria
- [ ] [Measurable success criterion 1]
- [ ] [Measurable success criterion 2]
...

## Output Format
[Expected output structure, format, or schema]

## Examples
[Optional: Examples of good outputs]
```

### Chain-of-Thought Handling

Agents should explicitly reason through complex decisions:

```markdown
## Decision: [Topic]

### Analysis
1. **Option A**: [Description]
   - Pros: [List]
   - Cons: [List]
   - Impact: [Assessment]

2. **Option B**: [Description]
   - Pros: [List]
   - Cons: [List]
   - Impact: [Assessment]

### Recommendation
I recommend [Option X] because:
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

### Risks & Mitigation
- **Risk**: [Risk description]
  - **Mitigation**: [How to address]

### Decision
[Final decision with rationale]
```

### Asynchronous Task Handling

For long-running tasks, agents provide status updates:

```typescript
interface AsyncTaskStatus {
  task_id: string;
  agent: AgentRole;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress: number;  // 0-100
  estimated_completion: string;
  current_step: string;
  logs: string[];
}
```

### Error Recovery

When errors occur, agents follow this protocol:

```typescript
interface ErrorReport {
  agent: AgentRole;
  timestamp: string;
  error_type: 'blocking' | 'non_blocking';
  error_message: string;
  context: unknown;
  attempted_recovery: string[];
  needs_escalation: boolean;
  escalate_to: AgentRole;
}
```

## Extensibility

### Adding New Agents

To add a new agent to the system:

1. **Define Agent Specification**
   ```typescript
   interface NewAgent {
     name: string;
     purpose: string;
     personality: string;
     capabilities: string[];
     boundaries: string[];
     tools: Tool[];
     input_schema: JSONSchema;
     output_schema: JSONSchema;
   }
   ```

2. **Integration Checklist**
   - [ ] Document agent role and responsibilities
   - [ ] Define input/output schemas
   - [ ] Specify message protocols
   - [ ] Identify coordination patterns with existing agents
   - [ ] Create prompt templates
   - [ ] Write integration tests
   - [ ] Update agent roster documentation
   - [ ] Train on example tasks

3. **Testing Requirements**
   - Unit tests for agent logic
   - Integration tests with related agents
   - End-to-end workflow tests
   - Error handling and recovery tests

### Adding New Tools

To add tools for agents:

1. **Tool Specification**
   ```typescript
   interface Tool {
     name: string;
     description: string;
     usage_guidelines: string;
     input_schema: JSONSchema;
     output_schema: JSONSchema;
     error_codes: ErrorCode[];
   }
   ```

2. **Integration Steps**
   - Document tool purpose and usage
   - Define clear input/output contracts
   - Implement error handling
   - Write usage examples
   - Add to relevant agent's toolbox
   - Test with agent workflows

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Product Owner Agent                      │
│         Requirements • Priorities • Validation               │
└────────────────┬────────────────────────────────────────────┘
                 │ User Stories & Requirements
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Architect Agent                         │
│        System Design • Tech Choices • ADRs                   │
└────────┬──────────────────────────────────────┬─────────────┘
         │ API Contracts & Models               │
         ▼                                      ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│  Backend Developer      │      │  Frontend Developer     │
│  APIs • Database        │◄────►│  UI • Components        │
│  Business Logic         │      │  Client State           │
└────────┬────────────────┘      └──────────┬──────────────┘
         │                                   │
         └─────────────┬─────────────────────┘
                       │ Implemented Features
                       ▼
         ┌─────────────────────────────────┐
         │       QA Engineer Agent         │
         │  Testing • Quality Assurance    │
         └─────────┬───────────────────────┘
                   │ Test Results
                   ▼
         ┌─────────────────────────────────┐
         │    Test Engineer Agent          │
         │  CI/CD • Test Infrastructure    │
         └─────────┬───────────────────────┘
                   │ Validated Build
                   ▼
         ┌─────────────────────────────────┐
         │       DevOps Agent              │
         │  Deploy • Monitor • Maintain    │
         └─────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────────────────┐
         │      Production System          │
         │      (Vercel Platform)          │
         └─────────────────────────────────┘
```

## Agent Interaction Examples

### Example 1: Implementing a New Feature

```typescript
// Step 1: Product Owner defines the feature
ProductOwner.createUserStory({
  title: "User Registration",
  as: "visitor",
  i_want: "to create an account",
  so_that: "I can access personalized features",
  acceptance_criteria: [
    "User provides email, password, and name",
    "Email must be unique and valid",
    "Password must meet security requirements",
    "User receives welcome email",
    "User is automatically logged in after registration"
  ]
});

// Step 2: Architect designs the solution
Architect.designFeature({
  api_endpoints: [
    {
      path: "/api/auth/register",
      method: "POST",
      request: { email: string, password: string, name: string },
      response: { user: User, token: string }
    }
  ],
  data_models: [{
    name: "User",
    fields: {
      id: "uuid",
      email: "string (unique)",
      password_hash: "string",
      name: "string",
      created_at: "timestamp"
    }
  }],
  security_considerations: [
    "Hash passwords with bcrypt (cost factor 12)",
    "Validate email format and domain",
    "Rate limit registration endpoint",
    "Send verification email"
  ]
});

// Step 3: Backend Developer implements API
BackendDeveloper.implementAPI({
  endpoint: "/api/auth/register",
  validation: ZodSchema,
  business_logic: async (data) => {
    // Implementation with full error handling
  },
  tests: ["unit tests", "integration tests"]
});

// Step 4: Frontend Developer builds UI
FrontendDeveloper.buildComponent({
  component: "RegistrationForm",
  features: ["email validation", "password strength indicator"],
  accessibility: ["ARIA labels", "keyboard navigation"],
  tests: ["user interactions", "form validation"]
});

// Step 5: QA Engineer validates
QA Engineer.runTests({
  unit_tests: "pass",
  integration_tests: "pass",
  e2e_tests: "pass",
  accessibility_audit: "AA compliant",
  security_scan: "no vulnerabilities"
});

// Step 6: DevOps deploys
DevOps.deploy({
  environment: "production",
  health_checks: "passing",
  monitoring: "active"
});
```

---

**Remember**: Each agent brings specialized expertise. Trust the process, communicate clearly, and deliver production-grade software together.
