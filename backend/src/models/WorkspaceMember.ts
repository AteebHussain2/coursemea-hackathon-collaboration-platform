import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspaceMember extends Document {
    workspaceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: 'Admin' | 'Member' | 'Guest';
    joinedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
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
        role: {
            type: String,
            enum: ['Admin', 'Member', 'Guest'],
            default: 'Member',
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate memberships
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IWorkspaceMember>('WorkspaceMember', workspaceMemberSchema);
