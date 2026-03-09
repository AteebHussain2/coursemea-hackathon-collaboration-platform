import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    type: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['TaskAssigned', 'CommentAdded', 'ProjectCreated', 'Mentioned'],
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for fetching user notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
