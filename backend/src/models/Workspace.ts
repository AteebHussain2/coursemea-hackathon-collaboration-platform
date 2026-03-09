import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspace extends Document {
    name: string;
    description: string;
    logoUrl: string;
    ownerId: mongoose.Types.ObjectId;
    inviteToken: string;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a workspace name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            default: '',
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        logoUrl: {
            type: String,
            default: '',
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        inviteToken: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
);

// Create index for performance
workspaceSchema.index({ ownerId: 1 });

export default mongoose.model<IWorkspace>('Workspace', workspaceSchema);
