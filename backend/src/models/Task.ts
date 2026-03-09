import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    projectId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'Todo' | 'In Progress' | 'Review' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: Date;
    assignedTo?: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;
    attachments?: Array<{
        name: string;
        url: string;
        fileType: string;
    }>;
}

const taskSchema = new Schema<ITask>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            default: '',
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Review', 'Done'],
            default: 'Todo',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attachments: [
            {
                name: String,
                url: String,
                fileType: String,
            },
        ],
    },
    { timestamps: true }
);

// Index for filtering tasks by project
taskSchema.index({ projectId: 1 });
// Index for filtering tasks by assigned user
taskSchema.index({ assignedTo: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
