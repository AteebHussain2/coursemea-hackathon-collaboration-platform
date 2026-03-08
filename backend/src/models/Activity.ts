import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
    workspaceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: string;
    entityId: mongoose.Types.ObjectId;
    entityType: 'Workspace' | 'Project' | 'Task' | 'Comment' | 'Member';
    details?: string;
}

const activitySchema = new Schema<IActivity>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        entityType: {
            type: String,
            enum: ['Workspace', 'Project', 'Task', 'Comment', 'Member'],
            required: true,
        },
        details: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for fetching activity logs for a workspace
activitySchema.index({ workspaceId: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', activitySchema);
