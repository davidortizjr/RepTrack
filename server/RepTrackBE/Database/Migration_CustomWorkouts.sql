-- Migration: Create ProgramExercises junction table for custom workouts
-- This table links exercises to programs (including custom workouts) with ordering

-- Create the ProgramExercises junction table
CREATE TABLE ProgramExercises (
    ProgramExerciseId INT PRIMARY KEY IDENTITY(1,1),
    ProgramId INT NOT NULL,
    ExerciseId INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    
    CONSTRAINT FK_ProgramExercises_Program FOREIGN KEY (ProgramId) 
        REFERENCES Programs(ProgramId) ON DELETE CASCADE,
    CONSTRAINT FK_ProgramExercises_Exercise FOREIGN KEY (ExerciseId) 
        REFERENCES Exercises(ExerciseId) ON DELETE CASCADE,
    
    -- Ensure no duplicate exercise in same program
    CONSTRAINT UQ_ProgramExercises_ProgramExercise UNIQUE (ProgramId, ExerciseId)
);

-- Create index for faster queries
CREATE INDEX IX_ProgramExercises_ProgramId ON ProgramExercises(ProgramId);
CREATE INDEX IX_ProgramExercises_ExerciseId ON ProgramExercises(ExerciseId);

GO

-- Optional: Add UserId column to Programs table if it doesn't exist
-- (Skip this if your Programs table already has UserId)
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('Programs') AND name = 'UserId'
)
BEGIN
    ALTER TABLE Programs
    ADD UserId INT NULL;
    
    -- Add foreign key constraint
    ALTER TABLE Programs
    ADD CONSTRAINT FK_Programs_User FOREIGN KEY (UserId) 
        REFERENCES Users(UserId);
END
GO
