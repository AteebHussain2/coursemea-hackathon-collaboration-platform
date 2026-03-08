import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    workspaceId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
    deadline: Date;
    members: mongoose.Types.ObjectId[];
}

const projectSchema = new Schema<IProject>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a project name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            default: '',
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        status: {
            type: String,
            enum: ['Active', 'On Hold', 'Completed', 'Archived'],
            default: 'Active',
        },
        deadline: {
            type: Date,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

// Index for filtering projects by workspace
projectSchema.index({ workspaceId: 1 });

export default mongoose.model<IProject>('Project', projectSchema);
