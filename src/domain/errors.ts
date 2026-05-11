export class DomainValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class DuplicateContentIdError extends DomainValidationError {}
export class MissingQuestionMetadataError extends DomainValidationError {}
export class BrokenRuleTraceLinkError extends DomainValidationError {}
export class EmptyAssessmentBucketError extends DomainValidationError {}
export class MissingPrerequisiteError extends DomainValidationError {}

export class ProgressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ProgressParseError extends ProgressError {}
export class ProgressSchemaError extends ProgressError {}
export class OrphanedProgressError extends ProgressError {}
export class StorageUnavailableError extends ProgressError {}
export class StorageQuotaExceededError extends ProgressError {}
export class ProgressMigrationError extends ProgressError {}
