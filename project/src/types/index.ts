export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Agent';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Category {
  id: string;
  name: string;
  nameAR: string;
  icon: string;
  color: string;
  description: string;
  descriptionAR: string;
  scenarios: Scenario[];
  order: number;
  isActive: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  nameAR: string;
  categoryId: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface Problem {
  id: string;
  title: string;
  titleAR: string;
  categoryId: string;
  scenarioId: string;
  priority: 'high' | 'medium' | 'low';
  status: 'resolved' | 'pending' | 'investigating';
  faqLevels: FAQLevel[];
  verificationSteps: VerificationStep[];
  clearPath?: ClearPath;
  unclearPath?: UnclearPath;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FAQLevel {
  id: string;
  level: number;
  question: string;
  questionAR: string;
  answer: string;
  answerAR: string;
  isRequired: boolean;
}

export interface VerificationStep {
  id: string;
  step: string;
  stepAR: string;
  order: number;
  isRequired: boolean;
}

export interface ClearPath {
  id: string;
  instructions: Instruction[];
  script?: Script;
}

export interface UnclearPath {
  id: string;
  primaryOptions: PrimaryOption[];
  secondaryOptions: SecondaryOption[];
  resultMappings: ResultMapping[];
}

export interface PrimaryOption {
  id: string;
  label: string;
  labelAR: string;
  order: number;
}

export interface SecondaryOption {
  id: string;
  label: string;
  labelAR: string;
  order: number;
}

export interface ResultMapping {
  id: string;
  primaryOptionId: string;
  secondaryOptionId: string;
  instructions: Instruction[];
  script?: Script;
}

export interface Instruction {
  id: string;
  content: string;
  contentAR: string;
  order: number;
  type: 'text' | 'action' | 'warning' | 'info';
}

export interface Script {
  id: string;
  title: string;
  titleAR: string;
  content: string;
  contentAR: string;
  category: string;
  tags: string[];
  color?: string;
  isTemplate: boolean;
  variables: ScriptVariable[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ScriptVariable {
  id: string;
  name: string;
  placeholder: string;
  description: string;
  isRequired: boolean;
}

export interface ActivityLog {
  id: string;
  action: 'Added' | 'Edited' | 'Deleted';
  entityType: 'Category' | 'Scenario' | 'Problem' | 'Script' | 'User';
  entityId: string;
  entityName: string;
  changes?: Record<string, any>;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface SearchResult {
  id: string;
  type: 'problem' | 'script' | 'category' | 'scenario';
  title: string;
  content: string;
  category: string;
  relevance: number;
  highlights: string[];
}