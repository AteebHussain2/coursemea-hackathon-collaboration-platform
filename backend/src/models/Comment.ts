import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    mentions?: mongoose.Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
    {
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Comment content cannot be empty'],
            trim: true,
            maxlength: [2000, 'Comment cannot be more than 2000 characters'],
        },
        mentions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

// Index for fetching comments for a task
commentSchema.index({ taskId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', commentSchema);
